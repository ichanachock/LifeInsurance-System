const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const exportDir = path.join(__dirname, "..", "exports");
const outputPath = path.join(exportDir, "cancer-rider-premiums.xls");

const contracts = require(path.join(dataDir, "riderContracts.json"));
const rates = require(path.join(dataDir, "riderPremiumRates.json"));

function xmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cell(value, type = "String") {
  const dataType = typeof value === "number" && Number.isFinite(value) ? "Number" : type;
  return `<Cell><Data ss:Type="${dataType}">${xmlEscape(value)}</Data></Cell>`;
}

function row(values) {
  return `<Row>${values.map((value) => cell(value)).join("")}</Row>`;
}

function normalizeName(name) {
  return String(name || "").replace(/\s+/g, " ").trim();
}

function getCoverageAmount(name) {
  const match = normalizeName(name).match(/([\d,]+)(?=\s*(?:\[|$))/);
  return match ? Number(match[1].replace(/,/g, "")) : "";
}

function getPaymentType(name) {
  return String(name || "").includes("รายเดือน") ? "รายเดือน" : "ปกติ";
}

function getGenderFromCode(code) {
  if (String(code).startsWith("F")) return "female";
  if (String(code).startsWith("M")) return "male";
  return "";
}

const cancerContracts = contracts
  .filter((contract) => contract.riderGroup === "CR" || String(contract.name).includes("โรคมะเร็ง"))
  .sort((a, b) => Number(a.orderNo || 0) - Number(b.orderNo || 0));

const cancerCodes = new Set(cancerContracts.map((contract) => contract.code));
const rateRows = rates.filter((rate) => cancerCodes.has(rate.riderCode));
const ratesByCode = new Map();

for (const rate of rateRows) {
  if (!ratesByCode.has(rate.riderCode)) ratesByCode.set(rate.riderCode, []);
  ratesByCode.get(rate.riderCode).push(rate);
}

const headers = [
  "riderCode",
  "riderName",
  "coverageAmount",
  "paymentType",
  "genderFromCode",
  "riderGroup",
  "orderNo",
  "hasPremiumRate",
  "itemCode",
  "table",
  "riderClass",
  "rateGender",
  "ratePerSumUnit",
  "sumUnit",
  "sourceAmount",
  "premiumUnit",
  "rateSourceTable",
  "rateDescription",
  "note",
];

const rows = [headers];

for (const contract of cancerContracts) {
  const matchedRates = ratesByCode.get(contract.code) || [];
  const baseValues = [
    contract.code,
    contract.name,
    getCoverageAmount(contract.name),
    getPaymentType(contract.name),
    getGenderFromCode(contract.code),
    contract.riderGroup,
    contract.orderNo,
    matchedRates.length > 0 ? "yes" : "no",
  ];

  if (matchedRates.length === 0) {
    rows.push([
      ...baseValues,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "ไม่พบข้อมูลเบี้ยใน riderPremiumRates.json",
    ]);
    continue;
  }

  for (const rate of matchedRates) {
    rows.push([
      ...baseValues,
      rate.itemCode,
      rate.table,
      rate.riderClass,
      rate.gender,
      rate.ratePerSumUnit,
      rate.sumUnit,
      rate.sourceAmount,
      rate.premiumUnit,
      rate.sourceTable,
      rate.description,
      "",
    ]);
  }
}

const workbook = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Worksheet ss:Name="Cancer Rider Premiums">
    <Table>
      ${rows.map(row).join("\n      ")}
    </Table>
  </Worksheet>
</Workbook>
`;

fs.mkdirSync(exportDir, { recursive: true });
fs.writeFileSync(outputPath, workbook, "utf8");

console.log(`Exported ${rows.length - 1} rows to ${outputPath}`);
console.log(`Cancer riders: ${cancerContracts.length}`);
console.log(`Premium rate rows found: ${rateRows.length}`);
