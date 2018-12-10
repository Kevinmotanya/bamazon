ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Delete123@';

-- create database bamazon --
CREATE DATABASE if not exists bamazon;

USE bamazon;

-- create table products --
CREATE TABLE if not exists products(
	item_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	price DECIMAL(10,4),
	stock_quantity INTEGER(10)
    
);

-- populate the database with 10 items --
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Simba", "Lion",11.75, 33),
	("Mamba", "Croc",13.83, 36),
	("Kobe", "Turtle",15.92, 39),
	("Mbuzi", "Goat",17.18, 42),
	("Panya", "Rat",19.27, 45),
	("Paka", "Cat",21.36, 48),
	("Kifaru", "Rhino",23.45, 52),
	("Nyati", "Buffalo",25.54, 55),
	("Twiga", "Giraffe",27.78, 58),
	("Punda", "Zebra",30.69, 61);

SELECT * FROM products;