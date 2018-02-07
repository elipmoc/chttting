const roomCreateSocket = io("/roomCreate");


roomCreateSocket.on('created', (errorMsg) => {
  if (errorMsg == "")
    document.location.href = "/";
  else
    $("#roomCreateError").prepend("<font color='red' size='3'>" + errorMsg + "</font>");
});


$('#roomType').change(() => {
  const roomType = $("#roomType").val();
  const description = $("#descText").val();
  console.log(roomType);
  if (roomType == "discussion_free") {
    console.log(roomType);
    var addVoteTimeSelecter = $("<select class='form-control' id='voteSelect'></select>");
    addVoteTimeSelecter.append("<option value='1800'>30分</option>");
    addVoteTimeSelecter.append("<option value='900'>15分</option>");
    addVoteTimeSelecter.append("<option value='300'>5分</option>");
    addVoteTimeSelecter.append("<option value='10'>test</option>");
    $("#voteTimeSelecter").append(addVoteTimeSelecter);
  }
});

$('#create_room').click(() => {
  const roomName = $("#roomName").val();
  const roomType = $("#roomType").val();
  const description = $("#descText").val();
  const voteTime = $("#voteSelect").val();
  let roomInfo;
  if (roomName == "" || roomType == "")
    return;
  console.log(roomName + ":" + roomType);
  if (roomType == "discussion_free") {
    roomInfo = {
      voteStartTime: voteTime,
      voteEndTime: 30
    };
  }
  roomCreateSocket.emit('create', JSON.stringify({
    "roomName": roomName,
    "roomType": roomType,
    "description": description,
    "roomInfo": roomInfo
  }));
});
