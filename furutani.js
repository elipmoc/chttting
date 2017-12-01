
//非表示ユーザーIDリストのクッキー名
const h_uID_list_c_n="h_uID_list";

//クッキーから非表示ユーザーIDを配列で得る
function get_h_uID_list(){
    let cookie_list=document.cookie.split(";");
    for(var i=0;i<cookie_list.length;i++){
        var cookie=cookie_list[i].split("=");
        if(cookie[0].replace(/\s+/g,"")==h_uID_list_c_n){
            return cookie[1].split("&");
        }
    }
}

//非表示ユーザーIDの配列をクッキーに保存する
function save_h_uID_list(h_uID_list){
    let h_uID_str=h_uID_list_c_n+"=";
    if(h_uID_list.length>=1){
        h_uID_str+=h_uID_list[0];        
    
        for(var i=1;i<h_uID_list.length;i++){
            h_uID_str+="&"+h_uID_list[i];
        }
    document.cookie=h_uID_str;    
    }
}

//クッキーの非表示ユーザーIDリストの情報を削除する
function delete_h_uID_list(){
    let date= new Date();
    date.setTime(date.getTime()-1);
    document.cookie=h_uID_list_c_n+"=; expires="+date.toUTCString();
}

//クッキーの非表示ユーザーIDリストに新たなIDを追加する
function add_h_uID(id){
    let h_uID_list=get_h_uID_list();
    if(h_uID_list!=undefined){
        h_uID_list.push(id);
        save_h_uID_list(h_uID_list);
    }
    else
        save_h_uID_list([id]);
}


//クッキーの非表示ユーザーIDリストから任意のIDを削除する
function remove_h_uID(id){
    let h_uID_list=get_h_uID_list();
    if(h_uID_list!=undefined){
        h_uID_list.some(function(v, i){
            if (v==id) h_uID_list.splice(i,1);    
        });
        save_h_uID_list(h_uID_list);
    }
}
