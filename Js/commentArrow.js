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

let videoId = "";

$('#sendButton').click(function (e) {
  let ms = document.myf.com.value;
  if (ms != "") {
    chatConnection.sendData(JSON.stringify(ms));
    document.myf.com.value = "";
  }
});

$("#com").keydown((e) => {
  let ms = document.myf.com.value;
  if (ms != "") {
    if (e.keyCode == 13) {
      chatConnection.sendData(JSON.stringify(ms));
      document.myf.com.value = "";
    }
  }
});

const urlParam = urlGetParamParse(document.location.href);
const chatConnection = new ChatConnection(urlParam["roomName"], msgDataAdd);
chatConnection.logSaveFlag = false;

chatConnection.socket.on("videoIdSend", (videoId) => {
  setMovieURL(videoId);
});

chatConnection.socket.on("fixSeek", (seek) => {
  youtubePlayer.setSeek(seek);
});



function setMovieURL(_videoId) {
  videoId = _videoId;
  youtubePlayer.changeUrl(videoId);
}

$("#sendUrl").click(e => {
  const videoId = urlGetParamParse($("#urlText").val()).v;
  if (videoId) {
    chatConnection.socket.emit("videoIdSend", videoId);
  }
});

chatConnection.socket.emit("initVideoId");
const commandFilter = new CommandFilter();
//データをチャットメッセージとして追加する関数
function msgDataAdd(msgData) {
  let msg = commandFilter.doCommandFilter(JSON.parse(msgData));
  commentArrow.create(msg);
}

class YoutubePlayer {

  constructor() {
    this._player = null;
    this._videoId;
    this._readyFlag = false;
  }

  setSeek(seek) {
    if (this._readyFlag) {
      console.log(this._player.getCurrentTime());
      if (Math.abs(this._player.getCurrentTime() - seek) > 1) {
        this._player.seekTo(seek, true);
      }
    }
  }

  changeUrl(videoId) {
    this._videoId = videoId;
    if (this._readyFlag)
      this._player.loadVideoById(videoId);
  }

  createPlayer(videoId) {
    const onPlayerReady = (event) => {
      event.target.loadVideoById(this._videoId);
      event.target.playVideo();
      this._readyFlag = true;
    };
    this._player = new YT.Player('iframe', {
      height: '500',
      width: '100%',
      videoId: videoId,
      playerVars: {
        controls: 0, // コントロールバーを表示しない
        showinfo: 0, // 動画情報を表示しない
        modestbranding: 1,
        fs: 0,
        showinfo: 0,
        rel: 0
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': this.onPlayerStateChange
      }
    });
  }
  onPlayerStateChange(event) { }
}

let youtubePlayer = new YoutubePlayer();
//youtube apiが準備し終わった時に呼ばれる関数
function onYouTubeIframeAPIReady() {
  console.log("createPlayer");
  youtubePlayer.createPlayer(videoId);
}

