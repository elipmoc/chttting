const attract_socket = io("/attractConnection");
//const url = location.href;
//attract_socket.emit("attractWrite","");
$("#attract_send").click(() => {
  const atr_word = document.myf.attract_word.value;
  attract_socket.emit("attractWrite", atr_word);
});
