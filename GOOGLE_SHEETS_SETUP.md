# วิธีเชื่อมฟอร์มกับ Google Sheets

1. สร้าง Google Sheets ใหม่ แล้วตั้งชื่อไฟล์ตามต้องการ
2. ไปที่ `Extensions` > `Apps Script`
3. วางโค้ดจากไฟล์ `google-apps-script.js` ลงใน Apps Script แล้วกด Save
4. กด `Deploy` > `New deployment`
5. เลือกชนิดเป็น `Web app`
6. ตั้งค่า `Execute as` เป็น `Me`
7. ตั้งค่า `Who has access` เป็น `Anyone`
8. กด Deploy แล้วคัดลอก Web App URL
9. เปิดไฟล์ `script.js` แล้วนำ URL ไปใส่ตรงนี้:

```js
const GOOGLE_SHEETS_WEB_APP_URL = "วาง Web App URL ที่นี่";
```

หลังตั้งค่าแล้ว เมื่อส่งฟอร์ม ระบบจะบันทึกข้อมูลในเว็บและส่งข้อมูลไปที่ชีตชื่อ `Leads` โดยอัตโนมัติ
