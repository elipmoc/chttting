var Ws = require('ws').Server;
var wss = new ws({port:80});
wss.on('connection',function(ws){
  ws.on('message',function(message){
    console.log("%s",message);
  });
  ws.send('someting');
});
