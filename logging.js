function aaa(){
  alert("show");
}

var socket = io();
$('form').submit(function() {
    var ms = document.myf.com.value;
    var nm = document.myf.name.value;
    if (ms != "" && nm != "") {
        socket.emit('msg', nm + " > " + ms);
    } else {}
    document.myf.com.value = "";
    return false;
});

socket.on('msg', function(data) {

    switch (true) {

        case / > .*931/.test(data):
            var d = data.replace(/931/g, "");
            data = $('<div/>').text(data).html();
            $('#chat_log').prepend(d + '<img src="https://pbs.twimg.com/profile_images/510615322307461120/o-vKGUzY_400x400.jpeg" width="100" height="100"><br><hr>');
        break;

        case / > .*810/.test(data):
            var d = data.replace(/810/g, "");
            data = $('<div/>').text(data).html();
            $('#chat_log').prepend(d + '<img src="http://image01.seesaawiki.jp/b/i/bbsenpai/e118b95c81b903db.jpg" width="100" height="100"><br><hr>');
        break;

        case / > .*<h1>/.test(data):
            var d = data.replace(/<h1>/g, "");
            var d = data.replace(/<h1>/g, "");
            data = $('<div/>').text(data).html();
            $('#chat_log').prepend('<h1>' + d + '</h1>');
        break;

        case / > .*:([0-9]|1[0-9])[c]/.test(data) :
            var r = /(1?[0-9])/g;
            var daice_res = r.exec(data);
            var d = data.replace(/:([0-9]|1[0-9])[c]/, "");
            var rand = Math.floor(Math.random () * parseInt(dice_res[1]))+1;
            data = $('<div/>').text(data).html();
            $('#chat_log').prepend(d+"Daice->"+rand+"<br><hr>");
        break;

        default :
            data = $('<div/>').text(data).html();
            $('#chat_log').prepend(data + '<br><hr>');
        break;
    }
});
