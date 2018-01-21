$('#left').click(function(e) {
  document.location.href = "dip.html?name=dipe";
});

$('#right').click(function(e) {
  document.location.href = "dip.html?name=dipe2";
});

<<<<<<< HEAD
//socket.emit('debate_title', "");
//var debate_socket = io("/debateStream");
var loc = document.location.href;
var paramItem = loc.split('=');
var chatConnection = new ChatConnection("dipe", msgDataAdd);
//var debateTitleSend = new ChatConnection("debate_title", odai);
=======
let socket = io();
var loc = document.location.href;
var paramItem = loc.split('=');
var chatConnection = new ChatConnection("dipe", msgDataAdd);
>>>>>>> 2b0b764605e042dfdcec3836f769a736d2e040b6

$('#chat_send').click(function(e) {
  let ms = document.myf.com.value;
  let nm = document.myf.name.value;

<<<<<<< HEAD
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

$("#odai").click(function(e) {
    debateTitleSend.sendData(
        JSON.stringify({
            "dai": "<h2>" + document.myf.word.value + "</h2>"
        })
=======
  if (ms != "" && nm != "") {
    chatConnection.sendData(
      JSON.stringify({
        "msg": nm + " > " + ms,
        "dipeType": paramItem[1]
      })
>>>>>>> 2b0b764605e042dfdcec3836f769a736d2e040b6
    );
  }
  document.myf.com.value = "";
});


//データをチャットメッセージとして追加する関数
function msgDataAdd(data) {
<<<<<<< HEAD
    data = JSON.parse(data);
    console.log(data);
    let msg = commandFilter(data["msg"]) + '<br><hr>';
    if (data["dipeType"] == "dipe") {
        $('#chat_log').prepend(msg);
    } else if (data["dipeType"] == "dipe2") {
        $('#chat_log2').prepend(msg);
    }
}
/*
function odai(data){
=======
>>>>>>> 2b0b764605e042dfdcec3836f769a736d2e040b6
  data = JSON.parse(data);
  console.log(data);
  let msg = commandFilter(data["msg"]) + '<br><hr>';
  if (data["dipeType"] == "dipe") {
    $('#chat_log').prepend(msg);
  } else if (data["dipeType"] == "dipe2") {
    $('#chat_log2').prepend(msg);
  }
}
<<<<<<< HEAD
*/
/*
socket.on('dai',
    function (data) {
        $('#titlec').prepend(data);
    });
*/
=======

$("#title_send").click(() => {
  let word = document.myf.title_word.value;
  socket.emit('titleSend', word);
});

socket.on('titleSend', (title) => {
  let title_bar = document.getElementById("titlec");
  title_bar.innerHTML = title;
});
>>>>>>> 2b0b764605e042dfdcec3836f769a736d2e040b6
