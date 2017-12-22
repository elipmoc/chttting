
//htmlのタグをエスケープする
function htmlEscape(htmlText) {
    return $('<div/>').text(htmlText).html();
}

//コマンドを読み取り実行結果を得る
function commandFilter(data) {
    switch (true) {
        case /931/.test(data):
            data = data.replace(/931/g, "");
            data = htmlEscape(data);
            return (data + '<img src="https://pbs.twimg.com/profile_images/510615322307461120/o-vKGUzY_400x400.jpeg" width="100" height="100">');
        case /810/.test(data):
            return "まだ実装されてないコマンドだよ";
        default:
            data = htmlEscape(data);
            return data;
    }
}