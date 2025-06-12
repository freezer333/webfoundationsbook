// The net package comes with the Node.js JavaScript environment, 
// it exposes the same type of functionality as the API calls used 
// in C++ and C implementations - just wrapped in a more convenient
// JavaScript interface.
const net = require('net');
// This is also part of Node.js, it provides a simple way to read
// from the terminal, like the C++ iostream library.
const readline = require('readline');

// Notice that this lines up with the listening
// port for the server.
const SERVER_PORT = 8080;


// This just sets up node to read some lines from the terminal/console
const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// This is a callback function.  Whenever a user types anything on stdin, 
// and hits return, this anonymous function gets called with the text
// that was entered.  The text is sent to the socket.

// We'll cover callbacks later in depth - but for now, just know 
// this is a function that gets called when a user types something. It's 
// not getting called "now", or just once - it gets called whenever a line
// of text is entered.
terminal.on('line', function (text) {
    console.log("Sending: " + text);
    client.write(text);
});


// Now we create a client socket, which will connect to the server.
const client = new net.Socket();
client.connect(SERVER_PORT, "localhost", function () {
    // Much like terminal.on('line', ...), this is a callback function, 
    // the function gets called when the client successfully connects to 
    // the server.  This takes some time, the TCP handshake has to happen.  
    // So the "connect" function starts the process, and when the connection
    // process is done, this function gets called.

    // We just prompt the user to type something in and when they do, the 
    // terminal.on('line', ...) function above will get called.
    console.log("Enter a message:  ");
});

// And another callback - this time for when data is recieved on the socket.
// This is the server's response to the message we sent.
// We quit if it's time to, otherwise we prompt the user again.
client.on('data', function (data) {
    console.log('Server Response: ' + data);
    if (data == "QUIT") {
        // This closes the socket
        client.destroy();
        // This shuts down our access to the terminal.
        terminal.close();
        // And now we can just exit the program.
        process.exit(0);
    } else {
        console.log("Enter a message:  ");
    }
});
