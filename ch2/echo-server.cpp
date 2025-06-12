
// Headers for MacOS
#include <unistd.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <netdb.h>

// Standard C++ headers
#include <iostream>
#include <string>
#include <thread>

const u_short LISTENING_PORT = 8080;

// Capitalizes the input recieved from client
// and returns the response to be sent back.
std::string make_echo_response(std::string input)
{
    std::string response(input);
    for (int i = 0; i < response.length(); i++)
    {
        response[i] = toupper(response[i]);
    }
    return response;
}

// The client connection is handled in a new thread.
// This is necessary in order to allow the server to
// continue to accept connections from other clients.
// While not necessary, this is almost always what servers
// do - they should normally be able to handle multiple
// simulusatneous connections.

void do_echo(int client_socket)
{
    std::cout << "A new client has connected." << std::endl;
    while (true)
    {
        char buffer[1024];
        std::string input;
        int bytes_read = read(client_socket, buffer, 1024);
        if (bytes_read <= 0)
        {
            std::cout << "Client has disconnected." << std::endl;
            break;
        }

        input = std::string(buffer, bytes_read);
        std::cout << "Received: " << input << std::endl;

        std::string response = make_echo_response(input);
        std::cout << "Sending: " << response << std::endl;

        // Send the message back to the client
        write(client_socket, response.c_str(), response.length());

        if (response == "QUIT")
        {
            std::cout << "QUIT command received. Closing connection." << std::endl;
            break;
        }
    }
    // Close the client socket
    close(client_socket);
}

int main()
{
    // Create the listening socket
    // This call creates a "file descriptor" for the socket we will listen
    // on for incoming connections.
    int listening_socket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);

    // Next we initialize a data structure that will be used to attach
    // the listening socket to the correct port number, along with some
    // other standard attributes.
    struct sockaddr_in ss;
    memset((char *)&ss, 0, sizeof(struct sockaddr_in));
    ss.sin_family = AF_INET;
    ss.sin_addr.s_addr = inet_addr("127.0.0.1"); // Just accept local connections
                                                 // Otherwise we need to deal with
                                                 // firewall/security issues -
                                                 // not needed for our little example!
    ss.sin_port = htons(LISTENING_PORT);         // port number

    // Now we bind the listening socket to the port number
    // Should check that bind returns 0, anything else indicates an
    // error (perhaps an inability to bind to the port number, etc.)
    bind(listening_socket, (struct sockaddr *)&ss, sizeof(struct sockaddr_in));

    // Now we tell the socket to listen for incoming connections.
    // The 100 is limiting the number of pending incoming connections
    // to 100. This is a common number, but could be different.
    // Should check that listen returns 0, anything else indicates an
    // error (perhaps the socket is not in the correct state, etc.)
    listen(listening_socket, 100);

    // At this point, the server is listening, a client can connect to it.
    // We will loop forever, accepting new connections as they come.
    std::cout << "Listening for incoming connections on port "
              << LISTENING_PORT << std::endl;
    while (true)
    {
        // Accept a new connection
        struct sockaddr_in client;
        socklen_t len = sizeof(struct sockaddr_in);

        // The accept call will block until a client connects. When a client connects,
        // the new socket connected to the client will be returned.  This is a different
        // socket than the listening socket - which remains in the listening state.
        int client_socket = accept(listening_socket, (struct sockaddr *)&client, &len);

        // Now we have a new socket connected to the client. We can handle this
        // connection in a new thread, so that the server can continue to accept
        // connections from other clients.
        std::thread echo_thread(do_echo, client_socket);
        echo_thread.detach();
    }
}
