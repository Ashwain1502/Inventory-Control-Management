const express = require('express');
const mysql = require('mysql');

const app = express();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '8442',
  database: 'inventorycontrolmanagement'
});

app.set('view engine', 'ejs');

app.get('/data', (req, res) => {
  connection.query('SELECT * FROM Products', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    console.log(results);
    res.render('index', { results });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
