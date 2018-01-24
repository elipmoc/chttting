//議題定義のソケット定義
const socket = io();
const urlLocation = document.location.href;
const urlParam = urlGetParamParse(urlLocation);
const chatConnection = new ChatConnection(urlParam["roomName"], msgDataAdd);


//左右に別れるためのロケーション
$('#left').click(() => {
    document.location.href = "discussion.html?stance=debateLeft&roomName=" + urlParam["roomName"];
});
$('#right').click(() => {
    document.location.href = "discussion.html?stance=debateRight&roomName=" + urlParam["roomName"];
});

$('#chat_send').click(() => {
    let ms = document.myf.com.value;
    let nm = document.myf.name.value;

    if (ms != "" && nm != "") {
        chatConnection.sendData(
            JSON.stringify({
                "msg": nm + " > " + ms,
                "dipeType": urlParam["stance"]
            })
        );
    }
    document.myf.com.value = "";
});

//urlParam["stance"] == "debateLeft"
//データをチャットメッセージとして追加する関数
function msgDataAdd(data) {
    data = JSON.parse(data);
    console.log(data);
    let msg = '<div style="border-top:1px #D5D8DC solid; margin-top:-5px;">'+ commandFilter(data["msg"]) + '</div><br>';

    if (data["dipeType"] == "debateLeft") {
        $('#chat_log').prepend(msg);
    } else if (data["dipeType"] == "debateRight") {
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
