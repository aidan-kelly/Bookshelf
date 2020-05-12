$(function(){
    var socket = io();

    //on submit of the login form
    $('form').submit(function(e){
        e.preventDefault();
        //send over the creds
        socket.emit('log_in_attempt', $('#username').val(), $('#password').val());
        return false;
    });

    //on response from server
    socket.on("log_in_response", function(response, uid){
        //our creds were correct
        if(response === true){
            $("#log_in_response").text("Valid Log In!!!");
        //our creds were  incorrect
        }else{
            $("#log_in_response").text("Sorry, that username and password are not valid.");
        }
    });
});