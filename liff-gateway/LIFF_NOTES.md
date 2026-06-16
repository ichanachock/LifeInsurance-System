# LIFF Notes

บันทึกสรุปการตั้งค่า LINE LIFF สำหรับโปรเจกต์ LifeInsurance-System

## สถานะที่พบ

- Channel เดิมที่เปิดอยู่เป็นประเภท `Messaging API Channel`
- LINE ไม่อนุญาตให้สร้าง LIFF App ใหม่ใน `Messaging API Channel`
- ถ้าต้องการสร้าง `LIFF ID` ต้องสร้าง Channel ใหม่เป็นประเภท `LINE Login`

## ขั้นตอนที่ต้องทำ

1. เข้าเว็บไซต์ LINE Developers

```text
https://developers.line.biz/
```

2. เลือก Provider เดิมที่ใช้งานอยู่

3. กด `Create channel`

4. เลือกประเภท Channel เป็น `LINE Login`

5. กรอกข้อมูล Channel เช่น:

```text
Channel name: FIN Broker LIFF Login
Channel description: LINE Login channel for FIN Broker LIFF
Category: เลือกหมวดที่เหมาะสม
```

6. หลังสร้าง Channel แล้ว ให้เข้า Channel ใหม่นั้น

7. ไปที่แท็บ `LIFF`

8. กด `Add` เพื่อสร้าง LIFF App

9. ตั้งค่า LIFF App:

```text
LIFF app name: FIN-Redirect-Gateway
Size: Full
Endpoint URL: URL เว็บที่ deploy แล้ว เช่น https://fin-auth-gateway.onrender.com
Scopes: profile, openid
Bot Prompt: Aggressive
```

10. กด `Add`

11. คัดลอก `LIFF ID` ที่ LINE สร้างให้

12. นำ `LIFF ID` ไปใส่ในไฟล์:

```text
c:\LifeInsurance-System\liff-gateway\index.html
```

แก้จาก:

```js
const LIFF_ID = "xxxxxxx";
```

เป็น:

```js
const LIFF_ID = "LIFF_ID_จริงของคุณ";
```

## จุดสำคัญที่ต้องจำ

- `LIFF ID` คือรหัสของ LIFF App ที่ต้องใช้ในหน้าเว็บ
- `Channel secret` ไม่ใช่ค่าที่ต้องใส่ใน `index.html`
- `Messaging API Channel` ใช้กับ OA, Bot, webhook หรือการส่งข้อความ
- `LINE Login Channel` ใช้สำหรับสร้าง LIFF App
- ถ้าใช้งานร่วมกับ OA เดิม ให้ใช้ OA เดิมต่อได้ แต่สร้าง LIFF App แยกใน `LINE Login Channel`

## ตัวอย่างลิงก์ทดสอบ

```text
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Fwww.google.com
```

ให้เปลี่ยน `YOUR_LIFF_ID` เป็น LIFF ID จริง

หมายเหตุ: ควรเปิดลิงก์ทดสอบจากแอป LINE ไม่ใช่ browser ปกติ

## การบันทึกขึ้น GitHub

หลังแก้ไขไฟล์หรือเพิ่มบันทึกแล้ว ให้ใช้คำสั่ง:

```powershell
git add liff-gateway/LIFF_NOTES.md
git commit -m "Add LIFF setup notes"
git push
```

## ไฟล์ที่เกี่ยวข้อง

- `liff-gateway/LIFF_CHANNEL_FIX.md` บันทึกปัญหาและแนวทางแก้
- `liff-gateway/index.html` ไฟล์ที่ต้องใส่ `LIFF ID`
