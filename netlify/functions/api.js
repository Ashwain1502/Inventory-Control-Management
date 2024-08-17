import express from 'express';
import mysql from 'mysql';
import path from 'path';
import serverless from 'serverless-http';

// Create an instance of the Express application
const app = express();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12725867',
  password: 'mqW2PEMRQC',
  database: 'sql12725867'
});

// Set the view engine to ejs and specify the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'views'));

// Set the public directory for static files
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For handling JSON requests

// Define routes

app.get('/', (req, res) => {
  connection.query('SELECT p.productID, p.productName, p.price, p.stock, c.category as category FROM Products p JOIN category c ON p.categoryID = c.categoryID;', (error, results) => {
    if (error) return res.status(500).send('Error executing query: ' + error.message);
    res.json(results);
  });
});

app.get('/category', (req, res) => {
  connection.query('SELECT * FROM category', (error, results) => {
    if (error) return res.status(500).send('Error executing query: ' + error.message);
    res.json(results);
  });
});

app.get('/orders', (req, res) => {
  connection.query('SELECT * FROM Order_Details', (error, results) => {
    if (error) return res.status(500).send('Error executing query: ' + error.message);
    res.json(results);
  });
});

app.get('/invoice', (req, res) => {
  connection.query('SELECT i.InvoiceId, i.date, i.quantity, p.productName, s.S_name FROM Invoice i JOIN Products p ON i.productId = p.productId JOIN supplier s ON i.Sid = s.Sid ORDER BY i.InvoiceId ASC;', (error, results) => {
    if (error) return res.status(500).send('Error executing query: ' + error.message);
    res.json(results);
  });
});

app.get('/order', (req, res) => {
  connection.query('SELECT od.orderId, od.productId, od.quantity, od.orderDate, u.name FROM Order_Details od JOIN user u ON od.userId = u.userid;', (error, results) => {
    if (error) return res.status(500).send('Error executing query: ' + error.message);
    res.json(results);
  });
});

app.get('/supplier', (req, res) => {
  connection.query('SELECT * FROM supplier', (error, results) => {
    if (error) return res.status(500).send('Error executing query: ' + error.message);
    res.json(results);
  });
});

app.get('/user', (req, res) => {
  connection.query('SELECT * FROM user', (error, results) => {
    if (error) return res.status(500).send('Error executing query: ' + error.message);
    res.json(results);
  });
});

app.get('/rp', (req, res) => {
  connection.query('SELECT R.returnDate, R.quantity, R.returnId, U.name, P.productName FROM ReturnProducts R JOIN user U ON R.userId = U.userId JOIN Products P ON R.productId = P.productId;', (error, results) => {
    if (error) return res.status(500).send('Error executing query: ' + error.message);
    res.json(results);
  });
});

app.get('/newproduct', (req, res) => {
  res.status(200).send('Render newproduct form');
});

app.post('/addproduct', (req, res) => {
  const { productId, categoryId, productName, stock, price } = req.body;
  const sql = 'INSERT INTO Products (productId, categoryId, productName, stock, price) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [productId, categoryId, productName, stock, price], (error, results) => {
    if (error) return res.status(500).send('Error inserting product: ' + error.message);
    res.status(201).send('Product inserted successfully');
  });
});

app.get('/queries/:queryType', (req, res) => {
  const queryType = req.params.queryType;
  let sql = '';

  switch (queryType) {
    case 'lowStock':
      sql = 'SELECT * FROM Products WHERE stock < 15;';
      break;
    case 'totalValue':
      sql = 'SELECT SUM(stock * price) AS total_value FROM Products;';
      break;
    case 'userOrders':
      sql = 'SELECT * FROM Order_Details WHERE userId = 5;';
      break;
    case 'totalRevenueDateRange':
      sql = `SELECT SUM(p.price * od.quantity) AS total_revenue
             FROM Order_Details od
             JOIN Products p ON od.productId = p.productId
             WHERE od.orderDate BETWEEN '2022-01-01' AND '2022-12-31';`;
      break;
    case 'topSuppliers':
      sql = `SELECT s.Sid, s.S_name, COUNT(i.InvoiceId) AS total_invoices
             FROM supplier s
             JOIN Invoice i ON s.Sid = i.Sid
             GROUP BY s.Sid, s.S_name
             ORDER BY total_invoices DESC
             LIMIT 5;`;
      break;
    case 'categoryProducts':
      sql = 'SELECT * FROM Products WHERE categoryId = 2;';
      break;
    case 'topSuppliers4':
      sql = `SELECT s.Sid, s.S_name, COUNT(i.InvoiceId) AS total_invoices
             FROM supplier s
             JOIN Invoice i ON s.Sid = i.Sid
             GROUP BY s.Sid, s.S_name
             ORDER BY total_invoices DESC
             LIMIT 4;`;
      break;
    case 'userOrdersCount':
      sql = `SELECT u.userid, u.name, COUNT(od.orderId) AS total_orders
             FROM user u
             JOIN Order_Details od ON u.userid = od.userId
             GROUP BY u.userid, u.name
             ORDER BY total_orders DESC
             LIMIT 5;`;
      break;
    case 'salesAndRevenue':
      sql = `SELECT p.productId, p.productName, SUM(od.quantity) AS total_quantity, SUM(od.quantity * p.price) AS total_revenue
             FROM Products p
             JOIN Order_Details od ON p.productId = od.productId
             GROUP BY p.productId, p.productName;`;
      break;
    case 'neverOrdered':
      sql = `SELECT p.productId, p.productName
             FROM Products p
             LEFT JOIN Order_Details od ON p.productId = od.productId
             WHERE od.productId IS NULL;`;
      break;
    case 'topSelling':
      sql = `SELECT p.productId, p.productName, SUM(p.price * od.quantity) AS total_revenue
             FROM Order_Details od
             JOIN Products p ON od.productId = p.productId
             WHERE od.orderDate BETWEEN '2022-01-01' AND '2022-12-31'
             GROUP BY p.productId, p.productName
             ORDER BY total_revenue DESC;`;
      break;
    case 'monthlyRevenue':
      sql = `SELECT YEAR(od.orderDate) AS year, MONTH(od.orderDate) AS month, SUM(p.price * od.quantity) AS total_revenue, COUNT(*) AS order_count
             FROM Order_Details od
             JOIN Products p ON od.productId = p.productId
             GROUP BY YEAR(od.orderDate), MONTH(od.orderDate)
             ORDER BY YEAR(od.orderDate), MONTH(od.orderDate);`;
      break;
    default:
      return res.status(400).send('Invalid query type');
  }

  connection.query(sql, (error, results) => {
    if (error) return res.status(500).send('Error executing query: ' + error.message);
    res.json(results);
  });
});

// Serve EJS views and static files

app.get('/views/:viewName', (req, res) => {
  const viewName = req.params.viewName;
  res.render(viewName);
});

app.get('/public/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  res.sendFile(path.join(__dirname, '..', '..', 'public', fileName));
});

export const handler = serverless(app);
