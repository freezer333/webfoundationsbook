import java.net.*;
import java.io.*;

public class EchoClient {
    private Socket socket;
    private PrintWriter to_server;
    private BufferedReader from_server;

    public EchoClient(String server, int serverPort) throws IOException {
        this.socket = new Socket(server, serverPort);
        this.to_server = new PrintWriter(socket.getOutputStream(), true);
        this.from_server = new BufferedReader(new InputStreamReader(socket.getInputStream()));
    }

    public String send_and_receive(String message) {
        this.to_server.println(message);
        try {
            return this.from_server.readLine();
        } catch (IOException e) {
            return "Error: " + e;
        }
    }

    public void close() throws IOException {
        this.socket.close();
    }

    public static void main(String[] args) {
        try {
            EchoClient client = new EchoClient("localhost", 8080);
            while (true) {
                System.out.print("Enter a message: ");
                String input = System.console().readLine();

                // input has a new line at the end, we are going to send it,
                // so the server sends it back - enabling client to
                // use readLine when reading the response from the socket too.
                // This is just to keep things simple, we could implement the client
                // a little differently to handle the new lines - it's not a language
                // issue, just a Java convention/default issue.
                String response = client.send_and_receive(input);
                System.out.println("Received:  " + response);

                if (response.equals("QUIT")) {
                    client.close();
                    break;
                }
            }
        } catch (IOException e) {
            System.out.println("Error: " + e);
        }
    }
}