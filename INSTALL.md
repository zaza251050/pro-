# คู่มือการติดตั้งระบบ SQL Login

## ความต้องการของระบบ
- PHP 7.4 หรือสูงกว่า
- MySQL 5.7 หรือสูงกว่า
- Web Server (Apache/Nginx)

## ขั้นตอนการติดตั้ง

### 1. ติดตั้งฐานข้อมูล
1. เปิด phpMyAdmin หรือ MySQL Command Line
2. นำเข้าไฟล์ `database.sql` เพื่อสร้างฐานข้อมูลและตาราง

### 2. ตั้งค่าการเชื่อมต่อฐานข้อมูล
แก้ไขไฟล์ `config.php` ตามการตั้งค่าของคุณ:
```php
$host = 'localhost';        // ที่อยู่ MySQL server
$dbname = 'health_app';     // ชื่อฐานข้อมูล
$username = 'root';         // ชื่อผู้ใช้ MySQL
$password = '';             // รหัสผ่าน MySQL
```

### 3. ตั้งค่า Web Server
- วางไฟล์ทั้งหมดในโฟลเดอร์ web server (เช่น htdocs สำหรับ XAMPP)
- ตรวจสอบว่า PHP สามารถเข้าถึงไฟล์ได้

### 4. ทดสอบระบบ
1. เปิดเว็บไซต์ผ่าน web server
2. ไปที่หน้า login.html
3. ทดสอบการสมัครสมาชิกและเข้าสู่ระบบ

## โครงสร้างฐานข้อมูล

### ตาราง users
- `id`: รหัสผู้ใช้ (Auto Increment)
- `name`: ชื่อ-นามสกุล
- `email`: อีเมล (Unique)
- `password`: รหัสผ่าน (เข้ารหัสด้วย password_hash)
- `created_at`: วันที่สร้าง
- `updated_at`: วันที่อัปเดต

### ตาราง user_profiles
- `id`: รหัสโปรไฟล์
- `user_id`: รหัสผู้ใช้ (Foreign Key)
- `age`: อายุ
- `gender`: เพศ
- `height`: ส่วนสูง (ซม.)
- `weight`: น้ำหนัก (กก.)
- `activity_level`: ระดับกิจกรรม

### ตาราง calorie_logs
- `id`: รหัสบันทึก
- `user_id`: รหัสผู้ใช้ (Foreign Key)
- `calories_consumed`: แคลอรี่ที่บริโภค
- `calories_burned`: แคลอรี่ที่เผาผลาญ
- `date`: วันที่
- `created_at`: วันที่สร้าง

## ฟีเจอร์ที่รองรับ
- ✅ การสมัครสมาชิก
- ✅ การเข้าสู่ระบบ
- ✅ การออกจากระบบ
- ✅ การตรวจสอบความถูกต้องของข้อมูล
- ✅ การเข้ารหัสผ่าน
- ✅ การจัดการ Session
- ✅ การแสดงข้อความแจ้งเตือน

## การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อฐานข้อมูล
1. ตรวจสอบการตั้งค่าใน `config.php`
2. ตรวจสอบว่า MySQL ทำงานอยู่
3. ตรวจสอบสิทธิ์การเข้าถึงฐานข้อมูล

### ปัญหา CORS
หากมีปัญหา CORS ให้เพิ่ม header ในไฟล์ PHP:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### ปัญหา Session
ตรวจสอบการตั้งค่า session ใน PHP และ web server

## ความปลอดภัย
- รหัสผ่านถูกเข้ารหัสด้วย `password_hash()`
- ใช้ Prepared Statements เพื่อป้องกัน SQL Injection
- ตรวจสอบข้อมูลที่รับเข้ามา
- ใช้ HTTPS ในระบบจริง

## การพัฒนาต่อ
- เพิ่มระบบลืมรหัสผ่าน
- เพิ่มการยืนยันอีเมล
- เพิ่มระบบจัดการโปรไฟล์
- เพิ่มการบันทึกประวัติการใช้งาน 