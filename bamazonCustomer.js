var mysql = require("mysql");

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
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.log(res);
    })
//validation function
function inputValidator() {
    var int = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);
    //input type conditional
    if(int && (sign ===1)){
        return true;
    }else{
        return "input accepts whole numbers(NON-ZERO)";
    }
    }

//function that prompts user to enter ID of the product they would like to buy and quantity
function askUserProductId(){
    //user the inquirer to prompt user for productID
    inquirer.prompt([
        {
            type: 'userinput',
            name: 'quantity',
            message: 'Kindly type the ID of the item you would love to purchase!',
            Validate: inputValidator,
            filter: Number
        },
        // prompts the user to enter how many units of the product they would like to buy
        {
            type: 'userinput',
            name: 'quantity',
            message: 'what quantity would you love to purchase?',
            Validate: inputValidator,
            filter: Number
        }
    ]).then(function(input){

        var item = input.item_id;
        var qunty =input_qunty;
        //The app queries the DB to check if the store has enough of the product to meet cust request
        //declare variable for the query
        var queryDbStr ='SELET * FROM products WHERE ?';
        
        //establish connection and have a function that returns error and/or data when query is sent
        connection.query(queryDbStr, {item_id: item}, function(err, data){
            if(err) throw err;
            
            //error for invalid lengh of search param
            if(data.length ===0){
                console.log('Query ERROR11; Enter Valid Item ID')
                logProductInfo();
            }else{
                var productInfo = info[0];
                //console.log('productInfo' = +JSON.stringify(productInfo));
                //console.log('productInfo.stock_qnty' = +JSON.stringify(productInfo.stock_qnty));

                //if quantity is equal to or less than stock quantity log the message product is in stock/processing order..                
                if(qunty<=productInfo.stock_qnty){
                    console.log('Great! your desired product is in stock! Running your Order ASAP');

                    //then update the SQL db to reflect the remaing quantity
                    var updatequeryDbStr ='UPDATE products SET stock_qty' +(productInfo.stock_qnty - qunty) + 'WHERE item_id =' +item;

                    //establish a connection and function that takes the var pdatequeryDbStr, then runs an update
                    connection.query(updatequeryDbStr, function(err, data){
                        if(err) throw err;
                        //once the update goes through, show the customer the total cost of their purchase
                        console.log("We place your order! \n Your total was $" +productInfo.price * qunty + '\n We appreciate your business');
                        //terminate the connection
                        connection.end();
                    })
                }else{
                    //However, if store does not have enough of the product, app should log a phrase "insufficient quantity!" 
                    console.log('We are sorry we cannot place your order! \n "insufficient quantity!" \n would you like to order something different that we have in stock?');
                    logProductInfo();
                }
            }

        })
    })
}






