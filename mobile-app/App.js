import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { calculatePremium, formatBaht } from "./src/premiumCalculator";
import { cancerCoverageOptions, lookupCancerRiderPremium } from "./src/cancerRiderLookup";
import plansData from "./data/plans.json";
import riderContracts from "./data/riderContracts.json";
import riderPremiumRates from "./data/riderPremiumRates.json";
import rateTable from "./data/premiumRates.json";

const allPlanOptions = plansData.map((plan) => ({
  value: plan.id,
  label: plan.name,
  icon: plan.icon || "document-text-outline",
  paymentTerm: plan.paymentTerm,
  minAge: plan.minAge,
  maxAge: plan.maxAge,
  contractType: plan.contractType || "main"
}));

const mainPlanOptions = allPlanOptions.filter((plan) => plan.contractType === "main");
const riderOptions = riderContracts.map((rider) => ({
  value: rider.id,
  label: `${rider.code} ${rider.name}`,
  group: rider.riderGroup || "-",
  hasRate: riderPremiumRates.some((rate) => rate.riderCode === rider.id)
}));

const defaultAge = "35";
const defaultPlanOption =
  mainPlanOptions.find(
    (plan) =>
      (plan.minAge === null || plan.minAge === undefined || plan.minAge <= Number(defaultAge)) &&
      (plan.maxAge === null || plan.maxAge === undefined || plan.maxAge >= Number(defaultAge))
  ) || mainPlanOptions[0];

const paymentModes = rateTable.paymentModes.map((mode) => ({
  value: mode.id,
  label: mode.name
}));

export default function App() {
  const [form, setForm] = useState({
    age: defaultAge,
    gender: "female",
    sumAssured: "1000000",
    payYears: "20",
    planType: defaultPlanOption?.value || "",
    healthClass: "standard",
    paymentMode: "monthly"
  });
  const [selectedRiders, setSelectedRiders] = useState([]);
  const [cancerSearch, setCancerSearch] = useState({
    gender: "male",
    age: "30",
    coverageAmount: "100000",
    paymentType: "normal"
  });

  const result = useMemo(
    () => calculatePremium({ ...form, selectedRiders, riderClass: "1" }),
    [form, selectedRiders]
  );
  const selectedPlan = useMemo(
    () => plansData.find((plan) => plan.id === form.planType) || plansData[0],
    [form.planType]
  );
  const selectedRiderDetails = useMemo(
    () => riderOptions.filter((rider) => selectedRiders.includes(rider.value)),
    [selectedRiders]
  );
  const cancerResult = useMemo(() => lookupCancerRiderPremium(cancerSearch), [cancerSearch]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateCancerSearch(name, value) {
    setCancerSearch((current) => ({ ...current, [name]: value }));
  }

  function selectPlan(option) {
    setForm((current) => ({
      ...current,
      planType: option.value,
      age:
        option.minAge !== null &&
        option.minAge !== undefined &&
        (Number(current.age) < option.minAge || Number(current.age) > option.maxAge)
          ? String(option.minAge)
          : current.age,
      payYears: option.paymentTerm ? String(option.paymentTerm) : current.payYears
    }));
  }

  function toggleRider(riderId) {
    setSelectedRiders((current) =>
      current.includes(riderId)
        ? current.filter((item) => item !== riderId)
        : [...current, riderId]
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <View>
                <Text style={styles.kicker}>Life Premium</Text>
                <Text style={styles.title}>คำนวณเบี้ยประกัน</Text>
              </View>
              <View style={styles.logo}>
                <Ionicons name="calculator-outline" size={28} color="#ffffff" />
              </View>
            </View>

            <View style={styles.resultPanel}>
              <Text style={styles.resultLabel}>เบี้ยที่ต้องชำระ</Text>
              <Text style={styles.resultValue}>
                {result.valid ? formatBaht(result.modalPremium) : "-"}
              </Text>
              <Text style={styles.resultSubtext}>
                {result.valid
                  ? `${result.source === "real" ? "เบี้ยจริง" : "ประมาณ"} ${formatBaht(
                      result.annualPremium
                    )} ต่อปี${result.itemCode ? ` / ${result.itemCode}` : ""}`
                  : result.message}
              </Text>
              {result.valid && result.baseAnnualPremium !== undefined ? (
                <View style={styles.breakdown}>
                  <Text style={styles.breakdownText}>
                    สัญญาหลัก {formatBaht(result.baseAnnualPremium)} / ปี
                  </Text>
                  <Text style={styles.breakdownText}>
                    สัญญาเพิ่มเติม {formatBaht(result.riderAnnualPremium)} / ปี
                  </Text>
                  {result.missingRiders?.length ? (
                    <Text style={styles.warningText}>
                      ยังไม่พบเบี้ย rider: {result.missingRiders.join(", ")}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>

            <Section title="ค้นหาเบี้ยโรคมะเร็ง">
              <Segmented
                label="เพศ"
                value={cancerSearch.gender}
                options={[
                  { value: "male", label: "ชาย" },
                  { value: "female", label: "หญิง" }
                ]}
                onChange={(value) => updateCancerSearch("gender", value)}
              />

              <View style={styles.row}>
                <Input
                  label="อายุ"
                  value={cancerSearch.age}
                  onChangeText={(value) => updateCancerSearch("age", value)}
                  keyboardType="number-pad"
                  suffix="ปี"
                />
              </View>

              <Segmented
                label="แบบความคุ้มครอง"
                value={cancerSearch.paymentType}
                options={[
                  { value: "normal", label: "ปกติ" },
                  { value: "monthly", label: "รายเดือน" }
                ]}
                onChange={(value) => updateCancerSearch("paymentType", value)}
              />

              <View style={styles.coverageGrid}>
                {cancerCoverageOptions.map((amount) => {
                  const isSelected = String(amount) === String(cancerSearch.coverageAmount);

                  return (
                    <Pressable
                      key={amount}
                      style={[styles.coverageButton, isSelected && styles.coverageButtonActive]}
                      onPress={() => updateCancerSearch("coverageAmount", String(amount))}
                    >
                      <Text
                        style={[
                          styles.coverageText,
                          isSelected && styles.coverageTextActive
                        ]}
                      >
                        {new Intl.NumberFormat("th-TH").format(amount)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.cancerResultPanel}>
                <View style={styles.cancerResultHeader}>
                  <Ionicons
                    name={cancerResult.foundPremium ? "checkmark-circle-outline" : "search-outline"}
                    size={22}
                    color={cancerResult.foundPremium ? "#0f766e" : "#b45309"}
                  />
                  <Text style={styles.cancerResultTitle}>
                    {cancerResult.valid && cancerResult.rider
                      ? `${cancerResult.rider.code} ${cancerResult.rider.name}`
                      : "ผลการค้นหา"}
                  </Text>
                </View>

                {cancerResult.foundPremium ? (
                  <>
                    <Text style={styles.cancerPremiumValue}>
                      {formatBaht(cancerResult.annualPremium)} / ปี
                    </Text>
                    <Text style={styles.cancerResultText}>
                      ตาราง {cancerResult.rate.table || "-"} / item{" "}
                      {cancerResult.rate.itemCode || "-"} / rate{" "}
                      {cancerResult.rate.ratePerSumUnit} ต่อ{" "}
                      {new Intl.NumberFormat("th-TH").format(cancerResult.rate.sumUnit)} บาท
                    </Text>
                  </>
                ) : (
                  <Text style={styles.cancerWarningText}>{cancerResult.message}</Text>
                )}
              </View>
            </Section>

            <Section title="1. เพศของผู้เอาประกัน และ 2. อายุ">
              <Segmented
                label="เพศ"
                value={form.gender}
                options={[
                  { value: "female", label: "หญิง" },
                  { value: "male", label: "ชาย" }
                ]}
                onChange={(value) => updateField("gender", value)}
              />

              <View style={styles.row}>
                <Input
                  label="อายุ"
                  value={form.age}
                  onChangeText={(value) => updateField("age", value)}
                  keyboardType="number-pad"
                  suffix="ปี"
                />
              </View>
            </Section>

            <Section title="3. เลือกสัญญาหลัก">
              <View style={styles.planGrid}>
                {mainPlanOptions.length ? (
                  mainPlanOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.planButton,
                        form.planType === option.value && styles.planButtonActive
                      ]}
                      onPress={() => selectPlan(option)}
                    >
                      <Ionicons
                        name={option.icon}
                        size={22}
                        color={form.planType === option.value ? "#ffffff" : "#0f766e"}
                      />
                      <Text
                        style={[
                          styles.planText,
                          form.planType === option.value && styles.planTextActive
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))
                ) : (
                  <Text style={styles.emptyText}>
                    ยังไม่มีสัญญาหลักที่ decode เบี้ยได้ในไฟล์ realPremiumRates.json
                  </Text>
                )}
              </View>

              <View style={styles.row}>
                <Input
                  label="ระยะเวลาชำระ"
                  value={form.payYears}
                  onChangeText={(value) => updateField("payYears", value)}
                  keyboardType="number-pad"
                  suffix="ปี"
                />
              </View>

              <Segmented
                label="งวดชำระ"
                value={form.paymentMode}
                options={paymentModes}
                onChange={(value) => updateField("paymentMode", value)}
              />

              {selectedPlan ? (
                <View style={styles.planDetail}>
                  <Text style={styles.planDetailTitle}>{selectedPlan.code}</Text>
                  <Text style={styles.planDetailText}>{selectedPlan.description}</Text>
                  <Text style={styles.planDetailMeta}>
                    {selectedPlan.contractType === "rider" ? "สัญญาเพิ่มเติม" : "สัญญาหลัก"} /{" "}
                    {selectedPlan.category} / pay {selectedPlan.paymentTerm || "-"} yrs / cover{" "}
                    {selectedPlan.policyTerm || "-"} yrs
                  </Text>
                </View>
              ) : null}
            </Section>

            <Section title="4. ใส่ทุนประกัน">
              <View style={styles.row}>
                <Input
                  label="ทุนประกัน"
                  value={form.sumAssured}
                  onChangeText={(value) => updateField("sumAssured", value)}
                  keyboardType="number-pad"
                  suffix="บาท"
                />
              </View>
            </Section>

            <Section title="5. เลือกสัญญาเพิ่มเติม">
              <View style={styles.riderSummary}>
                <Text style={styles.riderSummaryText}>
                  เลือกแล้ว {selectedRiderDetails.length} รายการ
                </Text>
              </View>

              <View style={styles.riderList}>
                {riderOptions.map((rider) => {
                  const isSelected = selectedRiders.includes(rider.value);

                  return (
                    <Pressable
                      key={rider.value}
                      style={[styles.riderButton, isSelected && styles.riderButtonActive]}
                      onPress={() => toggleRider(rider.value)}
                    >
                      <Ionicons
                        name={isSelected ? "checkbox-outline" : "square-outline"}
                        size={22}
                        color={isSelected ? "#0f766e" : "#64748b"}
                      />
                      <View style={styles.riderTextWrap}>
                        <Text style={styles.riderText}>{rider.label}</Text>
                        <Text style={styles.riderGroup}>
                          กลุ่ม {rider.group} / {rider.hasRate ? "มีเบี้ยแล้ว" : "ยังไม่มีเบี้ย"}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            <View style={styles.notePanel}>
              <Ionicons name="information-circle-outline" size={20} color="#0f766e" />
              <Text style={styles.noteText}>
                สูตรนี้เป็นตัวอย่างสำหรับประเมินเบื้องต้น ควรแทนที่ด้วยตารางเรทจริงของบริษัทก่อนใช้งานขายจริง
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Input({ label, suffix, ...props }) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput style={styles.input} placeholderTextColor="#94a3b8" {...props} />
        {suffix ? <Text style={styles.inputSuffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function Segmented({ label, value, options, onChange }) {
  return (
    <View style={styles.segmentWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.segmentGroup}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.segmentButton, value === option.value && styles.segmentActive]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.segmentText, value === option.value && styles.segmentTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f766e"
  },
  keyboardView: {
    flex: 1
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 34
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8
  },
  kicker: {
    color: "#ccfbf1",
    fontSize: 14,
    fontWeight: "700"
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 2
  },
  logo: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 16,
    height: 54,
    justifyContent: "center",
    width: 54
  },
  resultPanel: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20
  },
  resultLabel: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "700"
  },
  resultValue: {
    color: "#0f172a",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 4
  },
  resultSubtext: {
    color: "#475569",
    fontSize: 15,
    marginTop: 6
  },
  breakdown: {
    borderTopColor: "#e2e8f0",
    borderTopWidth: 1,
    gap: 4,
    marginTop: 12,
    paddingTop: 10
  },
  breakdownText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700"
  },
  warningText: {
    color: "#b45309",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17
  },
  section: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    gap: 14,
    padding: 16
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800"
  },
  row: {
    flexDirection: "row",
    gap: 12
  },
  inputWrap: {
    flex: 1,
    gap: 7
  },
  inputLabel: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700"
  },
  inputBox: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 48,
    paddingHorizontal: 12
  },
  input: {
    color: "#0f172a",
    flex: 1,
    fontSize: 16,
    fontWeight: "700"
  },
  inputSuffix: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8
  },
  segmentWrap: {
    gap: 7
  },
  segmentGroup: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    flexDirection: "row",
    padding: 4
  },
  segmentButton: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 8
  },
  segmentActive: {
    backgroundColor: "#0f766e"
  },
  segmentText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center"
  },
  segmentTextActive: {
    color: "#ffffff"
  },
  planGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  planButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    minHeight: 82,
    justifyContent: "center",
    padding: 8,
    width: "31%"
  },
  planButtonActive: {
    backgroundColor: "#0f766e",
    borderColor: "#0f766e"
  },
  planText: {
    color: "#0f172a",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center"
  },
  planTextActive: {
    color: "#ffffff"
  },
  emptyText: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#64748b",
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    padding: 12
  },
  riderSummary: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12
  },
  riderSummaryText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800"
  },
  riderList: {
    gap: 8
  },
  riderButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 54,
    padding: 10
  },
  riderButtonActive: {
    borderColor: "#0f766e",
    backgroundColor: "#ecfeff"
  },
  riderTextWrap: {
    flex: 1,
    gap: 2
  },
  riderText: {
    color: "#0f172a",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18
  },
  riderGroup: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700"
  },
  notePanel: {
    alignItems: "flex-start",
    backgroundColor: "#ecfeff",
    borderColor: "#99f6e4",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 14
  },
  noteText: {
    color: "#134e4a",
    flex: 1,
    fontSize: 13,
    lineHeight: 19
  },
  coverageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  coverageButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 10,
    width: "31%"
  },
  coverageButtonActive: {
    backgroundColor: "#0f766e",
    borderColor: "#0f766e"
  },
  coverageText: {
    color: "#0f172a",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center"
  },
  coverageTextActive: {
    color: "#ffffff"
  },
  cancerResultPanel: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 12
  },
  cancerResultHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  cancerResultTitle: {
    color: "#0f172a",
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 19
  },
  cancerPremiumValue: {
    color: "#0f766e",
    fontSize: 24,
    fontWeight: "900"
  },
  cancerResultText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 18
  },
  cancerWarningText: {
    color: "#b45309",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18
  },
  planDetail: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 12
  },
  planDetailTitle: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "900"
  },
  planDetailText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 18
  },
  planDetailMeta: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "800"
  }
});
