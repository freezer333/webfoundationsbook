#include <iostream>
#include <cstring>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <arpa/inet.h>

void resolve_hostname(const std::string &hostname)
{
    struct addrinfo hints, *res, *p;
    int status;

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_UNSPEC;     // AF_UNSPEC means IPv4 or IPv6
    hints.ai_socktype = SOCK_STREAM; // TCP, although isn't really necessary

    // Perform the DNS lookup
    if ((status = getaddrinfo(hostname.c_str(), NULL, &hints, &res)) != 0)
    {
        std::cerr << "getaddrinfo error: " << gai_strerror(status) << std::endl;
        return;
    }

    // The result (res) is a linked list.  There may be several resolutions listed,
    // most commonly because you might have both IPv4 and IPv6 addresses.

    std::cout << "IP addresses for " << hostname << ":" << std::endl;
    for (p = res; p != NULL; p = p->ai_next)
    {
        void *addr;
        std::string ipstr;

        if (p->ai_family == AF_INET)
        { // IPv4
            struct sockaddr_in *ipv4 = (struct sockaddr_in *)p->ai_addr;
            addr = &(ipv4->sin_addr);
            char ip[INET_ADDRSTRLEN];
            inet_ntop(p->ai_family, addr, ip, sizeof ip);
            ipstr = ip;
        }
        else if (p->ai_family == AF_INET6)
        { // IPv6
            struct sockaddr_in6 *ipv6 = (struct sockaddr_in6 *)p->ai_addr;
            addr = &(ipv6->sin6_addr);
            char ip[INET6_ADDRSTRLEN];
            inet_ntop(p->ai_family, addr, ip, sizeof ip);
            ipstr = ip;
        }
        else
        {
            continue;
        }

        // Here's the IP address, in this case we 
        // are just printing it.
        std::cout << "  " << ipstr << std::endl;
    }

    // Free the linked list
    freeaddrinfo(res);
}

int main()
{
    std::string hostname = "www.example.com";
    resolve_hostname(hostname);
    return 0;
}
