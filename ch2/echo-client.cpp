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
using namespace std;

// Notice that this lines up with the listening
// port for the server.
const u_short SERVER_PORT = 8080;

int main()
{
    // Create the socket that will connect to the server.
    // sock is a "file descriptor".
    int sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);

    // Next we initialize a data structure that will be used
    // to connect to the server - it contains information about
    // which IP address and port number to connect to.
    struct sockaddr_in ss;
    memset((char *)&ss, 0, sizeof(ss));
    ss.sin_family = AF_INET;

    // This is the IP address of the server. For this simple example,
    // the server is running on the same machine as the client, so "localhost"
    // can be used.  If the server was elsewhere, we can use the same code, but
    // with the name of the machine (or IP address) replacing "localhost".
    struct hostent *sp; // struct to hold server's IP address
    sp = gethostbyname("localhost");
    memcpy(&ss.sin_addr, sp->h_addr, sp->h_length);

    // This is the port number of the server. This must match the port number
    // the server is listening on.
    ss.sin_port = htons(SERVER_PORT);

    // Now we connect to the server. This call will return when the connection
    // is established, or if it fails for some reason.
    int result = connect(sock, (struct sockaddr *)&ss, sizeof(ss));
    if (result != 0)
    {
        std::cerr << "Error connecting to server " << strerror(errno) << endl;
        return result;
    }

    while (true)
    {
        // We are connected (or write will fail below)
        int n;
        char buffer[1024];
        string echo_input;
        string echo_response;

        // Read a message from the user
        cout << "Enter a message: ";
        getline(cin, echo_input);

        // Send the message to the server, should always check
        // that n == echo_input.length() to ensure the entire message
        // was written...
        cout << "Sending: " << echo_input << endl;
        n = write(sock, echo_input.c_str(), echo_input.length());

        // Read the message from the server.  Should check if n < 0,
        // in case the read fails.
        n = read(sock, buffer, 1024);
        echo_response = string(buffer, n);
        cout << "Received: " << echo_response << endl;
        if (echo_response == "QUIT")
        {
            break;
        }
    }

    // Close the socket
    close(sock);
}
