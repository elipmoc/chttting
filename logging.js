$('#left').click(function(e){
  document.location.href="https://serene-fjord-98327.herokuapp.com/dip.html?name=dip1";
});

$('#right').click(function(e){
  document.location.href="https://serene-fjord-98327.herokuapp.com/dip.html?name=dip2";
});


var loc = document.location.href;
   var paramItem = loc.split('=');
var socket= io("/"+paramItem[1]);
alert(paramItem[1]);

$('#ugo').click(function(e) {
    var ms = document.myf.com.value;
    var nm = document.myf.name.value;
    if (ms != "" && nm != "") {
      socket.emit('msg',nm+ " > " + ms)
    } else {}
    document.myf.com.value = "";
    alert(e);
    //return false;
});



socket.on('msg', function(data) {
    switch (true) {
        case / > 931/.test(data):
            var d = data.replace(/931/g, "");
            data = $('<div/>').text(data).html();
            $('#chat_log').prepend(d + '<img src="https://pbs.twimg.com/profile_images/510615322307461120/o-vKGUzY_400x400.jpeg" width="100" height="100"><br><hr>');
            break;
        case /810/.test(data):
            break;

        default:
            data = $('<div/>').text(data).html();
            $('#chat_log').prepend(data + '<br><hr>');
            data = $('<div/>').text(data).html();
            $('#chat_log2').prepend(data + '<br><hr>');
            break;
    }
});
