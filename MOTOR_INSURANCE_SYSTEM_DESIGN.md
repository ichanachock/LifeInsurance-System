# Motor Insurance Online Sales System Blueprint

เอกสารนี้ออกแบบระบบขายประกันภัยรถยนต์ออนไลน์แบบครบวงจร โดยต่อยอดจากระบบเดิมในโปรเจกต์นี้ที่มี `index.html` เป็น CRM ประกันชีวิต, `car-insurance.html` เป็นหน้าร้านประกันรถยนต์, `liff-gateway/` สำหรับเข้าผ่าน LINE LIFF และ Google Sheets สำหรับรับข้อมูล lead

## เป้าหมายระบบ

ระบบใหม่ควรรองรับการทำงานตั้งแต่ลูกค้าเห็นโปรโมชั่น, ขอใบเสนอราคา, เจ้าหน้าที่ติดตาม, ออกใบเสนอราคา, ปิดการขาย, รับชำระเงิน, ออกกรมธรรม์, ติดตามต่ออายุ และดูแลเคลมเบื้องต้น

เป้าหมายหลัก:

- หน้าร้านออนไลน์สำหรับลูกค้าเช็กแผนประกันรถยนต์และส่งคำขอใบเสนอราคา
- หลังบ้านสำหรับแก้ไขข้อมูลหน้าเว็บ แผนประกัน โปรโมชั่น และบทความ
- CRM สำหรับติดตาม lead, งานขาย, สถานะงาน, นัดหมาย และประวัติการติดต่อ
- เชื่อม LINE OA / LIFF เพื่อรู้ตัวตนลูกค้าและส่งข้อความติดตาม
- เก็บข้อมูลลง Google Sheets ได้ทันทีในระยะเริ่มต้น และพร้อมขยายเป็นฐานข้อมูลจริงในอนาคต
- รองรับ workflow การขายประกันรถยนต์หลายบริษัทและหลายประเภท เช่น ชั้น 1, 2+, 3+, พ.ร.บ.

## ภาพรวมโมดูล

### 1. หน้าร้านลูกค้า

ไฟล์เริ่มต้น: `car-insurance.html`, `car-insurance.css`, `car-insurance.js`

หน้าร้านควรมีส่วนหลักดังนี้:

- หน้าแรกพร้อม hero, จุดเด่น, ปุ่มขอราคา และช่องทาง LINE
- รายการประเภทประกัน: ชั้น 1, 2+, 3+, 3, พ.ร.บ.
- โปรโมชั่นประจำเดือน เช่น ผ่อน 0%, cashback, ฟรี พ.ร.บ., ฟรีบริการช่วยเหลือฉุกเฉิน
- แบบฟอร์มขอใบเสนอราคาแบบหลายขั้นตอน
- หน้าขอบคุณหลังส่งข้อมูล พร้อมปุ่มแชต LINE OA
- FAQ เรื่องเอกสาร, การต่ออายุ, อู่ซ่อม, ซ่อมห้าง, เคลม
- Tracking parameter เช่น source, campaign, medium เพื่อรู้ว่าลูกค้ามาจาก Rich Menu, Broadcast, Facebook หรือ Google

ข้อมูลที่ควรเก็บจากลูกค้า:

- ชื่อ, เบอร์โทร, LINE user id, อีเมลถ้ามี
- จังหวัด/อำเภอ
- ยี่ห้อรถ, รุ่นรถ, ปีรถ, รุ่นย่อย, เลขทะเบียนถ้ามี
- ประเภทการใช้งาน เช่น ส่วนบุคคล, รับจ้าง, เชิงพาณิชย์
- ประเภทประกันที่สนใจ
- งบประมาณ
- วันหมดประกันเดิม
- บริษัทประกันเดิม
- ประวัติเคลม
- ความต้องการซ่อมห้าง/ซ่อมอู่
- รูปเล่มทะเบียน/กรมธรรม์เดิม/ใบขับขี่ ถ้าต้องใช้ในขั้นต่อไป
- ความยินยอมให้ติดต่อและใช้ข้อมูลส่วนบุคคล

### 2. ระบบจัดการหลังบ้าน

หลังบ้านควรเป็นพื้นที่สำหรับเจ้าของระบบหรือแอดมินอัปเดตข้อมูลที่แสดงบนหน้าร้านโดยไม่ต้องแก้โค้ดทุกครั้ง

เมนูหลังบ้านที่ควรมี:

- Dashboard ภาพรวมยอด lead, ใบเสนอราคา, ปิดการขาย, งานต่ออายุ
- จัดการ lead รถยนต์
- จัดการข้อมูลลูกค้าและรถ
- จัดการแผนประกัน
- จัดการโปรโมชั่น
- จัดการบริษัทประกัน
- จัดการบทความ/FAQ
- จัดการสคริปต์ขายและข้อความตอบกลับ
- จัดการงานติดตาม
- รายงานยอดขาย
- ตั้งค่าระบบ, LINE OA, Google Sheets, webhook

ข้อมูลหน้าร้านที่ควรแก้ไขจากหลังบ้านได้:

- ข้อความ hero และจุดขายหลัก
- รูป banner / promotion
- รายการแผนประกันที่แสดง
- โปรโมชั่นที่ active/inactive
- ข้อความ thank you page
- ปุ่มติดต่อ LINE / โทร / Messenger
- FAQ
- ข้อความ PDPA consent

### 3. CRM ประกันรถยนต์

CRM ควรแยกประเภทลูกค้าระหว่างประกันชีวิตและประกันรถยนต์ แต่ใช้แนวคิดเดียวกับระบบ CRM เดิมใน `script.js`

Pipeline แนะนำ:

1. New lead
2. Contacted
3. Need more car info
4. Quoting
5. Proposal sent
6. Negotiating
7. Payment pending
8. Policy issued
9. Renewal
10. Lost

ฟีเจอร์ CRM:

- รายการ lead พร้อมค้นหาและกรองตามสถานะ
- คะแนนความพร้อมซื้อ เช่น หมดประกันใน 30 วัน, มีงบชัดเจน, ส่งเอกสารครบ
- ประวัติการติดต่อ
- นัดติดตามครั้งถัดไป
- บันทึกใบเสนอราคาแต่ละบริษัท
- แนบไฟล์เอกสาร
- สร้าง task อัตโนมัติ เช่น โทรกลับพรุ่งนี้, แจ้งเตือนก่อนหมดประกัน 60/30/7 วัน
- Export CSV
- ส่งข้อความ follow-up ผ่าน LINE template

### 4. ระบบใบเสนอราคา

ในระยะเริ่มต้นสามารถทำแบบกึ่งอัตโนมัติ โดยเจ้าหน้าที่รับ lead แล้วกรอกเบี้ยจากบริษัทประกันหรือโบรคเกอร์

ข้อมูลใบเสนอราคาที่ควรมี:

- บริษัทประกัน
- ประเภทประกัน
- ทุนประกัน
- เบี้ยสุทธิ
- เบี้ยรวมภาษี/อากร
- ซ่อมห้าง/ซ่อมอู่
- ค่าเสียหายส่วนแรก
- ความคุ้มครองบุคคลภายนอก
- ความคุ้มครองรถหาย/ไฟไหม้/น้ำท่วม
- พ.ร.บ. รวม/ไม่รวม
- เงื่อนไขผ่อนชำระ
- วันหมดอายุใบเสนอราคา
- สถานะ: draft, sent, accepted, rejected, expired

หน้าลูกค้าควรเปิดดูใบเสนอราคาแบบ responsive ได้ และมีปุ่ม:

- เลือกแผนนี้
- คุยกับเจ้าหน้าที่
- ขอเปรียบเทียบเพิ่ม
- อัปโหลดเอกสาร
- ชำระเงิน

### 5. ระบบโปรโมชั่น

Promotion engine ควรรองรับ:

- ตั้งชื่อโปรโมชั่น
- ระยะเวลาเริ่ม/สิ้นสุด
- ประเภทประกันที่ใช้ได้
- บริษัทประกันที่ร่วมรายการ
- เงื่อนไขรถ เช่น ปีรถ, ประเภทรถ, จังหวัด
- ข้อความสั้นสำหรับ banner
- รายละเอียดเต็ม
- สถานะ active/inactive
- ลำดับการแสดงผล
- campaign code สำหรับวัดผล

ตัวอย่างโปรโมชั่น:

- ต่อประกันรถยนต์ล่วงหน้า รับส่วนลดพิเศษ
- ประกันชั้น 1 ซ่อมห้าง ผ่อน 0%
- ซื้อ พ.ร.บ. พร้อมประกันสมัครใจ รับบริการต่อทะเบียน
- ลูกค้าเดิมต่ออายุ รับ cashback

### 6. LINE OA / LIFF

ระบบเดิมมี `liff-gateway/` แล้ว ควรใช้เป็นประตูเข้าระบบทุกแคมเปญจาก LINE

Flow แนะนำ:

1. ลูกค้ากด Rich Menu หรือ Broadcast
2. เปิดผ่าน `https://liff.line.me/2010419567-tIgtTpB2?url=...`
3. LIFF login แล้วเก็บ `lineUserId`, display name และ picture URL ถ้าได้
4. Redirect ไป `car-insurance.html`
5. ส่งฟอร์มพร้อม line profile และ campaign source
6. บันทึก lead ลง Google Sheets / CRM
7. สร้าง task ให้เจ้าหน้าที่
8. ส่งข้อความแจ้งเตือนแอดมินหรือกลุ่มทีมขาย

Rich Menu แนะนำ:

- ขอราคาเร็ว
- ต่อประกันรถ
- โปรโมชั่น
- ส่งเอกสาร
- แจ้งเคลม/ฉุกเฉิน
- คุยกับเจ้าหน้าที่

### 7. โครงสร้างข้อมูล

ระยะเริ่มต้นใช้ Google Sheets ได้ โดยแยก sheet ดังนี้:

- `MotorLeads`
- `MotorCustomers`
- `Vehicles`
- `MotorQuotes`
- `Promotions`
- `Insurers`
- `Tasks`
- `ContactLogs`
- `Policies`
- `Claims`
- `Settings`

ตัวอย่างคอลัมน์ `MotorLeads`:

```text
createdAt, leadId, source, campaign, lineUserId, name, phone, province,
carBrand, carModel, carYear, carSubModel, plateNumber, usageType,
interestedPlan, budget, currentInsurer, expiryDate, claimHistory,
repairPreference, status, score, assignedTo, nextFollowUp, notes
```

ตัวอย่างคอลัมน์ `Promotions`:

```text
promotionId, title, shortText, detail, startDate, endDate, planType,
insurer, conditions, imageUrl, campaignCode, displayOrder, isActive
```

ตัวอย่างคอลัมน์ `MotorQuotes`:

```text
quoteId, leadId, insurer, planType, sumInsured, netPremium,
totalPremium, repairType, deductible, thirdPartyLimit, fireTheft,
flood, compulsoryIncluded, installment, status, sentAt, expiresAt
```

## Workflow การขายครบวงจร

### Lead capture

- ลูกค้าเข้าจาก LINE OA, GitHub Pages, Facebook Ads หรือ QR code
- ระบบบันทึก source/campaign
- ลูกค้ากรอกข้อมูลรถและข้อมูลติดต่อ
- ระบบตรวจข้อมูลจำเป็นและบันทึก lead

### Qualification

- ระบบให้คะแนน lead อัตโนมัติ
- ถ้าข้อมูลรถไม่ครบ สถานะเป็น `Need more car info`
- ถ้าประกันใกล้หมด สร้าง task เร่งด่วน
- ถ้ามี LINE user id ให้เตรียมข้อความ follow-up

### Quotation

- เจ้าหน้าที่เลือกบริษัทประกันและกรอกตัวเลือกใบเสนอราคา
- ระบบสร้างใบเสนอราคา 1-3 ตัวเลือก
- ส่งลิงก์ใบเสนอราคาให้ลูกค้าทาง LINE

### Closing

- ลูกค้าเลือกแผน
- เจ้าหน้าที่ขอเอกสารเพิ่ม
- ระบบบันทึกสถานะ `Payment pending`
- เมื่อลูกค้าชำระเงินแล้วบันทึกหลักฐาน
- ออกกรมธรรม์และเปลี่ยนสถานะเป็น `Policy issued`

### After sales

- บันทึกเลขกรมธรรม์ วันเริ่ม/วันสิ้นสุด
- สร้าง reminder ต่ออายุล่วงหน้า 60/30/7 วัน
- เก็บประวัติเคลมและบริการหลังการขาย
- สร้าง lead ต่ออายุอัตโนมัติ

## Roadmap การพัฒนา

### Phase 1: ใช้งานได้เร็ว

- เชื่อม `car-insurance.js` ส่งข้อมูลไป Google Sheets
- เพิ่ม sheet `MotorLeads`
- เพิ่ม field source/campaign/LINE user id
- เพิ่ม thank you state หลังส่งฟอร์ม
- เพิ่มปุ่มติดต่อ LINE OA
- เพิ่มหน้า/เอกสาร workflow สำหรับทีมขาย

### Phase 2: CRM รถยนต์ในเว็บเดิม

- เพิ่ม product type เป็น `life` และ `motor`
- เพิ่มเมนู Motor Leads ใน CRM
- เพิ่มสถานะ pipeline สำหรับประกันรถยนต์
- เพิ่ม task reminder
- เพิ่ม export CSV เฉพาะประกันรถยนต์
- เพิ่มฟอร์มแก้ไขข้อมูลรถและวันหมดประกัน

### Phase 3: หลังบ้านจัดการข้อมูลหน้าร้าน

- เพิ่มระบบจัดการโปรโมชั่นจาก Google Sheets
- โหลด promotion active มาแสดงใน `car-insurance.html`
- เพิ่มระบบจัดการแผนประกันและบริษัทประกัน
- เพิ่ม FAQ ที่อัปเดตได้จาก sheet

### Phase 4: ใบเสนอราคาและปิดการขาย

- เพิ่มหน้าสร้างใบเสนอราคา
- เพิ่มหน้าลูกค้าดูใบเสนอราคา
- เพิ่มสถานะ accept/reject
- เพิ่มอัปโหลดเอกสารผ่าน Google Drive หรือฟอร์มแนบไฟล์
- เพิ่มข้อความ LINE template สำหรับส่งใบเสนอราคา

### Phase 5: ขยายเป็นระบบจริง

- ย้ายจาก localStorage/Google Sheets ไป backend database
- เพิ่ม login แอดมิน
- เพิ่ม role: admin, sales, manager
- เพิ่ม audit log
- เพิ่ม payment gateway
- เพิ่ม notification webhook
- เพิ่ม dashboard รายงานยอดขายและ conversion

## หน้าที่ควรสร้างเพิ่ม

ไฟล์ static ที่ทำได้ทันที:

- `motor-admin.html` สำหรับหลังบ้านประกันรถยนต์
- `motor-admin.css`
- `motor-admin.js`
- `motor-quote.html` สำหรับลูกค้าดูใบเสนอราคา
- `motor-thank-you.html`

ถ้าจะรวมกับ CRM เดิม:

- เพิ่ม view `motorDashboard`
- เพิ่ม view `motorLeads`
- เพิ่ม view `motorPromotions`
- เพิ่ม view `motorQuotes`
- เพิ่ม view `motorRenewals`

## ข้อควรระวัง

- ต้องมีข้อความขอความยินยอมก่อนเก็บข้อมูลส่วนบุคคล
- ไม่ควรแสดงเบี้ยว่าเป็นราคาสุดท้ายถ้ายังไม่ได้ยืนยันจากบริษัทประกัน
- ควรบันทึกวันหมดอายุใบเสนอราคา
- ข้อมูลเอกสารรถและบัตรประชาชนควรเก็บในระบบที่ควบคุมสิทธิ์ได้ ไม่ควรปล่อย public
- ถ้าใช้ GitHub Pages อย่างเดียว ห้ามใส่ secret key หรือ token ใน JavaScript ฝั่งหน้าเว็บ
- Google Apps Script endpoint ควรตรวจข้อมูลและจำกัดรูปแบบ payload

## ลำดับงานถัดไปที่แนะนำ

1. ปรับ `google-apps-script.js` ให้รองรับ `MotorLeads`
2. ปรับ `car-insurance.js` ให้ส่ง lead ไป Google Sheets พร้อมสำรองลง `localStorage`
3. เพิ่ม field สำคัญใน `car-insurance.html`: จังหวัด, รุ่นรถ, วันหมดประกัน, LINE consent
4. สร้าง `motor-admin.html` สำหรับดู lead รถยนต์และอัปเดตสถานะ
5. สร้าง sheet `Promotions` แล้วให้หน้าร้านโหลดโปรโมชั่นจาก Google Apps Script
6. เพิ่มระบบใบเสนอราคาใน phase ถัดไป
