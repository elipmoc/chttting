const socket = io("/attractConnection");
const url = location.href;
$("#attract_send").click(() => {
  const atr_word = document.myf.attract_word.value;
  socket.emit("attractWrite");
  socket.on("attractWrite", (attractWord) => {
    $("#attract_box").prepend('<a href="' + urlLocation + '">'+attractWord+'</a>');
  })
});
