
var loc = document.location.href;
var paramItem = loc.split('=');
var chatConnection = new ChatConnection(paramItem[1], msgDataAdd);

$('#sendButton').click(function (e) {
    let ms = document.myf.com.value;
    let nm = document.myf.name.value;

    if (ms != "" && nm != "") {
        chatConnection.sendData(nm + " > " + ms);
    }
    document.myf.com.value = "";
});

//データをチャットメッセージとして追加する関数
function msgDataAdd(data) {
    let msg = commandFilter(data) + '<br><hr>';
    $('#chat_log').prepend(msg);

}