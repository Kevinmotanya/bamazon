ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Delete123@';

CREATE DATABASE if not exists bamazon;

USE bamazon;

CREATE TABLE if not exists products(
item_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL(10,4),
stock_quantity INTEGER(10)
);