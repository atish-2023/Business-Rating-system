<?php
require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $address = $_POST['address'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';

    if (empty($id) || empty($name) || empty($address) || empty($phone) || empty($email)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
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
        // Check for duplicates (excluding current ID)
        $check = $pdo->prepare("SELECT id FROM businesses WHERE (email = ? OR phone = ?) AND id != ?");
        $check->execute([$email, $phone, $id]);
        if ($check->fetch()) {
            echo json_encode(['status' => 'error', 'message' => 'Another business already has this Email or Phone.']);
            exit;
        }

        $sql = "UPDATE businesses SET name = ?, address = ?, phone = ?, email = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $address, $phone, $email, $id]);

        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'message' => 'Business updated successfully.']);
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
