
class CommentArrow {

    constructor() {
        this._y = 0;
    }

    create(msg) {
        let div = $("<div class = \"commentMove\">" + msg + "</div>");
        div.css("top", this._y);
        $("#videoArea").append(div);
        div.on('webkitAnimationEnd', function () {
            $(this).remove();
        });
        this._y = (this._y + 40) % 460;
    }
}

let commentArrow = new CommentArrow();

commentArrow.create("うんこ");
commentArrow.create("もりもり");
commentArrow.create("おいいいいいいいいいいいいいいいいいいいいいいいいいす！！！");
commentArrow.create('<img src="https://pbs.twimg.com/profile_images/510615322307461120/o-vKGUzY_400x400.jpeg" width="100" height="100">');

//var socket = io("/syamu");

$('#ugo').click(function (e) {
    var ms = document.myf.com.value;
    if (ms != "") {
        //socket.emit('msg', ms);
        msgConvert(ms);
    }
    document.myf.com.value = "";
});

//htmlのタグをエスケープする
function htmlEscape(htmlText) {
    return $('<div/>').text(htmlText).html();
}

function msgConvert(data) {
    switch (true) {
        case /931/.test(data):
            var d = data.replace(/931/g, "");
            d = htmlEscape(d);
            commentArrow.create
                (d + '<img src="https://pbs.twimg.com/profile_images/510615322307461120/o-vKGUzY_400x400.jpeg" width="100" height="100">');
            break;
        case /810/.test(data):
            break;

        default:
            data = htmlEscape(data);
            commentArrow.create(data);
            break;
    }
}
/*
socket.on('msg', function (data) {
    msgConvert(data);
});*/