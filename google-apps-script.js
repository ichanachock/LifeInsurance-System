const SHEET_NAME = "Leads";

function doPost(e) {
  const sheet = getLeadSheet_();
  const data = e.parameter || {};

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.phone || "",
    data.age || "",
    data.occupation || "",
    data.budget || "",
    data.interest || "",
    data.notes || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "วันที่รับข้อมูล",
      "ชื่อ",
      "เบอร์โทร",
      "อายุ",
      "อาชีพ",
      "งบประมาณต่อเดือน",
      "สิ่งที่สนใจ",
      "หมายเหตุ"
    ]);
  }

  return sheet;
}
