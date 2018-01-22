//左右に別れるためのロケーション
$('#left').click(function(e) {
    document.location.href = "dip.html?stance=debateLeft";
});
$('#right').click(function(e) {
    document.location.href = "dip.html?stance=debateRight";
});

//議題定義のソケット定義
let socket = io();
var loc = document.location.href;
var paramItem = loc.split('=');
var debateLeftConnection = new ChatConnection("dipe2", msgDataAdd);
const debateRightConnection = new ChatConnection("dipe",msgDataAdd);

function urlJage(param,callBack){
  if(loc.match(param)){
    callBack();
  }
}

$('#chat_send').click(function(e) {
    let ms = document.myf.com.value;
    let nm = document.myf.name.value;

    if (ms != "" && nm != "") {
        debateLeftConnection.sendData(
            JSON.stringify({
                "msg": nm + " > " + ms,
                //"dipeType": paramItem[1]
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
    if (loc.match("stance=debateLeft")) {
        $('#chat_log').prepend(msg);
    } else if (loc.match("stance=debateRight")) {
        $('#chat_log2').prepend(msg);
    }
}

function hogedip(){
$('#chat_log').prepend(msg);
}
urlJage("hogedip",hogedip());

$("#title_send").click(() => {
    let word = document.myf.title_word.value;
    socket.emit('titleSend', word);
});

socket.on('titleSend', (title) => {
    let title_bar = document.getElementById("titlec");
    title_bar.innerHTML = title;
});
