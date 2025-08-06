<?php
header('Content-Type: text/html; charset=utf-8');

echo "<h1>ทดสอบการเชื่อมต่อฐานข้อมูล</h1>";

try {
    require_once 'config.php';
    echo "<p style='color: green;'>✅ การเชื่อมต่อฐานข้อมูลสำเร็จ!</p>";
    
    // ทดสอบการสร้างตาราง
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS test_table (
            id INT AUTO_INCREMENT PRIMARY KEY,
            test_column VARCHAR(50)
        )
    ");
    echo "<p style='color: green;'>✅ การสร้างตารางสำเร็จ!</p>";
    
    // ทดสอบการเพิ่มข้อมูล
    $stmt = $pdo->prepare("INSERT INTO test_table (test_column) VALUES (?)");
    $stmt->execute(['test_value']);
    echo "<p style='color: green;'>✅ การเพิ่มข้อมูลสำเร็จ!</p>";
    
    // ทดสอบการอ่านข้อมูล
    $stmt = $pdo->prepare("SELECT * FROM test_table");
    $stmt->execute();
    $result = $stmt->fetch();
    echo "<p style='color: green;'>✅ การอ่านข้อมูลสำเร็จ!</p>";
    
    // ลบตารางทดสอบ
    $pdo->exec("DROP TABLE test_table");
    echo "<p style='color: green;'>✅ การลบตารางสำเร็จ!</p>";
    
    echo "<h2>ระบบพร้อมใช้งาน!</h2>";
    echo "<p><a href='login.html'>ไปยังหน้าเข้าสู่ระบบ</a></p>";
    
} catch(PDOException $e) {
    echo "<p style='color: red;'>❌ เกิดข้อผิดพลาด: " . $e->getMessage() . "</p>";
    echo "<h3>วิธีแก้ไข:</h3>";
    echo "<ul>";
    echo "<li>ตรวจสอบว่า MySQL ทำงานอยู่</li>";
    echo "<li>ตรวจสอบการตั้งค่าใน config.php</li>";
    echo "<li>ตรวจสอบสิทธิ์การเข้าถึงฐานข้อมูล</li>";
    echo "<li>ตรวจสอบว่าไฟล์ database.sql ถูกนำเข้าแล้ว</li>";
    echo "</ul>";
}
?> 