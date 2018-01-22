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
const connection = new ChatConnection("dipe", msgDataAdd);
const urlParam = urlGetParamParse(urlLocation);
alert(urlParam["stance"]);



$('#chat_send').click(() => {
    let ms = document.myf.com.value;
    let nm = document.myf.name.value;

    if (ms != "" && nm != "") {
        connection.sendData(
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
    let msg = commandFilter(data["msg"]) + '<br><hr>';

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
