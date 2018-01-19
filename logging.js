$('#left').click(function(e) {
    document.location.href = "dip.html?name=dipe";
});

$('#right').click(function(e) {
    document.location.href = "dip.html?name=dipe2";
});

var debate_socket = io("/debateStream");
var loc = document.location.href;
var paramItem = loc.split('=');
var chatConnection = new ChatConnection("dipe", msgDataAdd);
var debateTitleSend = new ChatConnection("debate_title", odai);

$('#ugo').click(function(e) {
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

$("#odai").click(function(e) {
    debateTitleSend.sendData(
        JSON.stringify({
            "dai": "<h2>" + document.myf.word.value + "</h2>";
        });
    );
});

/*
$('#odai').click(function(e) {
    let odai = document.myf.odai.value;
    if (odai != "") {
        socket.emit('dai', odai);
    }
    document.myf.word.value = "";
});*/

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

function odai(data){
  data = JSON.parse(data);
  $("#titlec").prepend(data);
}

/*
socket.on('dai',
    function (data) {
        $('#titlec').prepend(data);
    });
*/
