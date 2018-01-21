$('#left').click(function(e) {
  document.location.href = "dip.html?name=dipe";
});

$('#right').click(function(e) {
  document.location.href = "dip.html?name=dipe2";
});

let socket = io();
var loc = document.location.href;
var paramItem = loc.split('=');
var chatConnection = new ChatConnection("dipe", msgDataAdd);

$('#chat_send').click(function(e) {
  let ms = document.myf.com.value;
  let nm = document.myf.name.value;

  if (ms != "" && nm != "") {
    chatConnection.sendData(
      JSON.stringify({
        "msg": nm + " > " + ms,
        "dipeType": paramItem[1]
      })
    );
  }
  document.myf.com.value = "";
});


//データをチャットメッセージとして追加する関数
function msgDataAdd(data) {
  data = JSON.parse(data);
  console.log(data);
  let msg = commandFilter(data["msg"]) + '<br><hr>';
  if (data["dipeType"] == "dipe") {
    $('#chat_log').prepend(msg);
  } else if (data["dipeType"] == "dipe2") {
    $('#chat_log2').prepend(msg);
  }
}

$("#title_send").click(() => {
  let word = document.myf.title_word.value;
  socket.emit('titleSend', word);
});

socket.on('titleSend', (title) => {
  let title_bar = document.getElementById("titlec");
  title_bar.innerHTML = title;
});
