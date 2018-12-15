//dependencies

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
  startPrompt();
});


//=================================Inquirer introduction===============================

function startPrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to view our inventory?",
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            inventory();
        } else {
            console.log("Thank you! Come back soon!");
        }
    });
//=====}===

//view products list
function inventory() {

    // instantiate
    var table = new Table({
        head: ['ItemID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });

    listInventory();

    // products table stores products in an array form and that is how we access the products
    function listInventory() {

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
            
            console.log("YOU NEED WE'VE GOT IT");
            
            console.log(table.toString());
            
            continuePrompt();
        });
    }
}

//--Inquirer user purchase--

function continuePrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase an item?",
        default: true

    }]).then(function(user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log("Thank you! Come back soon!");
        }
    });
}

//prompt to input the item ID and the DB is able to search for it
function selectionPrompt() {

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
    ]).then(function(userPurchase) {

        //connect to database to find stock_quantity in database. If user quantity input is greater than stock, decline purchase.

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {

                   console.log(" Dear customer Sorry!We are low on stock right now.");
                   
                    startPrompt();

                } else {
                    //show the selected item's information
                    
                    console.log("You are about to buy:");
                    console.log("Item: " + res[i].product_name);
                    console.log("Department: " + res[i].department_name);
                    console.log("\nPrice: " + res[i].price);
                    console.log("\nQuantity: " + userPurchase.inputNumber);                    
                    console.log("Your Total is: " + res[i].price * userPurchase.inputNumber);
                

                    var newStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
                    //console.log(newStock);
                    confirmPrompt(newStock, purchaseId);
                }
            }
        });
    });
}

//proceed to checkout
function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you would like to purchase this item and quantity?",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            //After customer checks out, connect to DB and update the s

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function(err, res) {});

            console.log("Anything else we can do for you today?");
            
            startPrompt();
        } else {
            console.log("Please check with our other locations");
            startPrompt();
        }
    });
}
}
