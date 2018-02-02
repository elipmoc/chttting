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

function setMovieURL(url) {
  //"https://www.youtube.com/embed/Iag55pIKWzI?rel=0&start=0&end=5&modestbranding=0&showinfo=0&fs=0&controls=0&autoplay=1&loop=1&playlist=Iag55pIKWzI"
  let v = urlGetParamParse(url)["v"];
  if (v) {
    url = "https://www.youtube.com/embed/" + v + "?rel=0&start=0&end=5&modestbranding=0&showinfo=0&fs=0&controls=0&autoplay=1&loop=1&playlist=" + v;
    $("#iframe").attr("src", url);
  }
}

setMovieURL("https://www.youtube.com/watch?v=8Rc2aH46Ubg");

//データをチャットメッセージとして追加する関数
function msgDataAdd(msgData) {
  let msg = commandFilter(msgData);
  commentArrow.create(msg);
}
