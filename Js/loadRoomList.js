const socket = io("/loadRoomStream");
socket.emit('loadRoom', "");
socket.on('loadRoom', data => {
    JSON.parse(data).forEach(
        room => {
            let url;
            switch (room.room_type) {
                case "discussion_free":
                    url = "discussion.html";
                    break;
                case "normal":
                    url = "normalChatRoom.html";
                    break;
            }
            $('#roomList').prepend("<a href=" + url + "?roomName=" + room.room_name + "><h1><font color='red'>" + room.room_name + "</font></h1></a>");
        }
    );
});
