# Business Listing & Rating System

A robust, real-time Business Directory with a built-in rating system. Built with Core PHP, MySQL, jQuery, and AJAX.

## Features
- **Full CRUD for Businesses**: Add, Edit, and Delete businesses without page refreshes.
- **Dynamic Rating System**: Integrated with the Raty jQuery plugin for a premium star-rating experience.
- **Smart Rating Logic**: Automatically updates existing ratings if a user (identified by Email or Phone) rates the same business again.
- **Half-Star Support**: Precise ratings from 0.0 to 5.0.
- **AJAX-Powered**: All operations are high-speed and asynchronous; the page never reloads.
- **Responsive Design**: Built with Bootstrap 5.0.2 for compatibility across all devices.

## Requirements
- XAMPP / WAMP / LAMP (PHP 7.4+ recommended)
- MySQL Database

## Setup Instructions

1. **Database Setup**:
   - Create a database named `business_listing_rating_system` in phpMyAdmin.
   - Import the `sql/database_export.sql` file into the new database.
   - (Optional) Verify connection settings in `db.php`.

2. **Project Deployment**:
   - Copy the project folder into your server's root directory (e.g., `C:/xampp/htdocs/`).
   - Open your browser and navigate to `http://localhost/business_listing_rating_system`.

3. **Usage**:
   - Click **"+ Add New Business"** to register a company.
   - Use the **Edit** and **Delete** buttons to manage listings.
   - Click on the **Stars** in the "Average Rating" column to open the rating modal and submit your feedback.

## Project Structure
- `index.php`: The main UI dashboard.
- `db.php`: Database connection (PDO).
- `ajax/`: PHP handlers for AJAX requests.
- `includes/`: Reusable Header and Footer components.
- `assets/`: Custom CSS, JS, and plugin configuration.
- `sql/`: Database structure and export scripts.

## Technologies Used
- **Backend**: Core PHP (PDO)
- **Frontend**: Bootstrap 5.0.2, Font Awesome 6.4
- **Libraries**: jQuery 3.6.0, Raty jQuery Plugin
