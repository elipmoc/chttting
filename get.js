//URLのGETパラメータを連想配列で取得
function urlGetParamParse(url) {
    let splited = url.split("?");
    if (splited.length != 2)
        return {};
    splited = splited[1].split("&");

    //連想配列
    let paramList = {};

    //連想配列に詰めていく
    for (item of splited) {
        item = item.split("=");
        paramList[item[0]] = item[1];
    }
    return paramList;
}