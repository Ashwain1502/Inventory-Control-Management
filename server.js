const express = require('express');
const mysql = require('mysql');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12725867',
  password: 'mqW2PEMRQC',
  database: 'sql12725867'
});

app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  connection.query('SELECT p.productID, p.productName, p.price,p.stock, c.category as category FROM Products p JOIN category c ON p.categoryID = c.categoryID;', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    res.render('product', { results });
  });
});

app.get('/category', (req, res) => {
  connection.query('SELECT * FROM category', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    res.render('category', { results });
  });
}); 

app.get('/orders', (req, res) => {
  connection.query('SELECT * FROM Order_Details', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    res.render('order', { results });
  });
});

app.get('/invoice', (req, res) => {
  connection.query('SELECT i.InvoiceId, i.date,i.quantity, p.productName, s.S_name FROM Invoice i JOIN Products p ON i.productId = p.productId JOIN supplier s ON i.Sid = s.Sid order by i.InvoiceId asc ;', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    
    res.render('invoice', { results });
  });
});

app.get('/order', (req, res) => {
  connection.query('SELECT od.orderId, od.productId , od.quantity,od.orderDate, u.name FROM Order_Details od JOIN user u ON od.userId = u.userid;', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    res.render('orders', { results });
  });
});

app.get('/supplier', (req, res) => {
  connection.query('SELECT * FROM supplier', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    } 
    res.render('supplier', { results });
  });
});

app.get('/user', (req, res) => {
  connection.query('SELECT * FROM user', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    res.render('user', { results });
  });
}); 

app.get('/rp', (req, res) => {
  connection.query('SELECT R.returnDate,R.quantity,R.returnId, U.name, P.productName FROM ReturnProducts R JOIN user U ON R.userId = U.userId JOIN Products P ON R.productId = P.productId;', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    res.render('rp', { results });
  });
});

app.get('/newproduct', (req, res) => {
  res.render('newproduct');
});

app.post('/addproduct', (req, res) => {
  const { productId, categoryId, productName, stock, price } = req.body;
  const sql = 'INSERT INTO Products (productId, categoryId, productName, stock, price) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [productId, categoryId, productName, stock, price], (error, results, fields) => {
      if (error) {
          console.error('Error inserting product: ', error); // Log detailed error message
          return res.status(500).send('Error inserting product: ' + error.message); // Send error message to client
      }
      console.log('Product inserted successfully:', results);
      res.redirect('/newproduct');
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

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return res.status(500).send('Error executing query');
    }
    res.render('query', { results });
  });
});
