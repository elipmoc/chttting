const attract_socket = io("/attractConnection");

//const url = location.href;
//attract_socket.emit("attractWrite","");
if (document.getElementById("attract_send")) {
  $("#attract_send").click(() => {
    const atr_word = document.myf.attract_word.value;
    attract_socket.emit("attractWrite", atr_word);
    $("#left_name_area").prepend(atr_word);
  });
}
if (document.getElementById("attract_box")) {
  attract_socket.emit("attractWord", "load");
  attract_socket.on("attractWord", (atr_word) => {
    $("#attract_box").prepend('<h3>'+atr_word+'</h3>');
  });
}
