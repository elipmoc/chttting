const urlLocation = document.location.href;
const urlParam = urlGetParamParse(urlLocation);

//議題定義のソケット定義
const chatConnection = new ChatConnection(decodeURIComponent(urlParam["roomName"]), msgDataAdd);

let voteFlag = false;

//左右に別れるためのロケーション
$('#left').click(() => {
  if (voteFlag == false)
    document.location.href = "discussion.html?stance=debateLeft&roomName=" + urlParam["roomName"];
  else
    chatConnection.socket.emit("vote", "left");
});
$('#right').click(() => {
  if (voteFlag == false)
    document.location.href = "discussion.html?stance=debateRight&roomName=" + urlParam["roomName"];
  else
    chatConnection.socket.emit("vote", "right");
});

$("#com").keydown((e) => {
  let ms = document.myf.com.value;
  let nm = document.myf.name.value;
  if (ms != "" && nm != "") {
    if (e.keyCode == 13) {
      chatConnection.setUserData(nm);
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
    chatConnection.setUserData(nm);
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
    // $('#left_name_area').prepend(data["uname"]);
  } else if (data["dipeType"] == "debateRight") {
    $('#chat_log2').prepend(msg);
    // $('#right_name_area').prepend(data["uname"]);
  }
}


let title_list = new Array();

$("#title_send").click(() => {
  let word = document.myf.title_word.value;
  chatConnection.socket.emit('titleSend', word);
});




chatConnection.socket.on('titleSend', (titleData) => {
  $("#titlec").text(titleData).html();
});

chatConnection.socket.on("userListUpdate", (userDataList) => {
  userDataList = JSON.parse(userDataList);
  let str = "参加者:";
  userDataList.forEach(name => { str += "[" + name + "]" });
  $('#left_name_area').text(str);
});

chatConnection.socket.emit('firstTitleSend', "");
chatConnection.socket.on('firstTitleSend', (titleData) => {
  $("#titlec").text(titleData).html();
});


function unsetVoteMode() {
  voteFlag = false;
  $("#left").text("肯定").html();
  $("#right").text("否定").html();
  $("#countDown").text("");
}

function setVoteMode() {
  voteFlag = true;
  $("#left").text("肯定に投票する").html();
  $("#right").text("否定に投票する").html();
}

chatConnection.socket.emit("initVoteFlag", "");

//投票までの時間をカウントダウンする
chatConnection.socket.on("startVoteSecond", (second) => {
  $("#countDown").text("投票まで残り" + second + "秒");
});

//投票終了までの時間をカウントダウンする
chatConnection.socket.on("endVoteSecond", (second) => {
  $("#countDown").text("投票終了まで残り" + second + "秒");
});

//投票状況を取得し、投票中ならbuttonを投票用に変更する
chatConnection.socket.on("initVoteFlag", (VoteFlagData) => {
  if (VoteFlagData) {
    setVoteMode();
  }
});

//投票終了したらbutton元に戻す
chatConnection.socket.on("endVote", (data) => {
  unsetVoteMode();
});

//投票の開始
chatConnection.socket.on("startVote", (data) => {
  setVoteMode();
});
