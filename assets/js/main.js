$(document).ready(function () {
    console.log("Application started. Verifying dependencies...");
    console.log("jQuery version:", $.fn.jquery);
    console.log("Bootstrap object detected:", typeof bootstrap !== 'undefined');
    const RATY_IMAGE_PATH = 'assets/plugins/raty/images';

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
        toastEl.classList.remove('bg-success', 'bg-danger', 'bg-info', 'bg-warning', 'text-white');

        if (type === 'success') {
            toastEl.classList.add('bg-success', 'text-white');
        } else if (type === 'error' || type === 'delete') {
            toastEl.classList.add('bg-danger', 'text-white');
        } else if (type === 'edit') {
            toastEl.classList.add('bg-info', 'text-white');
        } else {
            toastEl.classList.add('bg-secondary', 'text-white');
        }

        toastMsg.textContent = message;
        bsToast.show();
    }

    // Initial fetch
    fetchListings();

    // Helper to initialize or re‑initialize the stars widget. We keep a reference
    // to the instance so that we never create more than one group of stars.  The
    // plugin stores itself under ``data('raty')`` when it is created.
    let ratingInstance = null;

    function initRatingStars(score) {
        score = score || 0;
        const $stars = $('#rating-stars');

        // make sure previous instance is cleaned up; ``destroy`` is not part of
        // the 3.1.1 code so we do a manual reset.  This removes all event handlers,
        // empties the container and wipes the stored data so the call below behaves
        // exactly like the first time.
        if ($stars.data('raty')) {
            $stars.off('.raty').empty().removeData('raty');
        }

        $stars.raty({
            path: RATY_IMAGE_PATH,
            starOff: 'star-off.png',
            starOn: 'star-on.png',
            starHalf: 'star-half.png',
            number: 5,
            half: true,
            scoreName: 'rating',
            score: score,
            click: function (score) {
                $('#ratingInput').val(score);
            }
        });

        // store instance for later score updates
        ratingInstance = $stars.data('raty');
        return ratingInstance;
    }

    // perform initial setup once when the page loads (modal may never be opened
    // but the constructor costs almost nothing)
    if ($.fn.raty) {
        initRatingStars(0);
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
                            number: 5,
                            half: true,
                            path: RATY_IMAGE_PATH,
                            starOff: 'star-off.png',
                            starOn: 'star-on.png',
                            starHalf: 'star-half.png'
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
                    showToast('delete', response.message);
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

    // Restrict Phone input to digits only, 10 digits max, and starting with 6-9 (Indian Mobile Standard)
    $(document).on('keypress', '#phone, #reviewer_phone', function (e) {
        const charCode = e.which || e.keyCode;
        const currentValue = $(this).val();

        // 1. Block non-digits (Accept only 0-9)
        if (charCode < 48 || charCode > 57) {
            return false;
        }

        // 2. Apply requested logic: Block first digits 0-5
        if (currentValue.length === 0 && (charCode < 54 || charCode > 57)) {
            return false; // Blocks first digits 0-5 (Only allows 6, 7, 8, 9)
        }

        // 3. Apply requested logic: Blocks more than 10 digits
        if (currentValue.length >= 10) {
            return false; // Blocks more than 10 digits
        }
    });

    // Clear validation on input
    $('#businessForm input, #businessForm textarea, #ratingForm input').on('input', function () {
        $(this).removeClass('is-invalid');
    });

    // Frontend Validation function for Business
    function validateBusinessForm() {
        let isValid = true;
        const name = $('#name');
        const address = $('#address');
        const phone = $('#phone');
        const email = $('#email');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        const phoneRegex = /^[6789][0-9]{9}$/;

        if (name.val().trim() === "") { name.addClass('is-invalid'); isValid = false; }
        if (address.val().trim() === "") { address.addClass('is-invalid'); isValid = false; }

        if (email.val().trim() === "") {
            email.addClass('is-invalid');
            showToast('error', "Email is required");
            isValid = false;
        } else if (!emailRegex.test(email.val())) {
            email.addClass('is-invalid');
            showToast('error', "Only @gmail.com emails are accepted.");
            isValid = false;
        }

        if (phone.val().trim() === "") {
            phone.addClass('is-invalid');
            showToast('error', "Mobile number is required");
            isValid = false;
        } else if (!phoneRegex.test(phone.val())) {
            phone.addClass('is-invalid');
            showToast('error', "Invalid mobile number. Must be 10 digits and start with 6, 7, 8, or 9.");
            isValid = false;
        }

        return isValid;
    }

    // Frontend Validation for Rating
    function validateRatingForm() {
        let isValid = true;
        const name = $('#reviewer_name');
        const email = $('#reviewer_email');
        const phone = $('#reviewer_phone');
        const rating = $('#ratingInput');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        const phoneRegex = /^[6789][0-9]{9}$/;

        if (name.val().trim() === "") { name.addClass('is-invalid'); isValid = false; }

        if (email.val().trim() === "") {
            email.addClass('is-invalid');
            showToast('error', "Email is required");
            isValid = false;
        } else if (!emailRegex.test(email.val())) {
            email.addClass('is-invalid');
            showToast('error', "Only @gmail.com emails are accepted.");
            isValid = false;
        }

        if (phone.val().trim() === "") {
            phone.addClass('is-invalid');
            showToast('error', "Mobile number is required");
            isValid = false;
        } else if (!phoneRegex.test(phone.val())) {
            phone.addClass('is-invalid');
            showToast('error', "Invalid mobile number. Must be 10 digits and start with 6, 7, 8, or 9.");
            isValid = false;
        }

        if (!rating.val() || rating.val() == 0) {
            showToast('error', "Please select a rating star.");
            isValid = false;
        }

        return isValid;
    }

    // Business Form Submission (Add/Update)
    $('#businessForm').on('submit', function (e) {
        e.preventDefault();

        // Perform Validation
        if (!validateBusinessForm()) return;

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
                    const toastType = id ? 'edit' : 'success';
                    showToast(toastType, response.message);
                    fetchListings();
                } else {
                    showToast('error', response.message);
                    // Specific field highlighting based on backend response
                    if (response.message.toLowerCase().includes('email')) $('#email').addClass('is-invalid');
                    if (response.message.toLowerCase().includes('phone')) $('#phone').addClass('is-invalid');
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

        // ensure the widget is fresh every time the modal is shown.  Calling
        // ``initRatingStars`` will destroy any previous instance before creating a
        // new one, which is the safe re‑initialization pattern mentioned in the
        // requirements.  This also guarantees the correct image path is used and we
        // never end up with duplicate stars.
        if ($.fn.raty) {
            ratingInstance = initRatingStars(0);
        }

        const modal = getModal('ratingModal');
        if (modal) modal.show();
    });

    // Rating Form Submission
    $('#ratingForm').on('submit', function (e) {
        e.preventDefault();

        // Perform Validation
        if (!validateRatingForm()) return;

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
                    if (response.message.toLowerCase().includes('email')) $('#reviewer_email').addClass('is-invalid');
                    if (response.message.toLowerCase().includes('phone')) $('#reviewer_phone').addClass('is-invalid');
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
