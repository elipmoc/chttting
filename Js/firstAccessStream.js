const firstSocket = io("/firstLoadStream");
const urlLocation = document.location.href;
const urlParam = urlGetParamParse(urlLocation);
firstSocket.emit('firstSend', "");
firstSocket.on('firstSend', (data) => {
    data[urlParam["room_name"]];
    alert(data[urlParam["room_name"]]);
    $("#titlec").text(data[urlParam["room_name"]]).html();
});
