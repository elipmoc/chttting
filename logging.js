//左右に別れるためのロケーション
$('#left').click(function(e) {
    document.location.href = "dip.html?stance=debateLeft";
});
$('#right').click(function(e) {
    document.location.href = "dip.html?stance=debateRight";
});

//議題定義のソケット定義
const socket = io();
const urlLocation = document.location.href;
const debateLeftConnection = new ChatConnection("dipe2", msgDataAdd);
const debateRightConnection = new ChatConnection("dipe", msgDataAdd);
const urlParam = urlGetParamParse(urlLocation);
alert(urlParam["stance"]);



$('#chat_send').click(() => {
    let ms = document.myf.com.value;
    let nm = document.myf.name.value;

    if (ms != "" && nm != "") {
        if (urlParam["stance"] == "debateLeft") {
            debateLeftConnection.sendData(
                JSON.stringify({
                    "msg": nm + " > " + ms,
                    //"dipeType": paramItem[1]
                })
            );
        } else if (urlParam["stance"] == "debateRight") {
            debateRightConnection.sendData(
                JSON.stringify({
                    "msg": nm + " > " + ms,
                    //"dipeType": paramItem[1]
                })
            );
        }
    }
    document.myf.com.value = "";
});


//データをチャットメッセージとして追加する関数
function msgDataAdd(data) {
    data = JSON.parse(data);
    console.log(data);
    let msg = commandFilter(data["msg"]) + '<br><hr>';
    if (urlParam["stance"] == "debateLeft") {
        $('#chat_log').prepend(msg);
    } else if (urlParam["stance"] == "debateRight") {
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
