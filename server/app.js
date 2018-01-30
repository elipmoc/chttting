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
      function(data) {
        socket.emit('loadRoom', JSON.stringify(roomCreate.getRoomList()));
      });
  });

}

let attract_title = "";

function attractWriteSocket() {
  const attractNamespace = io.of("/attractConnection");
  attractNamespace.on("connection", (socket) => {
    console.log('a user connected');
    socket.on("attractWrite", (attractWord) => {
      attractNamespace.emit("attractWrite", attractWord);
      console.log(attractWord);
      attract_title = attractWord;
    });
    socket.on("attractLoad", () => {
      attractNamespace.emit("attractLoad", attract_title);
    });
  });
}

/*function attractMainSocket() {
  const attractNamespace = io.of("/attractConnection");

}*/


//関数呼び出し
loadRoomSocket();
attractWriteSocket();
const firstAccessSocket = discussion.firstAccessSocket(io);
const roomCreateSocket = roomCreate.createRoomCreateSocket(io);

//ポート指定
const webPort = process.env.PORT || 3000;
//listen
http.listen(webPort);
