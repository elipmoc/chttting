
function strWidth(str) {
    var e = $("#ruler");
    var width = e.text(str).get(0).offsetWidth;
    e.empty();
    return width;
}

class CommentArrow {

    constructor() {
        this._y = 0;
        this._yArray = new Array();
    }

    reset() {
        this._y = this._yArray[0];
        this._yArray.shift();
    }

    create(msg) {
        let div = $("<div class = \"commentMove\">" + msg + "</div>");
        div.css("top", this._y);
        this._yArray.push(this._y);
        $("#videoArea").append(div);
        let commentArrow = this;
        div.animate({
            'left': -strWidth(msg) + "px"
        }, {
                'duration': 3000,
                'complete': function () {
                    $(this).remove();
                    commentArrow.reset();
                },
                'easing': "linear"
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
        commentArrow.create(commandFilter(ms));
    }
    document.myf.com.value = "";
});

/*
socket.on('msg', function (data) {
    msgConvert(data);
});*/

setInterval(() => {
    commentArrow.create("野獣先輩");
}, 1);