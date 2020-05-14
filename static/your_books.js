$(function(){
    var socket = io();

    let cookies = document.cookie;
    let uid = getCookie("uid");

    socket.emit("user_book_request", uid);
    socket.on("user_book_response", function(response){
        if(response.length === 0){
            $('#your_books_table').after(`<div>You haven't added any books :(</div>`);
        }
        for(let i = 0; i<response.length; i++){
            let current_row = response[i];
            $('#your_books_table tr:last').after(`<tr><td>${current_row.title}</td><td>${current_row.author}</td><td>${current_row.status}</td></tr>`);
        }
    });
});

//Functions ----------------------------------------------------------------------------------------

//returns the value of a cookie
function getCookie(cookie_name){
    let name = cookie_name + "=";
    let cookies = document.cookie;
    let split_cookies = cookies.split(";");

    for(let i = 0; i <split_cookies.length; i++) {
        var c = split_cookies[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
}