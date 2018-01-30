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
  attract_socket.emit("attractWrite", "");
  attract_socket.on("attractWrite", (atr_word) => {
    $("#attract_box").prepend(atr_word);
  });
}
