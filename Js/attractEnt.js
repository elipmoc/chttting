const attract_socket = io("/attractConnection");

//const url = location.href;
//attract_socket.emit("attractWrite","");
if (document.getElementById("attract_send")) {
  $("#attract_send").click(() => {
    const atr_word = document.myf.attract_word.value;
    attract_socket.emit("attractWrite", atr_word);
  });
}

if (document.getElementById("attract_box")) {
  attract_socket.emit("attractLoad", "");
  attract_socket.on("attractLoad", (atr_word) => {
    JSON.parse(atr_word).forEach((atr_log) => {
      $("#attract_box").prepend("<h4>" + atr_log + "</h4><hr>");
    });
  });
}
