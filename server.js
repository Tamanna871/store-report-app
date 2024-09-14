// const axios = require('axios');
// const mysql = require('mysql2/promise');

// async function main() {
//     let connection; // Declare connection variable here

//     try {
//         console.log('Connecting to the database...');
//         connection = await mysql.createConnection({
//             host: 'localhost',
//             user: 'root',
//             password: '', // Leave empty if no password is set in XAMPP
//             database: 'store1_db'
//         });

//         console.log('Fetching data from API...');
//         const response = await axios.get('https://raw.githubusercontent.com/Bit-Code-Technologies/mockapi/main/purchase.json');
//         const data = response.data;
//         console.log('Data fetched successfully:', data);
//         await storeData(connection, data);

//         console.log('Data stored successfully.');
//     } catch (error) {
//         console.error('Error:', error);
//     } finally {
//         if (connection) { // Check if connection is defined before calling end
//             console.log('Closing database connection...');
//             await connection.end();
//         }
//     }
// }

// async function storeData(connection, data) {
//     for (const item of data) {
//         console.log(`Processing item: ${item.order_no}`);
//         await connection.execute('INSERT IGNORE INTO Users (name, phone) VALUES (?, ?)', [item.name, item.user_phone]);
//         await connection.execute('INSERT IGNORE INTO Products (product_code, product_name, product_price) VALUES (?, ?, ?)', [item.product_code, item.product_name, item.product_price]);

//         const [users] = await connection.execute('SELECT user_id FROM Users WHERE name = ? AND phone = ?', [item.name, item.user_phone]);
//         const [products] = await connection.execute('SELECT product_id FROM Products WHERE product_code = ?', [item.product_code]);

//         if (users.length === 0 || products.length === 0) {
//             console.error('User or product not found for item:', item);
//             continue;
//         }

//         const user_id = users[0].user_id;
//         const product_id = products[0].product_id;
//         const total_price = parseFloat(item.product_price) * item.purchase_quantity;

//         await connection.execute('INSERT INTO Purchase_History (order_no, user_id, product_id, purchase_quantity, total_price) VALUES (?, ?, ?, ?, ?)', [item.order_no, user_id, product_id, item.purchase_quantity, total_price]);
//     }
// }

// main();


const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise');
const cors = require('cors'); // Import cors

const app = express();
const port = 5000;

app.use(cors());

// Database connection (can be reused in multiple routes)
async function getConnection() {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // Your password for XAMPP, if any
        database: 'store1_db'
    });
}

// Route to fetch data and store it in the database
app.get('/fetch-store-data', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const response = await axios.get('https://raw.githubusercontent.com/Bit-Code-Technologies/mockapi/main/purchase.json');
        const data = response.data;

        await storeData(connection, data); // Reuse your existing storeData function
        res.status(200).json({ message: 'Data fetched and stored successfully' });
    } catch (error) {
        console.error('Error fetching/storing data:', error);
        res.status(500).json({ error: 'Failed to fetch/store data' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

// Route to generate the report
app.get('/generate-report', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        // SQL query to generate the report
        const [rows] = await connection.execute(`
            SELECT U.name, U.phone, SUM(PH.total_price) AS total_spent
            FROM Users U
            JOIN Purchase_History PH ON U.user_id = PH.user_id
            GROUP BY U.user_id
            ORDER BY total_spent DESC
            LIMIT 10;
        `);
        
        res.status(200).json(rows); // Return report data as JSON
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

// Function to store data (reused from your existing code)
async function storeData(connection, data) {
    for (const item of data) {
        console.log(`Processing item: ${item.order_no}`);
        
        // Insert user if not exists
        await connection.execute('INSERT IGNORE INTO Users (name, phone) VALUES (?, ?)', [item.name, item.user_phone]);
        
        // Insert product if not exists
        await connection.execute('INSERT IGNORE INTO Products (product_code, product_name, product_price) VALUES (?, ?, ?)', [item.product_code, item.product_name, item.product_price]);

        // Fetch user_id and product_id
        const [users] = await connection.execute('SELECT user_id FROM Users WHERE name = ? AND phone = ?', [item.name, item.user_phone]);
        const [products] = await connection.execute('SELECT product_id FROM Products WHERE product_code = ?', [item.product_code]);

        if (users.length === 0 || products.length === 0) {
            console.error('User or product not found for item:', item);
            continue;
        }

        const user_id = users[0].user_id;
        const product_id = products[0].product_id;
        const total_price = parseFloat(item.product_price) * item.purchase_quantity;

        // Check if the entry already exists based on order_no and created_at
        const [existingEntries] = await connection.execute('SELECT * FROM Purchase_History WHERE order_no = ? AND created_at = ?', [item.order_no, item.created_at]);

        if (existingEntries.length === 0) {
            // Insert new purchase history record
            await connection.execute('INSERT INTO Purchase_History (order_no, user_id, product_id, purchase_quantity, total_price, created_at) VALUES (?, ?, ?, ?, ?, ?)', [item.order_no, user_id, product_id, item.purchase_quantity, total_price, item.created_at]);
        }
    }
}


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
