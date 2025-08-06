<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// ล้าง session
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'ออกจากระบบสำเร็จ'
]);
?> 