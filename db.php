<?php
$host = 'localhost';
$db   = 'business_rating_system';
$user = 'root';
$pass = 'Atish@3823';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // For a professional look, you might want to log this instead of showing it
     die("Database connection failed: " . $e->getMessage());
}
?>
