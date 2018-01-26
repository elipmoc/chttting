const firstSocket = io("/firstLoadStream");
const urlLocation = document.location.href;
const urlParam = urlGetParamParse(urlLocation);
firstSocket.emit('firstSend', "");
firstSocket.on('firstSend', (data) => {
  alert(data);
    data = JSON.parse(data);
    $("#titlec").text(data[urlParam["room_name"]]).html();
});
