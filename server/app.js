const myRouter = require("./myRouter.js");
const roomCreate = require("./roomList.js");
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

let debate_title = {};
let attract_title = {};
//議題を定義するためのソケットを定義
function debateTitleSocket() {
  io.on("connection", (socket) => {
    socket.on("titleSend", (title) => {
      let title_data = JSON.parse(title);
      socket.emit("titleSend", title_data["debate_title"]);
      debate_title[title_data["room_name"]] = title_data["debate_title"];
    });
  });
}


function attractWriteSocket() {
  const attractNamespace = io.of("/attractConnection");
  attractNamespace.on("connection", (socket) => {
    socket.on("attractWrite", (attractWord) => {
      socket.emit("attractWrite", attractWord);
    });
  });
}


function firstAccessSocket() {
  const firstStream = io.of("/firstLoadStream");
  firstStream.on("connection", (socket) => {
    socket.on("firstSend", (data) => {
      socket.emit("firstSend", JSON.stringify(debate_title));
    });
  });
}


//関数呼び出し
debateTitleSocket();
loadRoomSocket();
firstAccessSocket();
const roomCreateSocket = roomCreate.createRoomCreateSocket(io);

//ポート指定
const webPort = process.env.PORT || 3000;
//listen
http.listen(webPort);
