<?php include 'includes/header.php'; ?>

<div class="row mb-4">
    <div class="col-md-6">
        <h2>Business Listings</h2>
    </div>
    <div class="col-md-6 text-end">
        <button type="button" class="btn btn-primary" id="addBusinessBtn">
            <i class="fas fa-plus"></i> Add New Business
        </button>
    </div>
</div>

<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover align-middle" id="businessTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Business Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Average Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="businessList">
                    <!-- Data will be loaded here via AJAX -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Business Add/Edit Modal -->
<div class="modal fade" id="businessModal" tabindex="-1" aria-labelledby="businessModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="businessForm">
                <div class="modal-header">
                    <h5 class="modal-title" id="businessModalLabel">Add Business</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="id" id="businessId">
                    <div class="mb-3">
                        <label for="name" class="form-label">Business Name</label>
                        <input type="text" class="form-control" name="name" id="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="address" class="form-label">Address</label>
                        <textarea class="form-control" name="address" id="address" rows="2" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="phone" class="form-label">Phone</label>
                        <input type="text" class="form-control" name="phone" id="phone" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" id="email" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="saveBusinessBtn">Save Business</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Rating Modal -->
<div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="ratingForm">
                <div class="modal-header">
                    <h5 class="modal-title" id="ratingModalLabel">Rate Business</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="business_id" id="ratingBusinessId">
                    <div class="mb-3">
                        <label class="form-label d-block">Your Rating</label>
                        <div id="rating-stars"></div>
                        <input type="hidden" name="rating" id="ratingInput" required>
                    </div>
                    <div class="mb-3">
                        <label for="reviewer_name" class="form-label">Your Name</label>
                        <input type="text" class="form-control" name="name" id="reviewer_name" required>
                    </div>
                    <div class="mb-3">
                        <label for="reviewer_email" class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" id="reviewer_email" required>
                    </div>
                    <div class="mb-3">
                        <label for="reviewer_phone" class="form-label">Phone</label>
                        <input type="text" class="form-control" name="phone" id="reviewer_phone" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Submit Rating</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
