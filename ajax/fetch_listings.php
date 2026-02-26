<?php
require_once '../db.php';

try {
    // SQL to fetch businesses with their average rating
    // COALESCE(AVG(r.rating), 0) handles cases with no ratings
    $sql = "SELECT b.*, COALESCE(AVG(r.rating), 0) as avg_rating 
            FROM businesses b 
            LEFT JOIN ratings r ON b.id = r.business_id 
            GROUP BY b.id 
            ORDER BY b.created_at DESC";
    
    $stmt = $pdo->query($sql);
    $businesses = $stmt->fetchAll();

    if (empty($businesses)) {
        echo '<tr><td colspan="7" class="text-center">No businesses found.</td></tr>';
        exit;
    }

    foreach ($businesses as $row) {
        $avgRating = round($row['avg_rating'], 1);
        ?>
        <tr data-id="<?= $row['id'] ?>">
            <td><?= $row['id'] ?></td>
            <td class="business-name"><?= htmlspecialchars($row['name']) ?></td>
            <td class="business-address"><?= htmlspecialchars($row['address']) ?></td>
            <td class="business-phone"><?= htmlspecialchars($row['phone']) ?></td>
            <td class="business-email"><?= htmlspecialchars($row['email']) ?></td>
            <td>
                <!-- Read-only Raty for Average Rating -->
                <div class="avg-rating-display" data-score="<?= $avgRating ?>" data-id="<?= $row['id'] ?>"></div>
            </td>
            <td>
                <button class="btn btn-sm btn-info edit-btn" 
                        data-id="<?= $row['id'] ?>" 
                        data-name="<?= htmlspecialchars($row['name']) ?>"
                        data-address="<?= htmlspecialchars($row['address']) ?>"
                        data-phone="<?= htmlspecialchars($row['phone']) ?>"
                        data-email="<?= htmlspecialchars($row['email']) ?>"
                        title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn" 
                        data-id="<?= $row['id'] ?>"
                        title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
        <?php
    }
} catch (PDOException $e) {
    echo '<tr><td colspan="7" class="text-center text-danger">Error: ' . $e->getMessage() . '</td></tr>';
}
?>
