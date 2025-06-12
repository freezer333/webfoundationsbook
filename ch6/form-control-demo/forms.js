// This is a templating library used to 
// generate HTML responses, you need to install it - 
// make sure you do an "npm install" before running
// this program!
const ejs = require('ejs');

const http = require("http");
const url = require('url');
const qs = require('querystring');
const fs = require('fs');



const serve = (req, res) => {
    console.log("Host name:     " + req.headers.host);
    console.log("Connection:    " + req.headers.connection);
    console.log("Accept:        " + req.headers.accept);
    console.log("URL:           " + req.url);
    if (req.url == "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.readFile('forms.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("File not found");
            } else {
                res.end(data);
            }
        });
    } else if (req.url == "/data") {
        if (req.method == 'POST') {
            process_post(req, res);
        }
        else {
            process_get(req, res);
        }
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("No Page Found");
    }
}

const process_post = (req, res) => {
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        const post = qs.parse(body);
        ejs.renderFile("forms.ejs", { method: 'post', data: post },
            function (err, response) {
                if (err) {
                    console.error(err);
                    res.end("error");
                } else {
                    res.end(response);
                }
            });

    });
}

const process_get = (req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;

    ejs.renderFile("forms.ejs", { method: 'get', data: query },
        function (err, response) {
            if (err) {
                console.error(err);
                res.end("error");
            } else {
                res.end(response);
            }
        });


    res.end(response);
}


http.createServer(serve).listen(8080);