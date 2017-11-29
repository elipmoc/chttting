var Ws = require('ws').Server;
var wss = new ws({port:8080});
wss.on('connection',function(ws){
  ws.on('message',function(message){
    console.log("%s",message);
  });
  ws.send('someting');
});
