const urlLocation = document.location.href;
const urlParam = urlGetParamParse(urlLocation);

//議題定義のソケット定義
const chatConnection = new ChatConnection(decodeURIComponent(urlParam["roomName"]), msgDataAdd);

//左右に別れるためのロケーション
$('#left').click(() => {
    document.location.href = "discussion.html?stance=debateLeft&roomName=" + urlParam["roomName"];
});
$('#right').click(() => {
    document.location.href = "discussion.html?stance=debateRight&roomName=" + urlParam["roomName"];
});

$("#com").keydown((e) => {
    let ms = document.myf.com.value;
    let nm = document.myf.name.value;
    if (ms != "" && nm != "") {
        if (e.keyCode == 13) {
            chatConnection.sendData(
                JSON.stringify({
                    "msg": nm + " > " + ms,
                    "dipeType": urlParam["stance"],
                    "uname": nm
                })
            );
            document.myf.com.value = "";
        }
    }
});

$('#chat_send').click(() => {
    const ms = document.myf.com.value;
    const nm = document.myf.name.value;

    if (ms != "" && nm != "") {
        chatConnection.sendData(
            JSON.stringify({
                "msg": nm + " > " + ms,
                "dipeType": urlParam["stance"],
                "uname": nm
            })
        );
    }
    document.myf.com.value = "";
});

//urlParam["stance"] == "debateLeft"
//データをチャットメッセージとして追加する関数
function msgDataAdd(data) {
    console.log(data);
    data = JSON.parse(data);
    let msg = '<div style="border-top:1px #D5D8DC solid; margin-top:6px;margin-bottom:-12px;">' + commandFilter(data["msg"]) + '</div><br>';

    if (data["dipeType"] == "debateLeft") {
        $('#chat_log').prepend(msg);
        $('#left_name_area').prepend(data["uname"]);
    } else if (data["dipeType"] == "debateRight") {
        $('#chat_log2').prepend(msg);
        $('#right_name_area').prepend(data["uname"]);
    }
}

let title_list = new Array();

$("#title_send").click(() => {
    let word = document.myf.title_word.value;
    chatConnection.socket.emit('titleSend', word);
});

$("#title_send").click(()=>{
  const f = io("/aaa");
  f.emit();
  f.on("hoge",(data)=>{
    $("#titlec").text(data).html();
  });
});

chatConnection.socket.on('titleSend', (title) => {
    $("#titlec").text(title).html();
});

chatConnection.socket.emit('firstTitleSend', "");
chatConnection.socket.on('firstTitleSend', (data) => {
    $("#titlec").text(data).html();
});

function buttonReset() {
    $("#left").text("肯定").html();
    $("#right").text("否定").html();
}

function buttonChange() {
    $("#left").text("肯定に投票する").html();
    $("#right").text("否定に投票する").html();
}

chatConnection.socket.emit("initVoteFlag", "");

//投票状況を取得し、投票中ならbuttonを投票用に変更する
chatConnection.socket.on("initVoteFlag", (data) => {
    if (data) {
        buttonChange();
    }
});

//投票終了したらbutton元に戻す
chatConnection.socket.on("endVote", (data) => {
    buttonReset();
});

//投票の開始
chatConnection.socket.on("startVote", (data) => {
    buttonChange();
})
