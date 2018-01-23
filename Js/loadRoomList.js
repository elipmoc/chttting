var socket = io("/loadRoomStream");
socket.emit('loadRoom', "");
socket.on('loadRoom', data => {
      JSON.parse(data).forEach(
            room => $('#roomList').prepend("<h1><font color='red'>" + room.room_name + "</font></h1>")
      );
});
