const myRouter = require("./myRouter.js");
const roomCreate = require("./roomList.js");
const discussion = require("./discussionSocket.js");
const {
  Client
} = require('pg');

const escape = require('escape-html');

const http = require('http').createServer(
  myRouter.createRouter()
);
const io = require('socket.io')(http);

//ルーム一覧を表示するソケットを定義
function loadRoomSocket() {
  const namespace = io.of("/loadRoomStream");
  namespace.on('connection', socket => {
    socket.on(
      'loadRoom',
      function (data) {
        socket.emit('loadRoom', JSON.stringify(roomCreate.getRoomList()));
      });
  });

}

let attract_title = {};

function attractWriteSocket() {
  const attractNamespace = io.of("/attractConnection");
  attractNamespace.on("connection", (socket) => {
    socket.on("attractWrite", (attractWord) => {
      socket.emit("attractWrite", attractWord);
    });
  });
}


//関数呼び出し
loadRoomSocket();
const firstAccessSocket = discussion.firstAccessSocket(io);
const roomCreateSocket = roomCreate.createRoomCreateSocket(io);

//ポート指定
const webPort = process.env.PORT || 3000;
//listen
http.listen(webPort);
