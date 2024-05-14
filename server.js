const express = require('express');
const mysql = require('mysql');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
<<<<<<< HEAD
  user: 'root',
  password: 'tinku123',
  database: 'inventorycontrolmanagement'
=======
  user: 'your_username - usually "root"',
  password: 'your_password',
  database: 'your_database_name'
>>>>>>> dd663c4d76edd5827370282625ff781356009fc3
});

app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  connection.query('SELECT p.productID, p.productName, p.price,p.stock, c.category as category FROM Products p JOIN category c ON p.categoryID = c.categoryID;', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    console.log(results);
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
    console.log(results);
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
    console.log(results);
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


app.listen(5454, () => {
  console.log('Server is running on port 5454');
});
