/* cookieの操作を楽にするための関数集*/

//すべてのクッキー情報を連想配列で取得
function get_all_cookie(){
    let list=document.cookie.split(";");
    let result={}
    for(var i=0;i<list.length;i++){
        var cookie=list[i].split("=");
        result[cookie[0].replace(/\s+/g,"")]=cookie[1]; 
    }
    return result;
}

//指定したキーのクッキーを得る
function get_cookie(key){
    let list=document.cookie.split(";");
    for(var i=0;i<list.length;i++){
        var cookie=list[i].split("=");
        if(cookie[0].replace(/\s+/g,"")==key){
            return cookie[1];
        }
    }
    return undefined;
}

//指定キーのクッキーを保存する
function save_cookie(key,value){
    document.cookie=key+"="+value;
}

//指定キーのクッキーを削除する
function delete_cookie(key){
    let date= new Date();
    date.setTime(date.getTime()-1);
    document.cookie=key+"=; expires="+date.toUTCString();
}