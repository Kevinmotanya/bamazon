//node dependencies

var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",

    //Your port; if not 3306
    port: 3306,

    //Your username
    user: "root",

    //Your password
    password: "Delete123@",
    database: "bamazon"  
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id" + connection.threadId);
  openSales();
});


//--Beginning of the Inquirer

function openSales() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to view our inventory?",
        default: true

    }]).then(function(customer) {
        if (customer.confirm === true) {
            showinventory();
        } else {
            console.log("Thank you! Come back soon!");
        }
    });
//--

//view products list
function showInventory() {

    // declare var of inventory things
    var table = new Table({
        head: ['ItemID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });

   displayInventory();

    // products table stores products in an array form and that is how we access the products
    function displayInventory() {

        //making a query connection so as to SELECT from products 

        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var item_id = res[i].item_id,
                    product_name = res[i].product_name,
                    department_name = res[i].department_name,
                    price = res[i].price,
                    stock_quantity = res[i].stock_quantity;

              table.push(
                  [item_id, product_name, department_name, price, stock_quantity]
            );
          }
            
            console.log("YOU NEED WE,VE GOT IT");
            //outputs table information as a string ""
            console.log(table.toString());
            
            firstPrompt();
        });
    }
}

//--Inquirer user purchase--

function firstPrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase an item?",
        default: true

    }]).then(function(customer) {
        if (customer.continue === true) {
            choicePrompt();
        } else {
            console.log("Thank you! Come back soon!");
        }
    });
}

//prompt to input the item ID and the DB is able to search for it
function choicePrompt() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Enter item ID to be able to do purchase!",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "Enter desired units to purchase!",

        }
    ]).then(function(customerPurchase) {

        //connect to database to find stock_quantity in database. If user quantity input is greater than stock, decline purchase.

        connection.query("SELECT * FROM products WHERE item_id=?", customerPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (customerPurchase.inputNumber > res[i].stock_quantity) {

                   console.log(" Dear customer Sorry!We are low on stock right now.");
                   
                    openSales();

                } else {
                    //show the selected item's information
                    
                    console.log("You are about to buy:");
                    console.log("\nItem: " + res[i].product_name);
                    console.log("\nDepartment: " + res[i].department_name);
                    console.log("\nThe Price is: " + res[i].price);
                    console.log("\nQuantity purchased: " + customerPurchase.inputNumber);                    
                    console.log("\nYour Total is: " + res[i].price * customerPurchase.inputNumber);
                

                    var newStock = (res[i].stock_quantity - customerPurchase.inputNumber);
                    var purchaseId = (customerPurchase.inputId);
                    //console.log(newStock);
                    checkOut(newStock, purchaseId);
                }
            }
        });
    });
}

//proceed to checkout
function checkOut(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "acceptPurchase",
        message: "Do you want to proceed with this purchase?",
        default: true
//if customer wants to checkout, continue and run the function customerConfirm
    }]).then(function(customerConfirm) {
        //if buyer confirms the intention to purchase the query db and update purchase/stockqty
        if (customerConfirm.acceptPurchase === true) {

            //After customer checks out, connect to DB and update the s

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function(err, res) {
            });

            console.log("Anything else we can do for you today?");
            //reprompts bamazon
            openSales();
        } else {
            console.log("Please check with our other locations");
            // starts bamazon store again
            openSales();
        }
    });
}
}
