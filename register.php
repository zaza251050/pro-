<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $confirmPassword = $input['confirmPassword'] ?? '';
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (empty($name) || empty($email) || empty($password)) {
        throw new Exception('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
    
    // ตรวจสอบรูปแบบอีเมล
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('รูปแบบอีเมลไม่ถูกต้อง');
    }
    
    // ตรวจสอบรหัสผ่าน
    if (strlen($password) < 6) {
        throw new Exception('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    }
    
    // ตรวจสอบการยืนยันรหัสผ่าน
    if ($password !== $confirmPassword) {
        throw new Exception('รหัสผ่านไม่ตรงกัน');
    }
    
    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        throw new Exception('อีเมลนี้ถูกใช้งานแล้ว');
    }
    
    // เข้ารหัสผ่าน
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // เพิ่มผู้ใช้ใหม่
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword]);
    
    $userId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'ลงทะเบียนสำเร็จ',
        'user_id' => $userId
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?> 