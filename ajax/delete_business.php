<?php
require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'] ?? '';
    $id = str_replace('BN', '', $id); // Strip BN prefix

    if (empty($id)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'ID is required.']);
        exit;
    }

    try {
        // Start transaction to ensure both business and its ratings are deleted (or rely on cascade if set)
        $pdo->beginTransaction();

        // First delete ratings associated with the business
        $sqlRatings = "DELETE FROM ratings WHERE business_id = ?";
        $stmtRatings = $pdo->prepare($sqlRatings);
        $stmtRatings->execute([$id]);

        // Then delete the business
        $sqlBusiness = "DELETE FROM businesses WHERE id = ?";
        $stmtBusiness = $pdo->prepare($sqlBusiness);
        $stmtBusiness->execute([$id]);

        $pdo->commit();

        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'message' => 'Business and its ratings deleted successfully.']);
    } catch (PDOException $e) {
        $pdo->rollBack();
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
