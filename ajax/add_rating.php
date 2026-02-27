<?php
require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $business_id = $_POST['business_id'] ?? '';
    $business_id = str_replace('BN', '', $business_id); // Strip BN prefix
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $rating = $_POST['rating'] ?? 0;

    if (empty($business_id) || empty($email) || empty($phone) || empty($rating)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'All fields including rating are required.']);
        exit;
    }

    // Email Validation - Strictly requiring @gmail.com
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !str_ends_with(strtolower($email), '@gmail.com')) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Only @gmail.com emails are accepted.']);
        exit;
    }

    // Indian Phone Validation (Starts with 6, 7, 8, 9 and total 10 digits)
    if (!preg_match('/^[6789][0-9]{9}$/', $phone)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Invalid phone number. Must be 10 digits and start with 6, 7, 8, or 9.']);
        exit;
    }

    try {
        // Check if rating exists for this business with same email OR same phone
        $checkSql = "SELECT id FROM ratings WHERE business_id = ? AND (email = ? OR phone = ?)";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([$business_id, $email, $phone]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            // Update existing rating
            $updateSql = "UPDATE ratings SET name = ?, email = ?, phone = ?, rating = ?, updated_at = NOW() WHERE id = ?";
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->execute([$name, $email, $phone, $rating, $existing['id']]);
            $msg = "Rating updated successfully.";
        } else {
            // Insert new rating
            $insertSql = "INSERT INTO ratings (business_id, name, email, phone, rating, created_at, updated_at) 
                          VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
            $insertStmt = $pdo->prepare($insertSql);
            $insertStmt->execute([$business_id, $name, $email, $phone, $rating]);
            $msg = "Rating added successfully.";
        }

        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'message' => $msg]);
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
