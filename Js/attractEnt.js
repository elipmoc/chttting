const attract_socket = io("/attractConnection");
const url = location.href;
$("#attract_send").click(() => {
  const atr_word = document.myf.attract_word.value;
  attract_socket.emit("attractWrite");
  attract_socket.on("attractWrite", (attractWord) => {
    $("#attract_box").prepend('<a href="' + urlLocation + '">'+attractWord+'</a>');
  })
});
