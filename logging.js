$('#left').click(function(e){
  document.location.href="https://serene-fjord-98327.herokuapp.com/dip.html?name=dipe";
});

$('#right').click(function(e){
  document.location.href="https://serene-fjord-98327.herokuapp.com/dip.html?name=dipe2";
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





window.requestAnimationFrame =
window.requestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(cb) {setTimeout(cb, 17);};

var canvas = document.getElementById( "canvas" );
var ctx = canvas.getContext( "2d" );//ctxはContextの略語
var NUM = 20;
var particles = [];

canvas.width = canvas.height = 500

for(var i = 0; i < NUM; i++) {
var positionx =  Math.random()*500; // x座標を0-500の間でランダム設定
var positiony =  -10; // y座標を-10に設定
particle = new Particle(ctx, positionx, positiony);//新しいオブジェクトを作成
particles.push( particle );//Particlesの最後にParticleを追加
}

function Particle(ctx, x, y) {
this.ctx = ctx;
this.x = x ;
this.y = y ;
this.radius = 150;
// 速度のオブジェクトv
this.v = {
  x: Math.random()*0.5, // x方向の速度
  y: Math.random()*1 // y方向の速度
};
}

Particle.prototype.render = function(){
this.updatePosition();
this.wrapPosition(); // 範囲外に消えた点を範囲内に戻す
this.draw();
}

Particle.prototype.draw = function(){
// 描画

ctx = this.ctx;
ctx.beginPath();
ctx.fillStyle = this.gradient();
ctx.arc( this.x, this.y, 4, 0, Math.PI * 2, false ); // 位置指定
ctx.fill();
ctx.closePath();


}

Particle.prototype.updatePosition = function() {
// 3. 位置をずらす
this.x += this.v.x;
this.y += this.v.y;
}

Particle.prototype.wrapPosition = function(){
if(this.x < 0 ) this.x = 500;
if(this.x > 500 ) this.x = 0;
if(this.y > 500 ) this.y = 0;
}

Particle.prototype.gradient = function(){
var col = "255, 255, 255";
var g = this.ctx.createRadialGradient( this.x, this.y, 0, this.x, this.y, 10)
g.addColorStop(0,   "rgba(" + col + ", 1)")
g.addColorStop(0.5, "rgba(" + col + ", 0.2)")
g.addColorStop(1,   "rgba(" + col + ", 0)")
return g
}

// 1.図形を描画
// 描画サイクルを開始する
onload = function() {
render();
};
function render() {
// 2.一度消去
ctx.clearRect(0,0,canvas.width,canvas.height); // 前回までの描画を消去

particles.forEach(function(e){ e.render(); });
// 描画モードを比較明に
ctx.globalCompositeOperation = "lighter";
// 5.一定間隔をおく
// requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
requestAnimationFrame( render );
}






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
