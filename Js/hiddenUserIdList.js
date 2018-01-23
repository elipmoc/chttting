//非表示ユーザーIDリストのクッキー名
const h_uID_list_c_n="h_uID_list";

//クッキーから非表示ユーザーIDを配列で得る
function get_h_uID_list(){
    let result=get_cookie(h_uID_list_c_n);
    if(result!=undefined)
        return result.split("&");
    return undefined;
}

//非表示ユーザーIDの配列をクッキーに保存する
function save_h_uID_list(h_uID_list){
    let value="";
    if(h_uID_list.length>=1){
        value+=h_uID_list[0];        
        for(var i=1;i<h_uID_list.length;i++)
            value+="&"+h_uID_list[i];
        save_cookie(h_uID_list_c_n,value);    
    }
}

//クッキーの非表示ユーザーIDリストの情報を削除する
function delete_h_uID_list(){
    delete_cookie(h_uID_list_c_n);
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
