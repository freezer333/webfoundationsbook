const http = require('http');

const heading = () => {
    const html = `
        <!doctype html>
          <html>
            <head>
                <title>Form Example</title>
            </head>
            <body>
    `;
    return html;
}

const footing = () => {
    return `
        </body>
    </html>
    `;
}

const send_page = (res, body) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(heading() + body + footing());
    res.end();
}

// This is a really unsophisticated way of parsing
// form data, we will replace it with something better
// very soon.
const parse_form_data = (data) => {
    const form = {};
    const fields = data.split('&');
    for (const f of fields) {
        const pair = f.split('=');
        form[pair[0].trim()] = pair[1].trim();
    }
    return form;
}


if (req.method.toUpperCase() === 'GET' && req.url === '/first') {
    // Get number of seconds since Jan 1, 1970
    const now = (new Date()).getUTCSeconds();

    send_page(res, `<form action="/second", method="get">
                        <input name="first", type='number' value='${now}'/>
                        <br/>
                        <button type="submit">Got to Second Page</button>
                    </form>`);
}
else if (req.method.toUpperCase() === 'GET' && req.url === '/second') {
    // Form data submitted on query string, since it's GET
    const body = parse_form_data(req.url.split('?')[1]);
    const now = (new Date()).getUTCSeconds();
    const seconds_since_first = now - parseInt(body.first);
    send_page(res, `<p>Second between page views:  ${seconds_since_first}</p>`);
}

const handle_request = (req, res) => {
    if (req.method.toUpperCase() === 'GET' && req.url === '/') {
        // This a GET request for the root page - which is the HTML that
        // contains the form.
        send_page(res, `<form action="/destination", method="get">
                            <input name="first", type='color'/>
                            <br/>
                            <input name="last"/>
                            <br/>
                            <button type="submit">Submit</button>
                        </form>`);
    }
    else if (req.method.toUpperCase() === 'GET' && req.url.startsWith('/destination')) {
        // The url is going to be /destination?first=A&last=B, so we need to compare
        // with startsWith, rather than an exact match
        console.log(req.url);
        if (req.url.indexOf('?')) {
            body = parse_form_data(req.url.split('?')[1]);
            send_page(res, `<p>Welcome ${body.first} ${body.last}</p>`);
        }
        else {
            send_page(res, `<p>No form data was sent!</p>`);
        }
    }
    else if (req.method.toUpperCase() === 'POST' && req.url === '/destination') {

        let body = "";
        req.on('data', (chunk) => {
            // This function gets called as chunks of data arrive.
            // In our case, it's probably just one chunk since
            // we have such little data, but we still need 
            // to handle it using a callback like this (for now).
            body += chunk;
        });

        // Eventually, the stream of data arriving from the browser (the 
        // request body) will end.  We register a function to be called
        // when that event occurs.
        req.on('end', () => {
            // The request body will look like this:
            // first=something&last=something
            body = parse_form_data(body);
            // We need to respond with an HTML page, let's just make 
            // it have the data posted.
            send_page(res, `<p>Welcome ${body.first} ${body.last}</p>`);
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write(heading() + `<p>Sorry, page not found</p>` + footing());
        res.end();
    }
}

http.createServer(handle_request).listen(8080);