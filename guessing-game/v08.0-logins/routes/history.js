const express = require('express')
const router = express.Router();
const Game = require('wf-guess-game').Game;



// Middleware to redirect to /login if not already logged in
router.use((req, res, next) => {
    if (!req.session.account_id) {
        return res.redirect('/login');
    }
    return next();
});

router.get('/', (req, res) => {
    const records = req.GameDb.get_games();
    const games = records.map(r => Game.fromRecord(r));
    res.render('history', { games: games.filter(f => f.complete) });
});

router.get('/:gameId', (req, res) => {
    const record = req.GameDb.get_game(parseInt(req.params.gameId));
    const game = Game.fromRecord(record);

    // Use Express style code to send the 404.
    if (!game) {
        res.status(404).end();
        return;
    }

    res.render('game_history', { game });
});

module.exports = router;