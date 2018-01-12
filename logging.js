$('#left').click(function (e) {
    document.location.href = "dip.html?name=dipe";
});

$('#right').click(function (e) {
    document.location.href = "dip.html?name=dipe2";
});


var loc = document.location.href;
var paramItem = loc.split('=');
var socket = io("/" + paramItem[1]);
alert(paramItem[1]);

$('#ugo').click(function (e) {
    let ms = document.myf.com.value;
    let nm = document.myf.name.value;

    if (ms != "" && nm != "") {
        socket.emit('msg', nm + " > " + ms);
    }
    document.myf.com.value = "";
    alert(e);
});

/*
$('#odai').click(function(e) {
    let odai = document.myf.odai.value;
    if (odai != "") {
        socket.emit('dai', odai);
    }
    document.myf.word.value = "";
});*/


socket.on('msg', function (data) {
    data = commandFilter(data) + '<br><hr>';
    if (paramItem[1] == "dipe") {
        $('#chat_log').prepend(data);
    } else if (paramItem[1] == "dipe2") {
        $('#chat_log2').prepend(data);
    }
});

socket.on('dai',
    function (data) {
        $('#titlec').prepend(data);
    });
