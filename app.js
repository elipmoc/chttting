var html = require('fs').readFileSync('index.html');
var http = require('http').createServer(
    function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
});
var io = require('socket.io')(http);
var webPort = process.env.PORT || 3000;
http.listen(webPort);
io.on(
    'connection',
    function (socket) {
        socket.on(
            'msg',
            function (data) {
              if(data == "810")
              {
                var yj = '<img src="http://810.jpg">'
                io.emit('msg',yj);
              }else {
                io.emit('msg', data);
              }

            }
        );
    }
);
