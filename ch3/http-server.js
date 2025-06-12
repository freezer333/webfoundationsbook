const http = require('http');

const on_request = (req, res) => {
    if (req.url == '/') {
        const html = `
            <!DOCTYPE html><html><head><title>Sample Page</title></head>
            <body><h1>Hello World</h1><p>This is fun!</p></body></html>
          `
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html)
        res.end();
    }
    else if (req.url == '/about') {
        const text = `This is just about learning web development.`;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(text)
        res.end();
    }
    else {
        res.writeHead(404);
        res.end();
        return;
    }
}

const server = http.createServer(on_request);
server.listen(8080, 'localhost');

