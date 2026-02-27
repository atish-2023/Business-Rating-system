Business Listing & Rating System

This project is a simple Business Directory with a real-time rating
system. It was created based on the given Machine Test requirements.

The project demonstrates: - Core PHP (no framework) - MySQL database -
jQuery & AJAX - Bootstrap Modals - Raty Star Rating Plugin

All operations work without page refresh.

------------------------------------------------------------------------

PROJECT OVERVIEW

Users can: - Add new businesses - Edit business details - Delete
businesses - Rate businesses using a star rating system

When a rating is added or updated, the average rating updates
immediately without refreshing the page.

Everything works using AJAX.

------------------------------------------------------------------------

OBJECTIVE

The main goal of this project is: - Manage businesses (CRUD
operations) - Allow users to rate businesses - Show average rating in
real-time - Follow the Machine Test rules - Keep the code simple and
clean

------------------------------------------------------------------------

TECHNOLOGIES USED

-   PHP (Core PHP with PDO)
-   MySQL
-   HTML, CSS, JavaScript
-   jQuery
-   Bootstrap 5
-   Raty jQuery Plugin
-   Font Awesome

No framework is used.

------------------------------------------------------------------------


🔧 SYSTEM REQUIREMENTS

Before running this project, make sure the following software is installed on your system:

XAMPP (Apache + MySQL)

PHP (comes with XAMPP)

MySQL Server (via XAMPP)

Web Browser (Chrome / Edge recommended)

💻 REQUIRED INSTALLATION
1️⃣ Install XAMPP

Download and install XAMPP from the official website.

XAMPP includes:

Apache Server

MySQL Server

PHP

No separate PHP installation is required if you are using XAMPP.

2️⃣ Start Services

After installing XAMPP:

Open XAMPP Control Panel

Start Apache

Start MySQL

Both services must be running before accessing the project.

3️⃣ Database Setup

Open phpMyAdmin

Create database:

business_rating_system

Import the file:

sql/structure.sql

4️⃣ Project Location

Place the project folder inside:

C:/xampp/htdocs/

Then open in browser:

http://localhost/business_listing_rating_system
⚠ IMPORTANT NOTE

Make sure MySQL port (default 3306) is not used by another application.

If MySQL is not starting, check XAMPP logs.

Ensure db.php credentials match your MySQL setup.

Apache and MySQL must be running before opening the project.

--------------------------------------------------------------------------

 

📁 Folder Structure
project-folder/
│
├── assets/
│   ├── bootstrap/          (Bootstrap files)
│   ├── jquery/             (jQuery file)
│   ├── plugins/            (Raty, FontAwesome)
│   ├── css/style.css       (Custom CSS)
│   └── js/main.js          (Main JavaScript logic)
│
├── ajax/                   (All AJAX PHP files)
│   ├── create_business.php
│   ├── update_business.php
│   ├── delete_business.php
│   ├── fetch_listings.php
│   └── add_rating.php
│
├── includes/               (Header and Footer files)
├── db.php                  (Database connection)
├── index.php               (Main page)
├── sql/
│   └── structure.sql       (Database structure)
│
└── README.md

-------------------------------------------------------------------------

🗃️ Database Structure

This project uses two tables.

1️⃣ businesses Table

Stores all business details.

Column	     Description
id	           Primary key (auto increment)
name	        Business name
address	     Business address
phone	        10-digit mobile number
email	        Must end with @gmail.com
created_at	  Created date
updated_at	  Updated date


2️⃣ ratings Table

Stores ratings given by users.

Column	         Description
id	               Primary key
business_id	      Links to business
name	            Reviewer name
email	            Reviewer email
phone	            Reviewer phone
rating	         Value from 0.0 to 5.0 (half stars allowed)
created_at	      Created date
updated_at	      Updated date

Important Rule

A user can rate one business only once.

If the same email OR phone submits rating again:

The old rating will be updated.

A new row will NOT be created.

This prevents duplicate ratings.


------------------------------------------------------------------------

FULL PROJECT FLOW

1)  Page Load

-   index.php loads.
-   fetchListings() runs using AJAX.
-   Data is fetched from database.
-   Average rating is calculated using AVG().

2)  Add Business

-   Modal opens.
-   Form validated.
-   AJAX request sent to create_business.php.
-   Data saved.
-   Table refreshes without page reload.

3)  Edit Business

-   Modal opens with existing data.
-   AJAX request sent to update_business.php.
-   Data updated.
-   Table refreshes.

4)  Delete Business

-   Confirmation modal opens.
-   AJAX request sent to delete_business.php.
-   Business and related ratings deleted.
-   Table refreshes.

5)  Rating Flow

-   User clicks rating column.
-   Rating modal opens.
-   User enters details and rating.
-   AJAX request sent to add_rating.php.

Backend logic: - If email OR phone exists for same business → UPDATE
rating. - Otherwise → INSERT new rating.

After saving: - Average recalculated. - Table updates immediately. - No
page refresh.

------------------------------------------------------------------------

REAL-TIME UPDATE

Whenever data changes: - Business added - Business edited - Business
deleted - Rating added or updated

fetchListings() runs again to refresh table. This keeps UI and database
synchronized.

------------------------------------------------------------------------

VALIDATION RULES

Business: - Email must end with @gmail.com - Phone must be 10 digits -
Phone must start with 6, 7, 8, or 9

Rating: - Email required - Phone required - Rating required - Half stars
allowed

Validation is done on both frontend (JavaScript) and backend (PHP).

------------------------------------------------------------------------

SETUP INSTRUCTIONS

1)  Place project folder inside: C:/xampp/htdocs/

2)  Start Apache and MySQL.

3)  Create database: business_rating_system

4)  Import structure.sql.

5)  Update db.php if needed.

6)  Open in browser: http://localhost/business_listing_rating_system

------------------------------------------------------------------------

CONCLUSION

This project follows the Machine Test requirements. It uses simple logic
and clean structure. It avoids complex patterns. All operations work in
real-time using AJAX.

The goal was to keep the project simple, clear, and easy to understand.
