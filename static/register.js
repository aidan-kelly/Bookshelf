$(function(){
    var socket = io();

    //on submit of the login form
    $('form').submit(function(e){
        e.preventDefault();
        //send over the creds
        if($("#password").val() !== $("#password2")){
            $("#registration_response").text("Please ensure that the passwords match.");
        }else if($("#password").val() === "" || $("#password2").val() === "" || $("#username").val() === ""){
            $("#registration_response").text("Please fill out all the input fields.");
        }else{
            socket.emit('registration_attempt', $('#username').val(), $('#password').val());
        }
        return false;
    });

    //on response from server
    socket.on("registration_response", function(response, uid){
        //our creds were correct
        if(response === true){
            $("#registration_response").text("Valid Registration!!!");
        //our creds were  incorrect
        }else{
            $("#registration_response").text("Sorry, that username is already in use.");
        }
    });
});