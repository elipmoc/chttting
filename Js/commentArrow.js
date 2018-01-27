
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
//var socket = io("/syamu");

$('#ugo').click(function (e) {
    var ms = document.myf.com.value;
    if (ms != "") {
        //socket.emit('msg', ms);
        commentArrow.create(commandFilter(ms));
    }
    document.myf.com.value = "";
});

$("#com").keydown((e) => {
    var ms = document.myf.com.value;
    if (ms != "") {
        commentArrow.create(commandFilter(ms));
    }
    document.myf.com.value = "";
});