
// const apiPasser = require('./apiPasser');

notification = function (io) {
    var flagConnect = false;


    //Listening for connection client.
    io.sockets.on('connection', function (socket) {
      //console.log("kết nối thành công");
        socket.on('thongBao', (req) => {
          //console.log("ok");
            io.local.emit('test', req)
        })
    });
}

module.exports.notification = notification