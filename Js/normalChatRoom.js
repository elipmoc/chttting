const loc = document.location.href;
const paramItem = loc.split('=');
const urlLocation = document.location.href;
const urlParam = urlGetParamParse(urlLocation);
const chatConnection = new ChatConnection(decodeURIComponent(paramItem[1]), msgDataAdd);

$("#com").keydown((e) => {
  let ms = document.myf.com.value;
  let nm = document.myf.name.value;
  if (ms != "" && nm != "") {
    chatConnection.setUserData(JSON.stringify({
      name: nm
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
      name: nm
    }));
    chatConnection.sendData(nm + " > " + ms);
  }
  document.myf.com.value = "";
});


chatConnection.socket.on("userListUpdate", (userListStr) => {
  $('#user_name_list').text(userListStr);
});


chatConnection.socket.on("userListUpdate", (userDataList) => {
  userDataList = JSON.parse(userDataList);
  let userNameList = "";
  userDataList.forEach(userData => {
    if (userData == undefined)
      return;
    console.log(userData);
    userData = JSON.parse(userData);
    const urlLocation = document.location.href;
    let name = userData.name == undefined ? "none" : userData.name;
      userNameList += " " + name + " ";
  });
  $('#user_name_list').text(userNameList);
});


function al(msg){
  return msg;
}




//データをチャットメッセージとして追加する関数
function msgDataAdd(data) {
  //let msg = commandImageView(data,'931','https://uds.gnst.jp/rest/img/sh42hbk60000/s_0029.jpg?t=1388170491') + '<br><hr>';
  let msg = commandFuncView(data,'114',al('aifie')) + '<br><hr>';
  $('#chat_log').prepend(msg);
}
