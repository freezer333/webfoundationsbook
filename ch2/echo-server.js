// The net package comes with the Node.js JavaScript environment, 
// it exposes the same type of functionality as the API calls used 
// in C++ and C implementations - just wrapped in a more convenient
// JavaScript interface.
const net = require('net');

const LISTENING_PORT = 8080;

// The concept of "server" is so universal, that much of the functionality
// is built right into the Node.js "createServer" function.  This function call
// creates a socket - we are just providing a function that will be called 
// (a callback) when a new client connects to the server.
const server = net.createServer(function (socket) {
    // A new socket is created for each client that connects, 
    // and many clients can connect - this function will be called
    // with a different "client" socket for any client that connects.

    console.log("A new client has connected.");

    // Now we just add a callback to implemenent the echo protocol for
    // the connected client - by looking at what the client sends is.
    socket.on('data', function (data) {
        const input = data.toString('utf8');
        console.log("Received:  ", input);

        response = input.toUpperCase();
        console.log("Sending:  " + response);
        socket.write(response);
        if (response == "QUIT") {
            console.log("QUIT command received. Closing connection.");
            socket.destroy();
        }
        // otherwise just let the socket be, more data should come our way...
    });
    socket.on('close', function () {
        console.log("Client has disconnected.");
    });
});

// The last little bit is to tell the server to start listening - on port 8080
// Now any client can connect.
console.log("Listening for incoming connections on port ", LISTENING_PORT);
server.listen(LISTENING_PORT);
