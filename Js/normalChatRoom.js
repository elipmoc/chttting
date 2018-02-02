const loc = document.location.href;
const paramItem = loc.split('=');
const chatConnection = new ChatConnection(decodeURIComponent(paramItem[1]), msgDataAdd);

$("#com").keydown((e) => {
  let ms = document.myf.com.value;
  let nm = document.myf.name.value;
  if (ms != "" && nm != "") {
    chatConnection.setUserData(JSON.stringify({
      name: nm,
      dipeType: urlParam["stance"]
    }));
    if (e.keyCode == 13) {
      chatConnection.sendData(nm + " > " + ms);
      document.myf.com.value = "";
    }
  }
});

$('#sendButton').click((e) => {
  let ms = document.myf.com.value;
  let nm = document.myf.name.value;

  if (ms != "" && nm != "") {
    chatConnection.setUserData(JSON.stringify({
      name: nm,
      dipeType: urlParam["stance"]
    }));
    chatConnection.sendData(nm + " > " + ms);
  }
  document.myf.com.value = "";
});

//データをチャットメッセージとして追加する関数
function msgDataAdd(data) {
  let msg = commandFilter(data) + '<br><hr>';
  $('#chat_log').prepend(msg);
}
