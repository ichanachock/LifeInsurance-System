import plans from "../data/plans.json";
import rateTable from "../data/premiumRates.json";
import realPremiumRates from "../data/realPremiumRates.json";
import riderPremiumRates from "../data/riderPremiumRates.json";

function getAgeRate(age) {
  const band = rateTable.ageBands.find((item) => age >= item.from && age <= item.to);
  return band ? band.ratePerThousand : null;
}

function getPlan(planId) {
  return plans.find((plan) => plan.id === planId) || plans[0];
}

function getPayYearFactor(payYears) {
  const match = rateTable.payYearFactors.find((item) => payYears <= item.maxYears);
  return match ? match.factor : 1;
}

function getPaymentMode(modeId) {
  return rateTable.paymentModes.find((mode) => mode.id === modeId) || rateTable.paymentModes[0];
}

function getRealPremiumRate(planId, gender, age) {
  return realPremiumRates.find(
    (rate) => rate.planId === planId && rate.gender === gender && Number(rate.age) === Number(age)
  );
}

function getModeSuffix(modeId) {
  const suffixByMode = {
    annual: "01",
    semiannual: "02",
    quarterly: "04",
    monthly: "12"
  };

  return suffixByMode[modeId] || "01";
}

function getRiderPremiumRate(riderCode, gender, riderClass, modeId) {
  const candidates = riderPremiumRates.filter(
    (rate) => rate.riderCode === riderCode && (!rate.gender || rate.gender === gender)
  );

  if (!candidates.length) return null;

  const modeSuffix = getModeSuffix(modeId);
  const ranked = candidates
    .map((rate) => {
      let score = 0;

      if (rate.gender === gender) score += 8;
      if (!rate.gender) score += 2;
      if (rate.riderClass === riderClass) score += 4;
      if (!rate.riderClass) score += 1;
      if (String(rate.itemCode || "").endsWith(modeSuffix)) score += 3;
      if (String(rate.itemCode || "").endsWith("01")) score += 1;

      return { rate, score };
    })
    .sort((a, b) => b.score - a.score || String(a.rate.itemCode).localeCompare(String(b.rate.itemCode)));

  return ranked[0].rate;
}

function calculateRiderPremiums(input, sumAssured, mode) {
  const selectedRiders = input.selectedRiders || [];
  const riderClass = input.riderClass || "1";
  const rows = [];
  let annualPremium = 0;

  selectedRiders.forEach((riderCode) => {
    const rate = getRiderPremiumRate(riderCode, input.gender, riderClass, mode.id);

    if (!rate) {
      rows.push({
        riderCode,
        found: false
      });
      return;
    }

    const premium = Math.round((sumAssured / rate.sumUnit) * rate.ratePerSumUnit);
    annualPremium += premium;
    rows.push({
      riderCode,
      found: true,
      annualPremium: premium,
      itemCode: rate.itemCode,
      sourceTable: rate.sourceTable,
      ratePerSumUnit: rate.ratePerSumUnit,
      sumUnit: rate.sumUnit
    });
  });

  return {
    annualPremium,
    modalPremium: Math.round(annualPremium * mode.multiplier),
    rows,
    missing: rows.filter((row) => !row.found).map((row) => row.riderCode)
  };
}

function getPrototypePremium(input, plan, mode, age, sumAssured, payYears) {
  const ratePerThousand = getAgeRate(age);

  if (!ratePerThousand || sumAssured < rateTable.minimumSumAssured) {
    return {
      valid: false,
      message: "กรุณากรอกอายุและทุนประกันให้ถูกต้อง"
    };
  }

  const baseAnnual =
    (sumAssured / 1000) *
    ratePerThousand *
    (rateTable.genderFactors[input.gender] || 1) *
    (rateTable.healthFactors[input.healthClass] || 1) *
    plan.factor;

  const annualPremium = Math.round(baseAnnual * getPayYearFactor(payYears));
  const modalPremium = Math.round(annualPremium * mode.multiplier);

  return {
    valid: true,
    annualPremium,
    modalPremium,
    ratePerThousand,
    paymentMode: mode.id,
    paymentModeName: mode.name,
    planName: plan.name,
    source: "prototype"
  };
}

export function calculatePremium(input) {
  const age = Number(input.age) || 0;
  const sumAssured = Number(input.sumAssured) || 0;
  const payYears = Number(input.payYears) || 20;
  const mode = getPaymentMode(input.paymentMode || "monthly");
  const plan = getPlan(input.planType);

  if (age < 0 || sumAssured < rateTable.minimumSumAssured) {
    return {
      valid: false,
      message: "กรุณากรอกอายุและทุนประกันให้ถูกต้อง"
    };
  }

  const realRate = getRealPremiumRate(plan.id, input.gender, age);

  if (!realRate && plan.category === "real-rate") {
    return {
      valid: false,
      message: `ไม่พบเบี้ยจริงสำหรับอายุ ${age} ปี / ${input.gender === "male" ? "ชาย" : "หญิง"} ในแผนนี้`
    };
  }

  if (!realRate) {
    return getPrototypePremium(input, plan, mode, age, sumAssured, payYears);
  }

  const baseAnnualPremium = Math.round((sumAssured / realRate.sumUnit) * realRate.ratePerSumUnit);
  const riderPremium = calculateRiderPremiums(input, sumAssured, mode);
  const annualPremium = baseAnnualPremium + riderPremium.annualPremium;
  const modalPremium = Math.round(annualPremium * mode.multiplier);

  return {
    valid: true,
    annualPremium,
    modalPremium,
    baseAnnualPremium,
    baseModalPremium: Math.round(baseAnnualPremium * mode.multiplier),
    riderAnnualPremium: riderPremium.annualPremium,
    riderModalPremium: riderPremium.modalPremium,
    riders: riderPremium.rows,
    missingRiders: riderPremium.missing,
    ratePerThousand: realRate.ratePerSumUnit,
    rateUnit: realRate.sumUnit,
    paymentMode: mode.id,
    paymentModeName: mode.name,
    planName: plan.name,
    source: "real",
    sourceTable: realRate.sourceTable,
    itemCode: realRate.itemCode
  };
}

export function formatBaht(value) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value || 0);
}
