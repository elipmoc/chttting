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
                case "official_debate":
                    url = "officialDebate.html";
                    break;
                case "normal":
                    url = "normalChatRoom.html";
                    break;
                case "movie":
                    url = "syamu.html";
                    break;
            }
            $('#card-list').prepend('<div class="card text-center"><div class="card-block"><h4 class="card-title">' + room.room_name + '</h4><p class="card-text">' + room.description + '</p><a class="btn btn-info" href="' + url + '?roomName=' + encodeURIComponent(room.room_name) + '"><font size="3">入室</font></a></div></div>');
        }
    );
});
