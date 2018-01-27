
//htmlのタグをエスケープする
function htmlEscape(htmlText) {
    return $('<div/>').text(htmlText).html();
}

//hscalcライブラリのロード
hscalc.load();

//コマンドを読み取り実行結果を得る
function commandFilter(data) {
    switch (true) {
        case /931/.test(data):
            data = data.replace(/931/g, "");
            data = htmlEscape(data);
            return (data + '<img src="https://pbs.twimg.com/profile_images/510615322307461120/o-vKGUzY_400x400.jpeg" width="100" height="100">');
        case /810/.test(data):
            return "まだ実装されてないコマンドだよ";
        case /hscalc/.test(data):
            data = htmlEscape(data);
            let userName = data.replace(/hscalc.*/g, "");
            let msg = data.replace(/.*hscalc/g, "");
            return userName + msg;
            let lexerRet = hscalc.lexer(msg);
            if (lexerRet.errorFlag) {
                return userName + "トークンエラー";
            }
            let parser = new hscalc.Parser(lexerRet.tokenList);
            return parser.doParse();


        default:
            data = htmlEscape(data);
            return data;
    }
}


function url_filter(data) {

}