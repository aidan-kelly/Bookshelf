var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
require('dotenv').config();
var {Pool} = require('pg');
var pool = new Pool();

var port = 3000;

http.listen(port, function(){
    console.log(`listening on port ${port}.`);
})

//serve the client.js
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/static/" + "index.html");
});

app.use(express.static('static'))

//new connections
io.on("connection", function(socket){

    console.log("Connection made.");

    //when a user tries to log in
    socket.on("log_in_attempt", function(username, password){

        //check database for that username
        pool.query("SELECT * FROM users WHERE username = $1", [username], (err, res) => {

            //check if the user entered the correct creds
            if(res.rows.length !== 0){
                if(res.rows[0].password === password){
                    socket.emit("log_in_response", true, res.rows[0].id);
                }else{
                    socket.emit("log_in_response", false, -1);
                }
            }else{
                socket.emit("log_in_response", false, -1);
            }
        })
    });

    socket.on("registration_attempt", function(username, password){
        
        //attempt to add to db
        pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password], (err, res) => {
            
            if(err){
                socket.emit("registration_response", false, -1);
            }else{
                pool.query("SELECT * FROM users WHERE username = $1", [username], (err, res) => {
                    socket.emit("registration_response", true, res.rows[0].id);
                });
            }
        });
    });

    socket.on("user_book_request", function(uid){
        pool.query("SELECT * FROM BOOKS WHERE owner_id = $1", [uid], (err, res) => {
            if(err){
                console.log("FUCK");
            }else{
                socket.emit("user_book_response", res.rows);
            }
        });
    })

});