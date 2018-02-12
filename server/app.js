const myRouter = require("./myRouter.js");
const roomCreate = require("./roomList.js");
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

let attract_title = "";
let attractList = new Array();
const attractNamespace = io.of("/attractConnection");

function attractWriteSocket() {
  attractNamespace.on("connection", (socket) => {
    socket.on("attractWrite", (attractWord) => {
      attractNamespace.emit("attractWrite", JSON.parse(attractWord));
      attractList.push(JSON.parse(attractWord));
      console.log(JSON.parse(attractWord));
    });
  });
}

function attractLoadSocket() {
  attractNamespace.on("connection", (socket) => {
    socket.on("attractLoad", () => {
      attractNamespace.emit("attractLoad", JSON.stringify(attractList));
    });
  });
}

//関数呼び出し
loadRoomSocket();
attractWriteSocket();
attractLoadSocket();
const roomCreateSocket = roomCreate.createRoomCreateSocket(io);

//ポート指定
const webPort = process.env.PORT || 3000;
//listen
http.listen(webPort);
