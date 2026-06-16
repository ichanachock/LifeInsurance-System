# LifeInsurance-System

ระบบเว็บสำหรับจัดเก็บและติดตามข้อมูลลูกค้าประกันชีวิต โดยเป็นเว็บแบบหน้าเดียวที่ใช้ไฟล์หลัก 3 ไฟล์:

- `index.html`
- `style.css`
- `script.js`

## ลิงก์โปรเจกต์

- GitHub Repository: https://github.com/ichanachock/LifeInsurance-System
- GitHub Pages: https://ichanachock.github.io/LifeInsurance-System/
- หน้าเว็บขายประกันรถยนต์: https://ichanachock.github.io/LifeInsurance-System/car-insurance.html
- LIFF Gateway: https://ichanachock.github.io/LifeInsurance-System/liff-gateway/

## สถานะล่าสุด

อัปเดตล่าสุด: 16 มิถุนายน 2026

- เว็บไซต์หลัก `index.html` ใช้งานผ่าน GitHub Pages แล้ว
- Google Sheets Web App URL ถูกตั้งค่าใน `script.js` แล้ว
- สร้าง LINE Login Channel และ LIFF App แล้ว
- ตั้งค่า `LIFF ID` เป็น `2010419567-tIgtTpB2` ใน `liff-gateway/index.html` แล้ว
- แก้ปัญหา LIFF login แล้วค่า `url` หาย โดยให้ระบบจำ URL ปลายทางไว้ก่อน login
- ทดสอบ LIFF redirect ไป Google สำเร็จแล้ว
- สร้างหน้าเว็บขายประกันรถยนต์ `car-insurance.html` แล้ว
- Push หน้าเว็บประกันรถยนต์ขึ้น GitHub แล้ว

ลิงก์ทดสอบ LIFF ไป Google:

```text
https://liff.line.me/2010419567-tIgtTpB2?url=https%3A%2F%2Fwww.google.com
```

ลิงก์ใช้งาน LIFF ไปหน้าเว็บประกันรถยนต์:

```text
https://liff.line.me/2010419567-tIgtTpB2?url=https%3A%2F%2Fichanachock.github.io%2FLifeInsurance-System%2Fcar-insurance.html
```

## ขั้นตอนต่อไปสำหรับใช้งานผ่าน LINE OA

เป้าหมายคือให้ลูกค้ากดจาก LINE OA แล้วเข้าหน้าเว็บผ่าน LIFF ได้ถูกต้อง มีการ login ผ่าน LINE และ redirect ไปหน้าเว็บประกันรถยนต์

### 1. ตรวจสอบการตั้งค่า LIFF ใน LINE Developers

ใน LINE Developers Console ให้เข้า Channel ประเภท `LINE Login` ที่สร้าง LIFF App ไว้ แล้วตรวจสอบค่าต่อไปนี้:

```text
LIFF ID: 2010419567-tIgtTpB2
Endpoint URL: https://ichanachock.github.io/LifeInsurance-System/liff-gateway/
Size: Full
Scopes: profile, openid
Add friend option / Bot Prompt: Aggressive
```

ถ้า Endpoint URL ไม่ตรง ให้แก้เป็น URL ด้านบน แล้วกดบันทึก

### 2. เตรียมลิงก์สำหรับใส่ใน LINE OA

ลิงก์ที่ควรนำไปใช้กับ Rich Menu, ข้อความบรอดแคสต์, ปุ่ม, หรือ Flex Message คือ:

```text
https://liff.line.me/2010419567-tIgtTpB2?url=https%3A%2F%2Fichanachock.github.io%2FLifeInsurance-System%2Fcar-insurance.html
```

หลักการคือใช้รูปแบบนี้:

```text
https://liff.line.me/LIFF_ID?url=URL_ปลายทางที่_encode_แล้ว
```

ห้ามใส่ URL หน้าเว็บปลายทางแบบปกติโดยตรง ถ้าต้องการให้ลูกค้า login ผ่าน LIFF ก่อน

### 3. ตั้งค่าปุ่มใน LINE OA

ใน LINE Official Account Manager ให้เลือกตำแหน่งที่จะวางลิงก์ เช่น:

- Rich Menu
- ข้อความทักทาย
- ข้อความตอบกลับอัตโนมัติ
- Broadcast
- Flex Message

ให้ตั้ง Action ของปุ่มเป็น `URI` หรือ `Open URL` แล้วใส่ลิงก์ LIFF ด้านบน

### 4. รายการทดสอบก่อนใช้งานจริง

ให้ทดสอบจากแอป LINE บนมือถือจริง ไม่ควรใช้ browser ปกติเป็นหลัก

Checklist:

- เปิดลิงก์ LIFF จากแชต LINE ได้
- ระบบพาไป login LINE ได้
- หลัง login แล้วกลับมาหน้า LIFF Gateway ได้
- หน้า LIFF Gateway แสดงสถานะต้อนรับได้
- ระบบ redirect ไป `car-insurance.html` ได้
- ปุ่มใน Rich Menu เปิดลิงก์เดียวกันได้
- ถ้ายังไม่ได้เพิ่มเพื่อน OA ระบบแสดงการชวนเพิ่มเพื่อนตามที่ตั้งค่าไว้
- เปิดจาก iPhone ได้
- เปิดจาก Android ได้
- ฟอร์มบนหน้าเว็บประกันรถยนต์กรอกและบันทึกในเครื่องได้

### 5. งานที่ควรทำเพิ่มในขั้นถัดไป

- เชื่อมฟอร์ม `car-insurance.html` เข้ากับ Google Sheets เหมือนระบบหลัก
- เพิ่มช่อง LINE User ID หลัง login ผ่าน LIFF เพื่อรู้ว่าลูกค้าคนไหนกรอกฟอร์ม
- เพิ่มหน้า thank you หลังส่งข้อมูลสำเร็จ
- เพิ่มปุ่มติดต่อเจ้าหน้าที่ผ่าน LINE OA
- เพิ่มข้อความแจ้งเตือนใน LINE OA เมื่อมี lead ใหม่ ถ้าต้องการ workflow แบบอัตโนมัติ
- ทดสอบ privacy และข้อความขอความยินยอมก่อนเก็บข้อมูลลูกค้า

### 6. วิธีอัปเดตหลังแก้ไข

ทุกครั้งที่แก้ไฟล์แล้วต้องการให้เว็บออนไลน์อัปเดต ให้ใช้คำสั่ง:

```powershell
git add .
git commit -m "Update LINE OA workflow"
git push
```

หลัง push แล้วรอ GitHub Pages ประมาณ 1-3 นาที แล้วทดสอบใหม่จากแอป LINE

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
- `car-insurance.html` หน้าเว็บขายประกันภัยรถยนต์
- `car-insurance.css` ไฟล์ตกแต่งหน้าเว็บประกันภัยรถยนต์
- `car-insurance.js` ระบบบันทึกข้อมูลฟอร์มประกันภัยรถยนต์ในเครื่องเบื้องต้น
- `assets/car-insurance-hero.png` รูป hero สำหรับหน้าเว็บประกันภัยรถยนต์
- `liff-gateway/index.html` หน้า LIFF Gateway สำหรับ login ผ่าน LINE แล้ว redirect ไป URL ปลายทาง

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
