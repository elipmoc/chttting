function strWidth(str) {
  let e = $("#ruler");
  let width = e.text(str).get(0).offsetWidth;
  e.empty();
  return width;
}

class CommentArrow {
  constructor() {
    this._y = 0;
    this._yArray = new Array();
  }

  reset() {
    this._y = this._yArray[0];
    this._yArray.shift();
  }

  create(msg) {
    let div = $("<div class = \"commentMove\">" + msg + "</div>");
    div.css("top", this._y);
    this._yArray.push(this._y);
    $("#videoArea").append(div);
    let commentArrow = this;
    div.animate({
      'left': -strWidth(msg) + "px"
    }, {
        'duration': 3000,
        'complete': function () {
          $(this).remove();
          commentArrow.reset();
        },
        'easing': "linear"
      });
    this._y = (this._y + 40) % 460;
  }
}

let commentArrow = new CommentArrow();

$('#sendButton').click(function (e) {
  let ms = document.myf.com.value;
  if (ms != "") {
    chatConnection.sendData(ms);
    document.myf.com.value = "";

  }
});

$("#com").keydown((e) => {
  let ms = document.myf.com.value;
  if (ms != "") {
    if (e.keyCode == 13) {
      chatConnection.sendData(ms);
      document.myf.com.value = "";
    }
  }
});

const urlParam = urlGetParamParse(document.location.href);
const chatConnection = new ChatConnection(urlParam["roomName"], msgDataAdd);
chatConnection.logSaveFlag = false;

//データをチャットメッセージとして追加する関数
function msgDataAdd(msgData) {
  let msg = commandFilter(msgData);
  commentArrow.create(msg);
}
