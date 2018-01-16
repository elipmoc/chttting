$('#left').click(function (e) {
    document.location.href = "dip.html?name=dipe";
});

$('#right').click(function (e) {
    document.location.href = "dip.html?name=dipe2";
});


var loc = document.location.href;
var paramItem = loc.split('=');
var socket = io("/" + paramItem[1]);

//ログをサーバーに要求
socket.emit('initMsg', "");

$('#ugo').click(function (e) {
    let ms = document.myf.com.value;
    let nm = document.myf.name.value;

    if (ms != "" && nm != "") {
        socket.emit('msg',
            JSON.stringify(
                {
                    "msg": nm + " > " + ms,
                    "dipeType": paramItem[1]
                }
            )
        );
    }
    document.myf.com.value = "";
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

socket.on('initMsg', (dataListJson) => {
    JSON.parse(dataListJson).forEach(msgDataAdd);
});

socket.on('msg', msgDataAdd);

socket.on('dai',
    function (data) {
        $('#titlec').prepend(data);
    });
