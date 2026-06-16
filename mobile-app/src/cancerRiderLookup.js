import riderContracts from "../data/riderContracts.json";
import riderPremiumRates from "../data/riderPremiumRates.json";

function normalizeAmount(value) {
  return Number(String(value || "").replace(/,/g, "")) || 0;
}

function getCoverageAmount(name) {
  const match = String(name || "").match(/([\d,]+)(?=\s*(?:\[|$))/);
  return match ? normalizeAmount(match[1]) : 0;
}

function getPaymentType(name) {
  return String(name || "").includes("รายเดือน") ? "monthly" : "normal";
}

function getGenderFromCode(code) {
  if (String(code).startsWith("M")) return "male";
  if (String(code).startsWith("F")) return "female";
  return "";
}

function findBestRate(riderCode, gender, age) {
  const candidates = riderPremiumRates.filter((rate) => {
    const genderMatches = !rate.gender || rate.gender === gender;
    const ageMatches = rate.age === undefined || Number(rate.age) === Number(age);
    return rate.riderCode === riderCode && genderMatches && ageMatches;
  });

  if (!candidates.length) return null;

  return candidates
    .map((rate) => {
      let score = 0;
      if (rate.gender === gender) score += 4;
      if (Number(rate.age) === Number(age)) score += 4;
      if (!rate.gender) score += 1;
      return { rate, score };
    })
    .sort((a, b) => b.score - a.score || String(a.rate.itemCode).localeCompare(String(b.rate.itemCode)))[0].rate;
}

export const cancerCoverageOptions = Array.from(
  new Set(
    riderContracts
      .filter((rider) => rider.riderGroup === "CR" || String(rider.name).includes("โรคมะเร็ง"))
      .map((rider) => getCoverageAmount(rider.name))
      .filter(Boolean)
  )
).sort((a, b) => a - b);

export function lookupCancerRiderPremium(input) {
  const gender = input.gender || "male";
  const age = Number(input.age) || 0;
  const coverageAmount = normalizeAmount(input.coverageAmount);
  const paymentType = input.paymentType || "normal";

  if (!age || !coverageAmount) {
    return {
      valid: false,
      message: "กรุณากรอกอายุและเลือกความคุ้มครองโรคมะเร็ง"
    };
  }

  const rider = riderContracts.find((contract) => {
    const isCancer = contract.riderGroup === "CR" || String(contract.name).includes("โรคมะเร็ง");
    return (
      isCancer &&
      getGenderFromCode(contract.code) === gender &&
      getCoverageAmount(contract.name) === coverageAmount &&
      getPaymentType(contract.name) === paymentType
    );
  });

  if (!rider) {
    return {
      valid: false,
      message: "ไม่พบสัญญาเพิ่มโรคมะเร็งที่ตรงกับเงื่อนไขนี้"
    };
  }

  const rate = findBestRate(rider.code, gender, age);

  if (!rate) {
    return {
      valid: true,
      foundPremium: false,
      rider,
      coverageAmount,
      paymentType,
      message: "พบรหัสสัญญาเพิ่มแล้ว แต่ยังไม่พบข้อมูลเบี้ยใน riderPremiumRates.json"
    };
  }

  return {
    valid: true,
    foundPremium: true,
    rider,
    coverageAmount,
    paymentType,
    rate,
    annualPremium: Math.round((coverageAmount / rate.sumUnit) * rate.ratePerSumUnit)
  };
}
