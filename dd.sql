create database InventoryControlManagement;
use InventoryControlManagement;

CREATE TABLE category (
  categoryId INT PRIMARY KEY,
  category VARCHAR(255) NOT NULL
); 

INSERT INTO category (categoryId, category)
VALUES
  (1, 'Electronics'),
  (2, 'Books'),
  (3, 'Clothing'),
  (4, 'Toys'),
  (5, 'Furniture'),
  (6, 'Beauty'),
  (7, 'Sports'),
  (8, 'Appliances'),
  (9, 'Jewelry'),
  (10, 'Food and Beverage');  
  
  -- Products Table Defination 
  
  CREATE TABLE Products (
  productId INT PRIMARY KEY,
  categoryId INT,
  productName VARCHAR(255) NOT NULL,
  stock INT NOT NULL,
  price INT NOT NULL,
    FOREIGN KEY (categoryId)
    REFERENCES category(categoryId)
    ON DELETE CASCADE 
); 

INSERT INTO Products (productId, categoryId, productName, stock, price) VALUES 
(1, 1, 'Samsung Galaxy ', 10, 9000),
(2, 1, 'Apple iPhone ', 15, 100000),
(3, 2, 'The Alchemist', 50, 150),
(4, 2, 'To Kill a Mockingbird', 25, 400),
(5, 3, 'T-Shirt', 100, 250),
(6, 3, 'LevisJeans', 50, 1000),
(7, 4, 'Lego Classic Bricks Set', 30, 350),
(8, 4, 'Barbie Dreamhouse', 10, 1990),
(9, 5, 'Study Table', 20, 2000),
(10, 5, 'Sofa', 5, 20000),
(11, 6, 'Fairness cream', 50, 80),
(12, 6, ' Face Wash', 30, 50),
(13, 7, 'Bat', 15, 330),
(14, 7, 'Ball', 10, 80),
(15, 8, 'Refrigerator', 5, 9000),
(16, 8, 'Smart TV', 8, 40000),
(17, 9, 'Pandora Moments Snake Chain Bracelet', 20, 650),
(18, 9, 'Silver Ring', 2, 5000),
(19, 10, 'Cococola', 30, 50),
(20, 10, 'Dairymilk', 100, 25);
  
select * from Products; 
  

CREATE TABLE user (userid INT primary key, name VARCHAR(50), phone_no BIGINT,location VARCHAR(50) ); 
 
INSERT INTO user (userid, name, phone_no, location) VALUES ('1', 'Aryan', '9876543210', 'Delhi');
INSERT INTO user (userid, name, phone_no, location) VALUES ('2', 'Neha', '8765432109', 'Mumbai');
INSERT INTO user (userid, name, phone_no, location) VALUES ('3', 'Rajesh', '7654321098', 'Kolkata');
INSERT INTO user (userid, name, phone_no, location) VALUES ('4', 'Priya', '6543210987', 'Hyderabad');
INSERT INTO user (userid, name, phone_no, location) VALUES ('5', 'Sanjay', '5432109876', 'Bangalore');
INSERT INTO user (userid, name, phone_no, location) VALUES ('6', 'Aishwarya', '4321098765', 'Chennai');
INSERT INTO user (userid, name, phone_no, location) VALUES ('7', 'Vikram', '3210987654', 'Ahmedabad');
INSERT INTO user (userid, name, phone_no, location) VALUES ('8', 'Nisha', '2109876543', 'Chandigarh');
INSERT INTO user (userid, name, phone_no, location) VALUES ('9', 'Arjun', '1098765432', 'Jaipur');
INSERT INTO user (userid, name, phone_no, location) VALUES ('10', 'Sunita', '9876543210', 'Lucknow'); 

-- supplier table 
CREATE TABLE supplier (Sid INT primary key, S_name VARCHAR(50), Location VARCHAR(50) );

INSERT INTO supplier (Sid, S_Name, Location) VALUES ('1', 'Amit', 'NewDelhi');
INSERT INTO supplier (Sid, S_Name, Location) VALUES ('2', 'Sneha', 'Mumbai');
INSERT INTO supplier (Sid, S_Name, Location) VALUES ('3', 'Vijay', 'Kolkata');
INSERT INTO supplier (Sid, S_Name, Location) VALUES ('4', 'Divya', 'Hyderabad');
INSERT INTO supplier (Sid, S_Name, Location) VALUES ('5', 'Rahul', 'Bangalore');
INSERT INTO supplier (Sid, S_Name, Location) VALUES ('6', 'Swati', 'Chennai');
INSERT INTO supplier (Sid, S_Name, Location) VALUES ('7', 'Avinash', 'Ahmedabad');
INSERT INTO supplier (Sid, S_Name, Location) VALUES ('8', 'Pooja', 'Chandigarh');
INSERT INTO supplier (Sid, S_Name, Location) VALUES ('9', 'Karan', 'Jaipur');
INSERT INTO supplier (Sid, S_Name, Location) VALUES ('10', 'Anita', 'Lucknow');

-- Invoice table 

CREATE TABLE Invoice (
  InvoiceId INT PRIMARY KEY,
  Sid INT,
  productId INT,
  date DATE NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (Sid)
    REFERENCES supplier(Sid)
    ON DELETE CASCADE,
  FOREIGN KEY (productId)
    REFERENCES Products(productId)
    ON DELETE CASCADE
); 
-- creating a trigger
CREATE TRIGGER increase_stock
AFTER INSERT ON Invoice
FOR EACH ROW
UPDATE Products
SET stock = stock + NEW.quantity
WHERE productId = NEW.productId;  

INSERT INTO Invoice (InvoiceId, Sid, productId, date, quantity) VALUES (1, 1, 1, '2023-05-14', 3);
INSERT INTO Invoice (InvoiceId, Sid, productId, date, quantity) 
VALUES 
(2, 3, 4, '2022-02-20', 7),
(3, 2, 7, '2022-03-10', 3),
(4, 5, 2, '2022-04-05', 8),
(5, 9, 16, '2022-05-25', 4),
(6, 7, 12, '2022-06-12', 6),
(7, 4, 8, '2022-07-28', 9),
(8, 6, 13, '2022-08-16', 2),
(9, 8, 18, '2022-09-08', 7),
(10, 10, 5, '2022-10-19', 3),
(11, 2, 17, '2022-11-27', 6),
(12, 7, 20, '2022-12-23', 8),
(13, 1, 6, '2023-01-08', 4),
(14, 5, 11, '2023-02-13', 2),
(15, 3, 3, '2023-03-18', 5),
(16, 10, 19, '2023-04-21', 9),
(17, 9, 15, '2023-05-07', 6),
(18, 6, 9, '2023-05-22', 3),
(19, 4, 1, '2023-05-31', 7),
(20, 8, 14, '2023-05-28', 5);

INSERT INTO Invoice (InvoiceId, Sid, productId, date, quantity) VALUES (21, 1, 10, '2023-05-14', 25);
-- need add some more data , will do it here
-- till here 


-- order Details table 

CREATE TABLE Order_Details (
  orderId INT PRIMARY KEY,
  productId INT,
  userId INT,
  quantity INT NOT NULL,
  orderDate DATE,
  FOREIGN KEY (productId)
    REFERENCES Products(productId)
    ON DELETE CASCADE,
  FOREIGN KEY (userId)
    REFERENCES user(userid)
    ON DELETE CASCADE
);  

-- creating trigger 

CREATE TRIGGER decrease_stock
AFTER INSERT ON Order_Details
FOR EACH ROW
UPDATE Products
SET stock = stock - NEW.quantity
WHERE productId = NEW.productId;

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (1, 1, 1, 10, '2023-05-14');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (2, 3, 4, 5, '2022-11-28');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (3, 5, 6, 2, '2023-02-05');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (4, 2, 9, 7, '2022-12-31');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (5, 17, 8, 3, '2023-04-17');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (6, 10, 3, 8, '2023-01-08');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (7, 12, 2, 3, '2022-09-22');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (8, 16, 5, 6, '2023-03-16');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (9, 8, 7, 12, '2022-12-04');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (10, 20, 10, 2, '2023-05-01');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (11, 13, 9, 5, '2022-11-09');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (12, 6, 4, 9, '2023-02-27');

INSERT INTO Order_Details (orderId, productId, userId, quantity, orderDate)
VALUES (13, 7, 8, 4, '2022-10-12');


select * from Products;
select * from Order_Details order by orderDate;
  
  


-- Important Parameters Meta Data Queries 
SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'InventoryControlManagement'



