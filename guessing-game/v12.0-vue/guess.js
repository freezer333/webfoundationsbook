const pug = require('pug');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');


const Database = require('gdbcmps369');
const db = new Database();
db.initialize();


// This is the core express instance, which 
// runs the route handling of our application
const app = express();
// This enabled a request body parser for form
// data.  It works a lot like our BodyParser
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
// Express will assume your pug templates are
// in the /views directory
app.set('view engine', 'pug');


app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))



// Important:  We add the static route first - it will
// politely pass things on to "next" if the request doesn't
// match anything in our public director - which at this point
// is just the CSS file.  Take a look at layout.pug, it has
// the reference to the css file - and note that "public" is not
// part of the url.  The express-static module looks for files 
// relative to the root, but it looks in the specified folder.
app.use(express.static('public'));


app.use((req, res, next) => {
    req.db = db;
    next(); // ensures the route handlers will be called.
})

app.use('/play', require('./routes/play'))
app.use('/history', require('./routes/history'))
app.use('/', (req, res) => {
    res.render('guess', {});
});

app.listen(8080, () => {
    console.log(`Example app listening on port 8080`)
})