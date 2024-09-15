
# Store Report App

## Overview

The Store Report App is a full-stack application designed to fetch data from a provided API, store it in a database, and generate detailed reports on demand. This project demonstrates proficiency in database design, API integration, and frontend development.

## Project Structure

- **Frontend**: Built with React, located in the `store-report-app` directory.
- **Backend**: Built with Node.js and Express, represented by the server.js file, located in the `root` directory.
- **Database**: Uses a MySQL database managed via XAMPP for storing and managing data.

## API Endpoint

The project fetches data from the following API endpoint:

- [https://raw.githubusercontent.com/Bit-Code-Technologies/mockapi/main/purchase.json]

## Features

- **Data Fetching**: Fetches data from the API and stores it in the database when the "Generate Report" button is clicked.
- **Report Generation**: Generates a report listing the top purchasers by total amount spent.
- **Design**: The UI is built to be clean, intuitive, and easy to navigate.

## Steps to set up, run, and test the solution

### Set Up the Database

To set up the database for the project, follow these steps:

1. **Install XAMPP:**
   - Download and install XAMPP from the official website: [https://www.apachefriends.org/download.html].
   - XAMPP is a free and open-source cross-platform web server solution stack package developed by Apache Friends, which consists of the Apache HTTP Server, MySQL, and interpreters for scripts written in the PHP and Perl programming languages.

2. **Start XAMPP Control Panel:**
   - After installation, open the XAMPP Control Panel.
   - Click on the **Start** button next to **Apache** and **MySQL** to run these services.
   - Ensure that both services are running (you will see a green status indicator).

3. **Access phpMyAdmin:**
   - In the XAMPP Control Panel, click on the **Admin** button next to **MySQL**. This will open **phpMyAdmin** in your web browser.
   - Alternatively, you can access phpMyAdmin by navigating to [http://localhost/phpmyadmin/] in your browser.

4. **Create the Database:**
   - In phpMyAdmin, look for the "Create database" section on the left-hand side.
   - Provide a name for your database (e.g., `store1_db`).
   - Click **Create** to create the database.

5. **Create the Tables:**
   - After creating the database, click on the database name (`store1_db`) in the left-hand menu.
   - Navigate to the **SQL** tab in the top menu.
   - In the SQL editor, paste the following queries to create the necessary tables for your project:

   ```sql
   -- Users Table
   CREATE TABLE Users (
     user_id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     phone VARCHAR(255) NOT NULL UNIQUE
   );

   -- Products Table
   CREATE TABLE Products (
     product_id INT AUTO_INCREMENT PRIMARY KEY,
     product_code VARCHAR(255) NOT NULL UNIQUE,
     product_name VARCHAR(255) NOT NULL,
     product_price DECIMAL(10, 2) NOT NULL
   );

   -- Purchase History Table
   CREATE TABLE Purchase_History (
     purchase_history_id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     product_id INT NOT NULL,
     order_no INT NOT NULL,
     purchase_quantity INT NOT NULL,
     total_price DECIMAL(10, 2) NOT NULL,
     created_at DATETIME NOT NULL,
     FOREIGN KEY (user_id) REFERENCES Users(user_id),
     FOREIGN KEY (product_id) REFERENCES Products(product_id),
     UNIQUE KEY unique_order_user_product (order_no, user_id, product_id, created_at)
   );

6. **Enable Foreign Key Checks:**

   - Before executing the queries, ensure that the Foreign Key Check option is enabled.
   - This ensures that relationships between tables (foreign key constraints) are correctly set up.
   - After confirming, click the Go button to execute the queries and create the tables.

## Installation

### Clone the Repository

```bash
git clone https://github.com/Tamanna871/store-report-app.git task_2
cd task_2
```

### Backend Setup

1. **Install backend dependencies:**

   ```bash
   npm install
   ```

2. **Start the backend server:**

   ```bash
   npm start
   ```

### Frontend Setup

1. Open another new terminal and navigate to the `store-report-app` directory:

   ```bash
   cd task_2
   cd store-report-app
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Start the React development server:**

   ```bash
   npm start
   ```

## Usage

- Navigate to [http://localhost:3000] to access the frontend application.
- Click the **"Generate Report"** button to fetch data from the API, store it in the database, and generate a report.
- The report will display a list of top purchasers with details including purchaser name, phone number, and total amount spent.
