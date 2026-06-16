# ⚙️ ไกด์การตั้งค่า LINE LIFF Gateway

## 1️⃣ ขั้นตอนเตรียมการ

### สิ่งที่ต้องเตรียมไว้:
- บัญชี [LINE Developers](https://developers.line.biz/)
- บัญชี [GitHub](https://github.com)
- บัญชี [Render.com](https://render.com)
- ความเข้าใจพื้นฐาน URL Encoding

---

## 2️⃣ ขั้นตอนสร้าง LINE LIFF

### ขั้นที่ 1: ไปที่ LINE Developers Console

1. เข้าไปที่ https://developers.line.biz/
2. เลือก **Console** หรือ **ไปยัง Provider ของคุณ**

### ขั้นที่ 2: สร้าง Provider (ถ้ายังไม่มี)

1. กด **Create** > **Create Provider**
2. ตั้งชื่อ Provider เช่น `FIN Insurance`
3. เลือก **Create**

### ขั้นที่ 3: สร้าง Messaging API Channel

1. ภายใต้ Provider ที่สร้าง ให้กด **Create Channel**
2. เลือก **Messaging API**
3. กรอกข้อมูล:
   - **Channel name:** `FIN Broker Authentication`
   - **Channel description:** `Authentication Gateway for FIN Insurance`
   - **Category:** `Utilities`
4. กด **Create**

### ขั้นที่ 4: ตั้งค่า LIFF App

1. ไปที่หน้า **Channel** ที่สร้างไว้
2. ในเมนู Side Bar ให้เลือก **LIFF**
3. กด **Add** 
4. ตั้งค่าดังนี้:

```
LIFF app name:      FIN-Redirect-Gateway
Size:               Full
Endpoint URL:       https://fin-auth-gateway.onrender.com
(หรือ URL ของ Hosting ที่คุณใช้)
Scopes:             profile, openid
Bot Prompt:         Aggressive
```

5. กด **Add** เมื่อเสร็จ

### ขั้นที่ 5: คัดลอก LIFF ID

1. หลังจากสร้าง LIFF App สำเร็จ จะเห็น **LIFF ID**
2. **คัดลอก** LIFF ID นี้
3. ใส่ลงในโค้ด `index.html` ที่ตัวแปร:
   ```javascript
   const LIFF_ID = "xxxxxxx"; // ใส่ที่นี่
   ```

---

## 3️⃣ ขั้นตอน Upload ไปยัง GitHub

### ขั้นที่ 1: สร้าง Repository ใหม่บน GitHub

1. เข้าไปที่ https://github.com/new
2. กรอก:
   - **Repository name:** `fin-liff-redirect`
   - **Description:** `LINE LIFF Authentication Gateway for FIN Broker`
   - **Visibility:** `Private` ⭐ (สำคัญมาก)
3. กด **Create repository**

### ขั้นที่ 2: Upload ไฟล์

#### วิธีที่ 1: ใช้ Web UI (ง่ายที่สุด)

1. ในหน้า Repository ที่สร้าง ให้กด **Add file** > **Create new file**
2. ตั้งชื่อ `index.html`
3. นำ Code ทั้งหมดจากไฟล์ `index.html` มา Paste ลงไป
4. **สำคัญ:** เปลี่ยน `const LIFF_ID = "xxxxxxx"` ให้เป็น LIFF ID จริง
5. Scroll ลงด้าน Commit ให้เลือก `Commit directly to main branch`
6. กด **Commit new file**

#### วิธีที่ 2: ใช้ Git Command Line

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/fin-liff-redirect.git
cd fin-liff-redirect

# Copy index.html ไปที่โฟลเดอร์นี้

# Stage & Commit
git add index.html
git commit -m "Add LINE LIFF Authentication Gateway"

# Push to GitHub
git push origin main
```

---

## 4️⃣ ขั้นตอน Deploy บน Render

### ขั้นที่ 1: เข้าไปที่ Render.com

1. เข้าไปที่ https://render.com
2. กด **Sign up** หรือ **Sign in** ด้วยบัญชี GitHub
3. เพื่อให้ Render สามารถเข้าถึง GitHub Repository

### ขั้นที่ 2: สร้าง Static Site

1. ในหน้า Dashboard ให้กด **New +** > **Static Site**
2. เลือก Repository `fin-liff-redirect`
3. ตั้งค่า:
   ```
   Name:                   fin-auth-gateway
   Build Command:          (ปล่อยว่าง)
   Publish directory:      .
   ```
4. กด **Create Static Site**
5. รอ Deploy เสร็จสิ้น (ประมาณ 1-2 นาที)

### ขั้นที่ 3: คัดลอก URL

1. หลังจาก Deploy สำเร็จ จะเห็น URL เช่น:
   ```
   https://fin-auth-gateway.onrender.com
   ```
2. **คัดลอก** URL นี้

### ขั้นที่ 4: อัปเดต LINE Developers

1. เข้าไปที่ LINE Developers Console
2. ไปที่ Channel LIFF ที่สร้าง
3. เลือก **LIFF** > แก้ไข LIFF App
4. เปลี่ยน **Endpoint URL** เป็น URL จากขั้นตอน 3:
   ```
   https://fin-auth-gateway.onrender.com
   ```
5. กด **Update**

---

## 5️⃣ ทดสอบระบบ

### วิธีทดสอบ:

#### 1. สร้าง URL ทดสอบ:

```
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Fwww.google.com
```

เปลี่ยน `YOUR_LIFF_ID` เป็น LIFF ID จริงของคุณ

#### 2. ทดสอบบน LINE:

- เปิด LINE บน Mobile
- Paste URL ลงใน Chat
- กด Link เพื่อทดสอบการไหล

#### 3. ตรวจสอบผลลัพธ์:

✅ **ถ้าถูก:**
- หน้า Loading จะปรากฏ
- ถ้าไม่ได้ Login ให้ Login ผ่าน LINE
- ถ้าไม่ได้เพิ่มเพื่อน จะขอให้เพิ่ม
- หน้า Welcome แสดงชื่อและรูปของคุณ
- Redirect ไป Google หลังจาก 2.5 วินาที

❌ **ถ้าผิด:**
- ตรวจสอบ LIFF ID ในโค้ด
- ตรวจสอบ Endpoint URL ในการตั้งค่า LINE
- ดู Browser Console (F12) เพื่อดู Error Messages

---

## 6️⃣ ใช้งานกับ LINE Official Account (OA)

### สร้าง Rich Menu Link:

1. เข้าไปที่ [LINE Manager](https://manager.line.biz/)
2. ไปที่ **Messaging API** > **Rich Menu**
3. สร้าง Rich Menu Button พร้อม URL:

```
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Fyourapp.com%2Fdashboard
```

### สร้าง Broadcast Link:

1. ไปที่ **Messaging API** > **Broadcast**
2. สร้างข้อความพร้อม URL:

```
🎉 คลิกเพื่อเข้าใช้ระบบจัดการประกันภัย:
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Fyourapp.com%2Fdashboard
```

---

## 7️⃣ URL Encoding Reference

### ตัวอย่างการ Encode URL:

| Original URL | Encoded URL |
|---|---|
| `https://yourapp.com/dashboard` | `https%3A%2F%2Fyourapp.com%2Fdashboard` |
| `https://yourapp.com/user?id=123` | `https%3A%2F%2Fyourapp.com%2Fuser%3Fid%3D123` |
| `https://yourapp.com/path?utm=test&source=line` | `https%3A%2F%2Fyourapp.com%2Fpath%3Futm%3Dtest%26source%3Dline` |

### เครื่องมือ Encoding:

- https://www.urlencoder.org/
- https://meyerweb.com/eric/tools/dencoder/

---

## 8️⃣ Troubleshooting

### ❌ "LIFF ID is not initialized"

**สาเหตุ:** LIFF ID ในโค้ดไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ LIFF ID จากการตั้งค่า LINE
2. ลบ `"xxxxxxx"` และใส่ LIFF ID จริง
3. ลบ Cache & Reload หน้า

---

### ❌ "Cannot load LIFF SDK"

**สาเหตุ:** Endpoint URL ผิด

**วิธีแก้:**
1. ไปที่ LINE Developers Console
2. ตรวจสอบ LIFF > Endpoint URL
3. ให้ตรงกับ URL บน Render
4. ต้องเป็น HTTPS เท่านั้น

---

### ❌ "User is not in LINE"

**สาเหตุ:** ต้องเปิด LINE LIFF จากภายใน LINE App เท่านั้น

**วิธีแก้:**
1. ต้องเปิดลิงก์จาก LINE Chat หรือ Rich Menu
2. ห้ามเปิดจาก Browser โดยตรง

---

### ❌ "Bot prompt not showing"

**สาเหตุ:** Bot Prompt ตั้งค่าไม่ถูก

**วิธีแก้:**
1. ไปที่ LINE Developers
2. LIFF > Edit
3. เปลี่ยน Bot Prompt เป็น **Aggressive**
4. กด Update

---

## 9️⃣ เพิ่มเติม

### Auto-Deploy บน Render:

Render จะ Auto-Deploy ทุกครั้งที่ Push ไปยัง GitHub

### Custom Domain:

ใน Render คุณสามารถเพิ่ม Custom Domain เช่น `fin-auth.yourdomain.com`

### Environment Variables:

ถ้าต้องการเก็บ LIFF ID แบบปลอดภัย สามารถใช้ Environment Variables แทน Hard Code

---

## ✅ Checklist

- [ ] สร้าง LINE Provider
- [ ] สร้าง Messaging API Channel
- [ ] สร้าง LIFF App
- [ ] คัดลอก LIFF ID
- [ ] Update LIFF ID ในโค้ด
- [ ] สร้าง GitHub Repository (Private)
- [ ] Upload `index.html` ไปยัง GitHub
- [ ] สร้าง Static Site บน Render
- [ ] คัดลอก Render URL
- [ ] Update Endpoint URL ใน LINE Developers
- [ ] ทดสอบระบบ
- [ ] สร้าง Rich Menu บน LINE OA

---

**ขอให้โชคดี! 🍀**
