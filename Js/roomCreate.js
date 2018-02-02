const roomCreateSocket = io("/roomCreate");
roomCreateSocket.on('created', (errorMsg) => {
  if (errorMsg == "")
    document.location.href = "/";
  else
    $("#roomCreateError").prepend("<font color='red' size='3'>" + errorMsg + "</font>");
});

$('#create_room').click(() => {
  let roomName = $("#roomName").val();
  let roomType = $("#roomType").val();
  let description = $("#descText").val();
  let roomInfo;
  if (roomName == "" || roomType == "")
    return;
  console.log(roomName + ":" + roomType);
  if (roomType == "discussion_free") {
    roomInfo = {
      voteStartTime: 900,
      voteEndTime: 15
    };
  }
  roomCreateSocket.emit('create', JSON.stringify({
    "roomName": roomName,
    "roomType": roomType,
    "description": description,
    "roomInfo": roomInfo
  }));
});
