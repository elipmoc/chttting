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
            $('#card-list').prepend('<div class="card text-center"><div class="card-block"><h4 class="card-title">'+room.room_name+'</h4><p class="card-text">Description<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p></p><button class="btn btn-primary" onclick="location.href=' + url + '?roomName=' + encodeURIComponent(room.room_name) + '"><font size="3">' + room.room_name + '</font></button>');
        }
    );
});
