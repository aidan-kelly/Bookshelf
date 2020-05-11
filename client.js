$(function(){
    var socket = io();

    $('form').submit(function(e){
        e.preventDefault();
        socket.emit('log_in_attempt', $('#username').val(), $('#password').val());
        $('#m').val('');
        return false;
    });

    socket.on("log_in_response", function(response, uid){
        if(response === true){
            $("#log_in_response").text("Valid Log In!!!");
        }else{
            $("#log_in_response").text("Sorry, that username and password are not valid.");
        }
    });

});