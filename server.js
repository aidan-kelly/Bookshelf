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
            console.log(err ? err.stack : res.rows);

            //check if the user entered the correct creds
            if(res.rows.toString() !== ""){
                if(res.rows[0].password === password){
                    socket.emit("log_in_response", true, res.rows[0].id);
                }
            }else{
                socket.emit("log_in_response", false, -1);
            }
        })
    });

});