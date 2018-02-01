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
      'complete': function() {
        $(this).remove();
        commentArrow.reset();
      },
      'easing': "linear"
    });
    this._y = (this._y + 40) % 460;
  }
}

const ms = document.myf.com.value;
let commentArrow = new CommentArrow();

$('#ugo').click(function(e) {
  if (ms != "") {
    chatConnection.sendData(ms);
    document.myf.com.value = "";

  }
});

$("#com").keydown((e) => {
  if (ms != "") {
    if (e.keyCode == 13) {
      chatConnection.sendData(ms);
      document.myf.com.value = "";
    }
  }
});


const chatConnection = new ChatConnection("syamu", msgDataAdd);
chatConnection.logSaveFlag = false;

//データをチャットメッセージとして追加する関数
function msgDataAdd(msgData) {
  let msg = commandFilter(msgData);
  commentArrow.create(msg);
}
