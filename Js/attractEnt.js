const attract_socket = io("/attractConnection");
const url = document.location.href;

//attract_socket.emit("attractWrite","");
let atrHash = {};
if (document.getElementById("attract_send")) {
  $("#attract_send").click(() => {
    const atr_word = document.myf.attract_word.value;
    attract_socket.emit("attractWrite", JSON.stringify({
      url: url,
      atr_word: atr_word
    }));
  });
}

if (document.getElementById("attract_box")) {
  attract_socket.emit("attractLoad", "");
  attract_socket.on("attractLoad", (atr_word) => {
    JSON.parse(atr_word).forEach((atr_log) => {
      $("#attract_box").prepend("<a href='"+atr_log["url"]+"'><h6>" + atr_log["atr_word"] + "</h6></a><hr>");
    });
  });
}
