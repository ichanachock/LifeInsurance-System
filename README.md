# LifeInsurance-System

ระบบเว็บสำหรับจัดเก็บและติดตามข้อมูลลูกค้าประกันชีวิต โดยเป็นเว็บแบบหน้าเดียวที่ใช้ไฟล์หลัก 3 ไฟล์:

- `index.html`
- `style.css`
- `script.js`

## ลิงก์โปรเจกต์

- GitHub Repository: https://github.com/ichanachock/LifeInsurance-System
- GitHub Pages: https://ichanachock.github.io/LifeInsurance-System/

## วิธีเปิดทดสอบบนเครื่อง

เปิดโฟลเดอร์โปรเจกต์:

```powershell
cd C:\LifeInsurance-System
```

จากนั้นเปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ หรือใช้คำสั่ง:

```powershell
start index.html
```

## การเชื่อม Google Sheets

ระบบส่งข้อมูลไปยัง Google Sheets ผ่าน Google Apps Script Web App URL ที่ตั้งค่าไว้ใน `script.js`:

```js
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyxdFNjTDCPNfbTAxd2cHKtaDLb9IUZdy5zzB_fksxHlR33dB0_smEp8yTuQ_nYMVrpJA/exec";
```

ถ้าต้องการเปลี่ยน Sheet หรือ Apps Script ให้ deploy Web App ใหม่ แล้วนำ URL ใหม่มาใส่แทนค่าด้านบน

## วิธีอัปเดตขึ้น GitHub

หลังจากแก้ไขไฟล์และทดสอบเรียบร้อยแล้ว ให้ใช้คำสั่ง:

```powershell
git add .
git commit -m "Update website"
git push
```

หลังจาก push แล้ว GitHub Pages จะอัปเดตเว็บไซต์ให้อัตโนมัติ อาจต้องรอประมาณ 1-3 นาที

## วิธีตรวจสอบสถานะ Git

ใช้คำสั่ง:

```powershell
git status
```

ถ้าขึ้นว่า `nothing to commit, working tree clean` แปลว่าไฟล์ในเครื่องตรงกับ GitHub แล้ว

## ไฟล์อื่นในโปรเจกต์

- `google-apps-script.js` โค้ดสำหรับนำไปวางใน Google Apps Script
- `GOOGLE_SHEETS_SETUP.md` คู่มือการตั้งค่า Google Sheets และ Apps Script

## Mobile App คำนวณเบี้ยประกัน

มีโปรเจ็ก mobile app เพิ่มในโฟลเดอร์:

```text
C:\LifeInsurance-System\mobile-app
```

แอปนี้ใช้ Expo / React Native และนำข้อมูลจากโปรแกรมเดิมใน:

```text
C:\SELICProposal2003 _new 2
```

ขั้นตอนการทำงานในแอป:

1. เลือกเพศของผู้เอาประกัน
2. ใส่อายุ
3. เลือกสัญญาหลัก
4. ใส่ทุนประกัน
5. เลือกสัญญาเพิ่มเติม

รันแอป:

```powershell
cd C:\LifeInsurance-System\mobile-app
npm install
npm run web -- --port 8081
```

นำเข้าข้อมูลจากโปรแกรมเดิม:

```powershell
cd C:\LifeInsurance-System\mobile-app
npm run import:selic
```

ข้อมูลที่นำเข้า:

- สัญญาหลัก
- สัญญาเพิ่มเติม
- ตารางเบี้ยสัญญาหลัก
- ตารางเบี้ยสัญญาเพิ่มเติมที่ map ได้
- ข้อมูลอาชีพ

รายละเอียดเพิ่มเติมดูที่:

```text
mobile-app\README.md
```
