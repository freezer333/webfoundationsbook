const express = require('express')
const router = express.Router();
const Game = require('wf-guess-game').Game;

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    req.session.account_id = null;
    req.session.account_username = null;
    res.redirect('/');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.render('login', { error: 'All fields are required' });
    }

    const account = await req.GameDb.authenticate(username, password);
    if (!account) {
        return res.render('login', { error: 'Invalid username or password' });
    }
    req.session.account_id = account.id;
    // We can put this in the session too - maybe enhance our template to indicate the user is logged in
    // by displaying their name.  
    req.session.account_username = account.username;
    res.redirect('/');
});

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    if (!username || !password || !password2) {
        return res.render('signup', { error: 'All fields are required' });
    }

    if (password !== password2) {
        return res.render('signup', { error: 'Passwords do not match' });
    }

    const existing = await req.GameDb.get_account(username);
    if (existing) {
        return res.render('signup', { error: 'Account already exists' });
    }

    const account = await req.GameDb.add_account(username, password);
    req.session.account_id = account.id;
    req.session.account_id = account.id;
    req.session.account_username = account.username;
    res.redirect('/');
});

module.exports = router;