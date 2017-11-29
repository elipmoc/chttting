var Ws = require('ws').Server;
var wss = new Ws(process.env.PORT || 5000);
wss.on('connection',function(ws){
  ws.on('message',function(message){
    console.log("%s",message);
  });
  ws.send('someting');
});
