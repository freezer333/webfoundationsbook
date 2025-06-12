import socket

SERVER_PORT = 8080

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(('localhost', SERVER_PORT))
    while True:
        message = input('Enter a message: ')
        s.sendall(message.encode())
        print("Sending:  ", message)
        response = s.recv(1024).decode()
        print("Received:  ", response)
        if response == "QUIT":
            break
    s.close()

