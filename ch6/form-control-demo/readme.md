# Form Demo
This program (`forms.js`) serves a single page when it receives a GET to `/`, which is
the contents of `forms.html`.  You can experiment with forms by editing the contents of
`forms.html`, maybe changing form names, types, and the form action/method.

`forms.js` responds to `GET` and `POST` requests sent to `/data`, and creates a response
HTML that contains the details of what was sent by the form.

**Note** `forms.js` uses `ejs` to generate the HTML response to form submission.  We won't touch on `ejs` much in this book, but we'll use a more powerful cousin - `pug` - a little later.  You don't need to worry too much about `ejs` or `pug` now, we'll see them soon enough.

To run the program, do an `npm install` and then you can run it with `node forms.js`.