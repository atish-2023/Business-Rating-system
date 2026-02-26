$(document).ready(function () {
    console.log("Application started. Verifying dependencies...");
    console.log("jQuery version:", $.fn.jquery);
    console.log("Bootstrap object detected:", typeof bootstrap !== 'undefined');

    // Helper to get/create Bootstrap Modal instances
    function getModal(id) {
        var el = document.getElementById(id);
        if (!el) {
            console.error("Critical: Modal element #" + id + " not found in HTML.");
            return null;
        }

        // Try multiple ways to find the Bootstrap 5 JS object
        var bs = null;
        try {
            bs = window.bootstrap || (typeof bootstrap !== 'undefined' ? bootstrap : null);
        } catch (e) {
            // console.warn("Standard 'bootstrap' variable not accessible, checking window..."); // Removed as per instruction
            bs = window.bootstrap;
        }

        if (bs && bs.Modal) {
            return bs.Modal.getOrCreateInstance(el);
        } else {
            console.error("FATAL: Bootstrap 5 JS (Modal) not detected. Check footer.php script links.");
            showToast('error', "Application Error: Bootstrap 5 library failed to load. Please check your internet connection.");
            return null;
        }
    }

    // Reusable Professional Toast Function
    function showToast(type, message) {
        const toastEl = document.getElementById('liveToast');
        const toastMsg = document.getElementById('toastMessage');
        // Ensure bootstrap is loaded before trying to create Toast instance
        if (typeof bootstrap === 'undefined' || !bootstrap.Toast) {
            console.error("Bootstrap Toast component not available. Cannot show toast.");
            // Fallback to alert if toast system is broken
            alert(message);
            return;
        }
        const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl);

        // Styling based on type
        toastEl.classList.remove('bg-success', 'bg-danger', 'text-white');
        if (type === 'success') {
            toastEl.classList.add('bg-success', 'text-white');
        } else if (type === 'error') {
            toastEl.classList.add('bg-danger', 'text-white');
        }

        toastMsg.textContent = message;
        bsToast.show();
    }

    // Initial fetch
    fetchListings();

    // Initialize Raty for Rating Modal
    if ($.fn.raty) {
        $('#rating-stars').raty({
            starType: 'i',
            half: true,
            scoreName: 'rating',
            score: 0,
            starOn: 'fa-solid fa-star text-warning',
            starOff: 'fa-regular fa-star text-muted',
            starHalf: 'fa-solid fa-star-half-stroke text-warning',
            click: function (score) {
                $('#ratingInput').val(score);
            }
        });
    } else {
        console.error("Raty plugin not loaded correctly. Check if jquery.raty.js is accessible.");
        showToast('error', "Warning: Rating plugin failed to load. Please check your internet connection or script paths.");
    }

    // Helper function to fetch listings
    function fetchListings() {
        $.ajax({
            url: 'ajax/fetch_listings.php',
            type: 'GET',
            success: function (data) {
                $('#businessList').html(data);

                // Initialize Raty for each average rating display (read-only)
                if ($.fn.raty) {
                    $('.avg-rating-display').each(function () {
                        const score = $(this).data('score');
                        $(this).raty({
                            readOnly: true,
                            score: score,
                            half: true,
                            starType: 'i',
                            starOn: 'fa-solid fa-star text-warning',
                            starOff: 'fa-regular fa-star text-muted',
                            starHalf: 'fa-solid fa-star-half-stroke text-warning'
                        });
                    });
                }
            },
            error: function () {
                showToast('error', "Database connection failed or script error.");
            }
        });
    }

    // Reset modals on open - Now handled explicitly to ensure reliability
    $('#addBusinessBtn').on('click', function () {
        console.log("Add Business button clicked");
        $('#businessForm')[0].reset();
        $('#businessId').val('');
        $('#businessModalLabel').text('Add Business');

        const modal = getModal('businessModal');
        if (modal) {
            modal.show();
        } else {
            console.error("Modal #businessModal not found or Bootstrap not loaded.");
        }
    });

    // Edit Business - Open Modal Programmatically
    $(document).on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const address = $(this).data('address');
        const phone = $(this).data('phone');
        const email = $(this).data('email');

        $('#businessId').val(id);
        $('#name').val(name);
        $('#address').val(address);
        $('#phone').val(phone);
        $('#email').val(email);

        $('#businessModalLabel').text('Edit Business');

        // Bootstrap 5 Native Show
        const modal = getModal('businessModal');
        if (modal) modal.show();
    });

    // Delete Business - Open Confirm Modal
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        $('#deleteBusinessId').val(id); // Store ID in a hidden field in the confirmation modal
        const modal = getModal('deleteConfirmModal');
        if (modal) modal.show();
    });

    // Confirm Delete Click
    $('#confirmDeleteBtn').on('click', function () {
        const id = $('#deleteBusinessId').val();
        $.ajax({
            url: 'ajax/delete_business.php',
            type: 'POST',
            data: { id: id },
            dataType: 'json',
            success: function (response) {
                const modal = getModal('deleteConfirmModal');
                if (modal) modal.hide(); // Close confirmation modal
                if (response.status === 'success') {
                    showToast('success', response.message);
                    fetchListings();
                } else {
                    showToast('error', response.message);
                }
            },
            error: function () {
                const modal = getModal('deleteConfirmModal');
                if (modal) modal.hide();
                showToast('error', "Error deleting business. Please try again.");
            }
        });
    });

    // Business Form Submission (Add/Update)
    $('#businessForm').on('submit', function (e) {
        e.preventDefault();
        const id = $('#businessId').val();
        const url = id ? 'ajax/update_business.php' : 'ajax/create_business.php';

        $.ajax({
            url: url,
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    const modal = getModal('businessModal');
                    if (modal) modal.hide();
                    showToast('success', response.message);
                    fetchListings();
                } else {
                    showToast('error', response.message);
                }
            },
            error: function () {
                const modal = getModal('businessModal');
                if (modal) modal.hide();
                showToast('error', "Error saving business. Please try again.");
            }
        });
    });

    // Rating Modal - Open Programmatically
    $(document).on('click', '.avg-rating-display', function () {
        const business_id = $(this).data('id');
        $('#ratingForm')[0].reset();
        $('#ratingBusinessId').val(business_id);
        $('#ratingInput').val(0);

        // Reset Raty stars
        if ($.fn.raty) {
            $('#rating-stars').raty('score', 0);
        }

        const modal = getModal('ratingModal');
        if (modal) modal.show();
    });

    // Rating Form Submission
    $('#ratingForm').on('submit', function (e) {
        e.preventDefault();
        const rating = $('#ratingInput').val();

        if (!rating || rating == 0) {
            showToast('error', "Please select a rating star.");
            return;
        }

        $.ajax({
            url: 'ajax/add_rating.php',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    const modal = getModal('ratingModal');
                    if (modal) modal.hide();
                    showToast('success', response.message);
                    fetchListings();
                } else {
                    showToast('error', response.message);
                }
            },
            error: function () {
                const modal = getModal('ratingModal');
                if (modal) modal.hide();
                showToast('error', "Error submitting rating. Please try again.");
            }
        });
    });
});
