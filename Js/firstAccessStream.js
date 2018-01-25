const firstSocket = io("/firstLoadStream");
firstSocket.emit('firstSend', "");
firstSocket.on('firstSend', (data) => {
  $("#titlec").text(data).html();
});
