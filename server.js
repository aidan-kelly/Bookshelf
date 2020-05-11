var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
require('dotenv').config();
var {Pool} = require('pg');
var pool = new Pool();

var port = 3000;
http.listen(port, function(){
    console.log(`listening on port ${port}.`);
})

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

//serve the client js
app.get('/client.js', function(req, res) {
    res.sendFile(__dirname + "/" + "client.js");
});

io.on("connection", function(socket){

    console.log("Connection made.");

    socket.on("log_in_attempt", function(username, password){
        console.log(`Username = ${username} Password = ${password}`);

        pool.query("SELECT * FROM users WHERE username = $1", [username], (err, res) => {
            console.log(err ? err.stack : res.rows);
            if(res.rows !== [] && res.rows[0].password === password){
                console.log("valid login.");
                socket.emit("log_in_response", true, res.rows[0].id);
            }else{
                console.log("not a valid login.");
                socket.emit("log_in_response", false, -1);
            }
        })
    });

});