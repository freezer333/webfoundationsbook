const GuessDatabase = require('wf-guess-dba').GuessDatabase;
const express = require('express');
require('dotenv').config();

const GameDb = new GuessDatabase(process.env.DB_FILENAME);

// This is the core express instance, which 
// runs the route handling of our application
const app = express();

const session = require('express-session');
app.use(session({
    secret: 'guessing game'
}));

// This enabled a request body parser for form
// data.  It works a lot like our body parsing code
// for wf-framework
app.use(express.urlencoded({ extended: true }))

// Express will assume your pug templates are
// in the /views directory
app.set('view engine', 'pug');

app.use((req, res, next) => {
    req.GameDb = GameDb;
    next();
});

app.use((req, res, next) => {
    res.locals.username = req.session.account_username;
    next();
});

app.use('/', require('./routes/account'));
app.use('/', require('./routes/game'));
app.use('/history', require('./routes/history'));

app.listen(process.env.PORT || 8080, () => {
    console.log(`Guessing Game app listening on port 8080`)
});