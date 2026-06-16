# 🚀 FIN Insurance Broker — LINE LIFF Redirect Gateway

[![LINE LIFF](https://img.shields.io/badge/LINE-LIFF--App-00C300?style=for-the-badge&logo=LINE&logoColor=white)](https://developers.line.biz/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

ระบบ Gateway ยืนยันตัวตนระดับองค์กรผ่าน **LINE LIFF SDK v2** เพื่อทำการคัดกรองสิทธิ์ ตรวจสอบสถานะการเป็นเพื่อน (Friendship Check) ก่อนทำการส่งต่อผู้ใช้งาน (Redirect) ไปยัง URL ที่ต้องการ

---

## 🏗️ System Architecture & Data Flow

ระบบนี้ทำหน้าที่เป็น **Authentication & Traffic Gateway** โดยมีลอจิกการทำงานไหลลื่นตามโครงสร้างสถาปัตยกรรมดังนี้:

- **User Request:** ผู้ใช้กดลิงก์ LIFF มาจาก Rich Menu หรือ Broadcast บน LINE OA โดยแนบพารามิเตอร์ `?url=...` ปลายทางมาด้วย

- **LIFF Initialization & Authentication:** ระบบจะตรวจสอบการ Login หากยังไม่ได้ Login จะบังคับเข้าสู่ระบบผ่านสิทธิ์ของ LINE ทันที

- **Friendship Verification:** ระบบเช็คสิทธิ์การเป็นเพื่อนกับ LINE OA (หากยังไม่เพิ่มเพื่อน จะเปิดหน้าต่าง Request ให้กด Add Friend ก่อนเข้าแอป)

- **Security & Validation Guard:** ระบบดักจับ Parameter หากไม่มีหน้าเว็บปลายทาง (`?url=`) จะสั่งเบรกการทำงาน และแสดง Custom Alert Modal (SweetAlert2) พร้อมคำสั่งปิดหน้าต่างแอปทันที ป้องกันระบบแครช

- **Gateway Redirect:** เมื่อตรวจสอบผ่านทุกเงื่อนไข ระบบจะใช้ `window.location.replace()` เพื่อส่งต่อไปยัง Path ปลายทางของแอปพลิเคชันหลักทันที

---

## 🛠️ ขั้นตอนการสร้างและตั้งค่าบน LINE Developers

### 🔹 1. การจัดการบน LINE Developers

1. เข้าไปที่ [LINE Developers Console](https://developers.line.biz/)
2. สร้าง **Provider** และทำการสร้าง **Messaging API Channel** ให้เรียบร้อย
3. สร้าง **LIFF App** ภายใต้ Provider ดังกล่าว โดยไปที่แท็บ **LIFF** > กด **Add** และกำหนดค่าดังนี้:

| ตั้งค่าโครงสร้าง | มูลค่า / ตัวเลือกที่กำหนด |
|---|---|
| **LIFF app name** | `FIN-Redirect-Gateway` |
| **Size** | `Full` |
| **Endpoint URL** | ใส่ URL หน้าเว็บเว็บนี้ที่ได้จากการสร้างบนโฮสติ้ง (เช่น `https://fin-liff.onrender.com`) |
| **Scopes** | เปิดใช้งานสิทธิ์ `profile` และ `openid` |
| **Bot Prompt** | เลือกเป็น `Aggressive` (เพื่อบังคับให้ระบบแสดงหน้าต่างเพิ่มเพื่อนทันทีหากยังไม่เปิดใช้งาน) |

4. คัดลอกรหัส **LIFF ID** มากรอกใส่ในโค้ด นำ code ชื่อ `index.html` ตรงตัวแปร `LIFF_ID`

---

## 💻 วิธีการ Deployment (GitHub & Render Static Site)

### 🔹 1. การจัดการบน GitHub

1. สร้างคลังโปรเจกต์ใหม่ (New Repository) บน [GitHub](https://github.com) ตั้งชื่อ เช่น `fin-liff-redirect`
2. ตั้งค่าความเป็นส่วนตัวเป็น **Private** เพื่อความปลอดภัยขั้นสูงของโครงสร้างระบบ
3. สร้างไฟล์ชื่อ `index.html` (อ้างอิงโค้ดในไฟล์ [`index.html`](./index.html)) คัดลอกรหัส **LIFF ID** มากรอกใส่ในโค้ด ตรงตัวแปร `LIFF_ID` แล้วอัปโหลดขึ้นไปยังเซิร์ฟเวอร์หลักของ GitHub

### 🔹 2. การนำระบบขึ้น Hosting บน Render

1. ไปที่เว็บไซต์ [Render.com](https://render.com/) และเข้าสู่ระบบให้เรียบร้อย
2. กดปุ่ม **New +** > เลือกเมนู **Static Site**
3. ทำการผูกบัญชีและเลือก **GitHub Repository** ที่สร้างไว้ในขั้นตอนก่อนหน้า
4. กรอกข้อมูลการตั้งค่าโครงสร้างพื้นฐานดังนี้:
   - **Name:** `fin-auth-gateway`
   - **Build Command:** ปล่อยว่างไว้ไม่ต้องกรอกข้อมูล
   - **Publish Directory:** `.` (พิมพ์จุดทศนิยม 1 จุด หมายถึง รันจาก Root Directory)
5. กดปุ่ม **Create Static Site** เมื่อระบบ Deploy สำเร็จ ให้คัดลอก URL ที่ได้ไปวางในช่อง **Endpoint URL** ของ LINE Developers

---

## 📱 รูปแบบการเข้าใช้งาน (Routing URL Guide)

เพื่อความปลอดภัยสูงสุดและโครงสร้างที่ถูกต้อง แนะนำให้แปลงลิงก์ปลายทางให้อยู่ในรูปแบบ **URL Encode** ทุกครั้งก่อนนำไปต่อท้ายพารามิเตอร์ `url`:

```
https://liff.line.me/[LIFF_ID]?url=[TARGET_URL]
```

### ตัวอย่างการใช้งาน:

```
https://liff.line.me/1234567890-abcdefgh?url=https%3A%2F%2Fyourapp.com%2Fdashboard
```

---

## 🔐 ความปลอดภัยและ Best Practices

✅ **ใช้ HTTPS เท่านั้น** — ตรวจสอบให้แน่ใจว่า Endpoint URL เป็น HTTPS

✅ **ซ่อน LIFF ID** — ใช้ Environment Variables แทนการ Hard Code

✅ **Validate URL Parameter** — ตรวจสอบ URL ปลายทางว่าอยู่ในโดเมนที่ได้รับอนุญาต

✅ **CORS Configuration** — ตั้งค่า CORS Headers สำหรับ Production

✅ **Error Handling** — จัดการข้อผิดพลาดอย่างเหมาะสมและให้ feedback ผู้ใช้

---

## 📝 รายละเอียดโค้ด

### Core Functions:

- **`showToast()`** — แสดงการแจ้งเตือนแบบ Toast สวยๆ จากมุมขวาบน
- **`showCustomAlert()`** — แสดง Alert Modal ที่มีปุ่มทำให้ปิดหน้าต่าง LIFF
- **`renderLoading()`** — อัปเดตสถานะหน้าจอในระหว่างการโหลด
- **`renderWelcomeScreen()`** — แสดงหน้า Welcome พร้อมรูปโปรไฟล์และชื่อผู้ใช้
- **`checkFriendshipStatus()`** — ตรวจสอบสถานะการเป็นเพื่อน LINE OA
- **`initApp()`** — ฟังก์ชันหลักที่ประสานการไหลของระบบทั้งหมด

---

## 🎨 UI Components

- **Tailwind CSS** — สำหรับ Styling และ Responsive Design
- **SweetAlert2** — สำหรับ Modal และ Notification ที่สวยงาม
- **LINE Seed Sans TH** — Font ที่เหมาะสมกับภาษาไทยและดีไซน์ LINE

---

## ⚠️ Troubleshooting

| ปัญหา | วิธีแก้ไข |
|---|---|
| **LIFF SDK Not Loaded** | ตรวจสอบ LIFF ID และ Endpoint URL ให้ตรงกับที่ LINE Developers กำหนด |
| **Login Loop** | ล้าง Cache และ Cookies ของ Browser, ลองใช้ Incognito Mode |
| **URL Not Redirecting** | ตรวจสอบ Parameter `?url=` ว่าถูก URL Encode แล้ว |
| **Friendship Check Failed** | ตรวจสอบว่า Bot Prompt ตั้งเป็น **Aggressive** แล้ว |

---

## 📚 Resources

- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [LINE Login Guide](https://developers.line.biz/en/docs/line-login/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SweetAlert2 Documentation](https://sweetalert2.github.io/)

---

## 📄 License

This project is created for FIN Insurance Broker. All rights reserved.

---

**Created by:** maxga118  
**Last Updated:** May 20, 2026
