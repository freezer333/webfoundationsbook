const net = require('net');

const on_socket_connect = (socket) => {
  socket.on('data', (data) => {
    const request = data.toString();
    console.log(request);
  })
}

const server = net.createServer(on_socket_connect);
server.listen(8080, 'localhost');
