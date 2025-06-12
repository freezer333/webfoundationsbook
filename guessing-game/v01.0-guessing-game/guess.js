const http = require("http");
const qs = require("querystring");

const heading = () => {
  const html = `
        <!doctype html>
            <html><head><title>Guess</title></head>
            <body>`;
  return html;
};

const footing = () => {
  return `</body></html>`;
};

const send_page = (res, body) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(heading() + body + footing());
  res.end();
};

const make_form = (message, secret) => {
  return `
    <form action="/guess" method="post">
      <p> ${message}</p>
      <label for="guess">Enter your guess:</label>
      <input name="guess" placeholder="1-10" type="number" min="1" max="10"/>
      <input name="secret" value="${secret}" type="hidden"/>
      <button type="submit">Submit</button>
    </form>
    `;
};
const render_start = (req, res) => {
  // Assign the secret value and send the initial page.
  // This is the creation of a new "game".
  const secret = Math.floor(Math.random() * 10) + 1;
  const body = make_form(
    `Welcome to the guessing game.  I'm thinking of a number between 1 and 10.`,
    secret,
  );
  send_page(res, body);
};

const render_success = (req, res) => {
  // Send a success page, with a link to the /start page.
  send_page(
    res,
    `<p>Congratulations!  Please play <a href="/start">again</a></p>`,
  );
};

const process_guess = (req, res) => {
  // Now we need to look at the submitted data -
  // the guess and the secret, to figure out what
  // to do next.  Either redirect to /success or
  // render new form page for another guess.
  const secret = parseInt(req.form_data.secret);
  const guess = parseInt(req.form_data.guess);
  if (guess < secret) {
    // The guess was too low, render a form with the appropriate message.
    const body = make_form(`Sorry that guess is too low, try again!`, secret);
    send_page(res, body);
  } else if (guess > secret) {
    // The guess was too high
    const body = make_form(`Sorry that guess is too high, try again!`, secret);
    send_page(res, body);
  } else {
    // The guess was correct!  Respond with a redirect, so the
    // browser requests /success with GET
    res.writeHead(302, { Location: "/success" });
    res.end();
  }
};

const render_404 = (req, res) => {
  // Just send a 404 response, we've done this before!
  res.writeHead(404, { "Content-Type": "text/html" });
  res.write(heading() + `<p>Sorry, page not found</p>` + footing());
  res.end();
};

const handle_request = (req, res) => {
  if (
    req.method.toUpperCase() === "GET" &&
    (req.url === "/" || req.url == "/start")
  ) {
    render_start(req, res);
  } else if (req.method.toUpperCase() === "GET" && req.url == "/success") {
    render_success(req, res);
  } else if (req.method.toUpperCase() === "POST" && req.url == "/guess") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      // qs parses the guess=x&secret=y string
      // into an object.
      req.form_data = qs.parse(body);
      process_guess(req, res);
    });
  } else {
    render_404(req, res);
  }
};

http.createServer(handle_request).listen(8080);
