/***************************************************
Node.js has a number of excellent modules built in.
Here we build on the http module by including:
 - url - helps us parse URLS
 - path - for building an working with file paths
 - fs - for working with the file system
****************************************************/
const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

/***************************************************
Based on the file extension, we'll serve the
appropriate mime type.  This isn't a perfect way
of doing things - but its good enough for now
****************************************************/
var mimeTypes = {
    html: "text/html",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    js: "text/javascript",
    css: "text/css",
    mp4: "video/mp4",
    ogv: "video/ogv",
};

// As before, we create an http server
http
    .createServer(function (req, res) {
        // we get just the path part of the URL
        const uri = url.parse(req.url).pathname;

        // join the path with the current working directory
        const filename = path.join(process.cwd(), unescape(uri));

        // The fs module's lstatSync function let's use query the
        // the operating system about a (potential) file.  Here we
        // really just want to know if it is an actual file.
        var stats;
        try {
            stats = fs.lstatSync(filename); // throws if path doesn't exist
        } catch (e) {
            console.log("\tResponse is 404, not found");
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Not Found\n");
            res.end();
            return;
        }

        if (stats.isFile()) {
            // path exists, is a file
            var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
            console.log("\tResponse is 200, serving file");
            res.writeHead(200, { "Content-Type": mimeType });

            var fileStream = fs.createReadStream(filename);
            // the pipe function is quite powerful - it
            // reads from the file stream and writes to the response
            // until the source stream is emptied.
            fileStream.pipe(res);
        } else if (stats.isDirectory()) {
            // path exists, is a directory
            // we could see if there is an index.html at this location
            // (try this as an exercise).  For now, do nothing... return
            // not found.
            console.log("\tResponse is 404, not found (directory)");
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Not Found\n");
            res.end();
        }
        // no need for an else here, lstatsSync would have failed if the
        // file/directory did not exist.
    })
    .listen(8080);
