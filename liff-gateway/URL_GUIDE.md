# 🔗 URL Guide & Testing Reference

## 📌 URL Pattern

```
https://liff.line.me/[LIFF_ID]?url=[URL_ENCODED_TARGET_URL]
```

### ตัวอย่าง:
```
https://liff.line.me/1234567890-abcdefgh?url=https%3A%2F%2Fwww.google.com
```

---

## 🎯 ตัวอย่าง URLs สำหรับการทดสอบ

### 1. Google Redirect (ทดสอบพื้นฐาน)
```
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Fwww.google.com
```

### 2. Dashboard Redirect
```
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Fyourapp.com%2Fdashboard
```

### 3. Dashboard with User ID
```
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Fyourapp.com%2Fdashboard%3Fuser_id%3D123
```

### 4. FIN Insurance Member Portal
```
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Ffininsurance-member.com%2Ffinhome
```

### 5. Multiple Parameters
```
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Fyourapp.com%2Fpage%3Futm%3Dline%26source%3Drich_menu%26campaign%3Dspring2026
```

---

## 🔄 URL Encoding Table

| Character | Encoded |
|---|---|
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `=` | `%3D` |
| `&` | `%26` |
| `#` | `%23` |
| ` ` | `%20` |

### ตัวอย่างการ Encode ทีละส่วน:

```
Original:  https://yourapp.com/user?id=123&role=admin
           ⬇️
Step 1:    Replace : → %3A
           https%3A//yourapp.com/user?id=123&role=admin
           ⬇️
Step 2:    Replace / → %2F
           https%3A%2F%2Fyourapp.com%2Fuser?id=123&role=admin
           ⬇️
Step 3:    Replace ? → %3F
           https%3A%2F%2Fyourapp.com%2Fuser%3Fid=123&role=admin
           ⬇️
Step 4:    Replace = → %3D
           https%3A%2F%2Fyourapp.com%2Fuser%3Fid%3D123&role=admin
           ⬇️
Step 5:    Replace & → %26
           https%3A%2F%2Fyourapp.com%2Fuser%3Fid%3D123%26role%3Dadmin
           ⬇️
Final:     https%3A%2F%2Fyourapp.com%2Fuser%3Fid%3D123%26role%3Dadmin
```

---

## 📊 Quick Encoding Tool (Copy-Paste Ready)

### ใช้ JavaScript ใน Browser Console:

```javascript
// คัดลอก & รันใน Browser Console (F12)
const targetUrl = "https://yourapp.com/dashboard?id=123";
const encodedUrl = encodeURIComponent(targetUrl);
const liffUrl = `https://liff.line.me/YOUR_LIFF_ID?url=${encodedUrl}`;
console.log(liffUrl);
// จะได้ output ที่สามารถ copy ได้เลย
```

### ใช้ Python:

```python
import urllib.parse

target_url = "https://yourapp.com/dashboard?id=123"
encoded_url = urllib.parse.quote(target_url)
liff_id = "YOUR_LIFF_ID"
liff_url = f"https://liff.line.me/{liff_id}?url={encoded_url}"
print(liff_url)
```

### ใช้ Node.js:

```javascript
const querystring = require('querystring');

const targetUrl = "https://yourapp.com/dashboard?id=123";
const encodedUrl = encodeURIComponent(targetUrl);
const liffId = "YOUR_LIFF_ID";
const liffUrl = `https://liff.line.me/${liffId}?url=${encodedUrl}`;
console.log(liffUrl);
```

---

## 🧪 Testing Checklist

### ✅ Pre-Testing Checklist

- [ ] LIFF ID ถูกใส่ในโค้ด `index.html`
- [ ] Render URL อัปเดตใน LINE Developers Endpoint URL
- [ ] URL Target ถูก Encode แล้ว
- [ ] ทดสอบบน LINE App (ไม่ใช่ Browser โดยตรง)
- [ ] ฟังก์ชัน Login ของ LINE ทำงานถูกต้อง

### 🔍 Debugging Steps

1. **เปิด Browser DevTools**
   ```
   Windows/Linux: F12
   Mac: Cmd + Option + I
   ```

2. **ไปที่ Console Tab**
   - ดูว่ามี Error ใดๆ หรือไม่
   - ตรวจสอบ LIFF initialization messages

3. **ทดสอบใน Incognito Mode**
   - เพื่อให้แน่ใจว่าไม่มี Cache ที่เก่า

4. **ลบ Cookies และ Cache**
   - DevTools > Application > Clear storage

---

## 📋 Testing Scenarios

### Scenario 1: ผู้ใช้ยังไม่ได้ Login LINE

```
Flow:
1. ผู้ใช้กดลิงก์
2. ระบบเห็น isLoggedIn() = false
3. Auto-redirect ไป LINE Login page
4. หลังจาก Login กลับมา
5. ดำเนินการต่อ
```

**ทดสอบ:** ล้าง LINE Session > กดลิงก์ใหม่

### Scenario 2: ผู้ใช้ยังไม่ได้เพิ่มเพื่อน OA

```
Flow:
1. checkFriendshipStatus() ทำงาน
2. friendFlag = false
3. requestFriendship() ทำงาน
4. แสดงหน้าต่าง Add Friend
5. หลังจากเพิ่มแล้ว ดำเนินการต่อ
```

**ทดสอบ:** ลบเพื่อน OA > กดลิงก์ใหม่

### Scenario 3: ไม่มี URL Parameter

```
Flow:
1. ไม่มี ?url= ใน URL
2. redirectUrl = null
3. แสดง Warning Alert
4. ปิดหน้าต่างทันที
```

**ทดสอบ:** 
```
https://liff.line.me/YOUR_LIFF_ID
```
(ไม่มี ?url=)

### Scenario 4: URL Parameter เป็นค่าว่าง

```
Flow:
1. ?url= มีแต่ไม่มีค่า
2. ตรวจสอบ trim() = true
3. แสดง Warning Alert
4. ปิดหน้าต่างทันที
```

**ทดสอบ:** 
```
https://liff.line.me/YOUR_LIFF_ID?url=
```

### Scenario 5: Redirect สำเร็จ

```
Flow:
1. ทุกการตรวจสอบผ่าน ✓
2. แสดง Welcome Screen
3. รอ 2.5 วินาที
4. Redirect ไปยัง target URL
```

**ทดสอบ:** 
```
https://liff.line.me/YOUR_LIFF_ID?url=https%3A%2F%2Fwww.google.com
```

---

## 🛠️ Developer Tools Tips

### 1. View Console Logs

```
F12 → Console Tab
```

Expected logs:
```
Redirecting to: https://www.google.com
```

### 2. Check Network Requests

```
F12 → Network Tab
```

Should see:
- LIFF SDK loaded
- Profile API call
- Friendship API call

### 3. Check Local Storage

```
F12 → Application Tab → Local Storage
```

LIFF SDK stores session info here

### 4. Simulate Slow Network

```
F12 → Network Tab → Throttling
```

Good for testing loading states

---

## 🚀 Production URL Examples

### Rich Menu Button:

```
Button Text: 📱 เข้าใช้งาน
URL: https://liff.line.me/1234567890-abcdefgh?url=https%3A%2F%2Finsuranc.yourdomain.com%2Fdashboard
```

### Broadcast Message:

```
📢 คลิกเพื่อเข้าสู่ระบบจัดการประกันภัย:
https://liff.line.me/1234567890-abcdefgh?url=https%3A%2F%2Finsuranc.yourdomain.com%2Fmember
```

### Push Message:

```
Template Message with URL:
https://liff.line.me/1234567890-abcdefgh?url=https%3A%2F%2Finsuranc.yourdomain.com%2Fpolicies
```

---

## ⚠️ Common Mistakes

### ❌ Wrong: Space in URL

```
https://liff.line.me/ID?url=https://yourapp.com/dashboard
❌ Space after .com/
```

### ✅ Correct: Encoded Space

```
https://liff.line.me/ID?url=https%3A%2F%2Fyourapp.com%2Fdashboard
✅ All special chars encoded
```

---

### ❌ Wrong: Double Encoding

```
https://liff.line.me/ID?url=https%253A%252F%252Fyourapp.com
❌ % encoded again (%25)
```

### ✅ Correct: Single Encoding

```
https://liff.line.me/ID?url=https%3A%2F%2Fyourapp.com
✅ Only encode once
```

---

### ❌ Wrong: Opening in Browser

```
Paste URL in address bar directly
❌ Won't work - must use LINE app
```

### ✅ Correct: Opening in LINE

```
Send URL in LINE chat
Click link from within LINE app
✅ Works correctly
```

---

## 📞 Support

If you have issues:

1. Check Console for error messages (F12)
2. Verify LIFF ID is correct
3. Verify Endpoint URL in LINE Developers
4. Test in Incognito Mode
5. Clear cookies & cache

---

**Last Updated:** 2026-05-20
