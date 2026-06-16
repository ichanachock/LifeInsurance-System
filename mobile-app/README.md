# Life Premium Mobile

แอปมือถือสำหรับคำนวณเบี้ยประกันชีวิต สร้างด้วย Expo และ React Native โดยนำข้อมูลแบบประกัน เบี้ยประกัน สัญญาหลัก และสัญญาเพิ่มเติมจากโปรแกรม SELIC เดิมใน `C:\SELICProposal2003 _new 2`

## เริ่มใช้งาน

```powershell
cd C:\LifeInsurance-System\mobile-app
npm install
npm run web -- --port 8081
```

จากนั้นเปิด:

```text
http://localhost:8081
```

## Workflow การทำงานในแอป

หน้าจอคำนวณถูกจัดตามลำดับการทำงานของโปรแกรมเดิม:

1. เลือกเพศของผู้เอาประกัน
2. ใส่อายุ
3. เลือกสัญญาหลัก
4. ใส่ทุนประกัน
5. เลือกสัญญาเพิ่มเติม

ผลลัพธ์จะแสดงเบี้ยรวม พร้อมแยกยอด:

- เบี้ยสัญญาหลัก
- เบี้ยสัญญาเพิ่มเติม
- rider ที่ยังไม่พบตารางเบี้ย ถ้ามี

## การนำเข้าข้อมูลจากโปรแกรมเดิม

แหล่งข้อมูลหลักอยู่ที่:

```text
C:\SELICProposal2003 _new 2
```

รันคำสั่งนี้เพื่อนำเข้าข้อมูล:

```powershell
cd C:\LifeInsurance-System\mobile-app
npm run import:selic
```

หรือรันสคริปต์โดยตรง:

```powershell
.\scripts\import-selic-data.ps1
```

ถ้าต้องระบุ path เอง:

```powershell
.\scripts\import-selic-data.ps1 -SourceRoot "C:\SELICProposal2003 _new 2" -TargetDataDir "C:\LifeInsurance-System\mobile-app\data"
```

หลังนำเข้าแล้วให้ restart Expo:

```powershell
npm run web -- --port 8081
```

## ไฟล์ข้อมูลที่สร้างจากการ import

- `data/plans.json` รายการสัญญาหลักที่ decode ตารางเบี้ยจริงได้แล้ว
- `data/realPremiumRates.json` ตารางเบี้ยจริงของสัญญาหลัก
- `data/mainContracts.json` ทะเบียนสัญญาหลักจาก `PLAN_EXT`
- `data/riderContracts.json` ทะเบียนสัญญาเพิ่มเติมจาก `RIDER_EXT` และ `RIDER_EXT_STATUS`
- `data/riderPremiumRates.json` ตารางเบี้ยสัญญาเพิ่มเติมที่ map ได้
- `data/occupations.json` ข้อมูลอาชีพ
- `data/selicProducts.json` ข้อมูลสินค้าเดิมจาก SELIC แบบ raw
- `data/selicPlanOrder.json` รายชื่อแผนจาก Access database
- `data/selicPlanExt.json` รายละเอียดประเภทแผนจาก Access database
- `data/selicPremiumRatesSample.json` ตัวอย่างข้อมูลเบี้ยจาก `IT04PF`

## การคำนวณเบี้ย

สัญญาหลัก:

- แอปจับคู่จาก `planId + เพศ + อายุ`
- ใช้ข้อมูลจาก `data/realPremiumRates.json`
- ถ้าไม่พบเบี้ยตรงอายุ/เพศ แอปจะแสดงข้อความว่าไม่พบเบี้ยจริงของแผนนั้น

สัญญาเพิ่มเติม:

- แอปจับคู่จากรหัส rider เช่น `R003`, `F113`, `M113`
- ใช้ข้อมูลจาก `data/riderPremiumRates.json`
- rider ที่ map เบี้ยได้จะแสดงสถานะ “มีเบี้ยแล้ว”
- rider ที่ยังไม่มี rate จะเลือกได้ แต่จะถูกแจ้งในผลลัพธ์ว่า “ยังไม่พบเบี้ย”

## ผลการ map ล่าสุด

ข้อมูลจากการ import ล่าสุด:

```text
สัญญาหลักในทะเบียน: 76 รายการ
สัญญาเพิ่มเติมในทะเบียน: 362 รายการ
กลุ่มสัญญาหลักที่มีเบี้ยจริง: 46 กลุ่ม
แถวเบี้ยสัญญาหลัก: 4,033 แถว
แถวเบี้ยสัญญาเพิ่มเติม: 1,852 แถว
rider ที่ map เบี้ยได้: 214 รหัส
```

ตัวอย่าง rider ที่ map เบี้ยได้:

```text
R001, R002, R003, F113, M113, FA13, MA13
```

## โครงสร้างไฟล์สำคัญ

- `App.js` หน้าจอหลักและ workflow การเลือกข้อมูล
- `src/premiumCalculator.js` logic คำนวณเบี้ยสัญญาหลักและสัญญาเพิ่มเติม
- `scripts/import-selic-data.ps1` สคริปต์นำเข้าข้อมูลจากโปรแกรมเดิม
- `data/` โฟลเดอร์เก็บ JSON ที่แอปใช้งาน
- `package.json` คำสั่งรันและ import

## หมายเหตุ

โปรแกรมเดิมเป็น PowerBuilder/binary จึงอ่าน source logic จาก `.exe` หรือ `.pbd` โดยตรงไม่ได้ง่าย แต่สามารถดึงข้อมูลจาก `SeicAgt.mdb` ได้ และตอนนี้แอปใช้ข้อมูลที่ decode ได้จากฐานข้อมูลนั้นแล้ว
