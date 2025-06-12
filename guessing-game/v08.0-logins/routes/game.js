const express = require('express')
const router = express.Router();
const Game = require('wf-guess-game').Game;

router.get('/', async (req, res) => {
    const game = new Game();
    req.session.game = game;
    res.render('guess', { game });
});

router.post('/', async (req, res) => {
    if (req.session.game === undefined) {
        res.status(404).end();
        return;
    }

    const game = Game.fromRecord(req.session.game);
    const response = game.make_guess(req.body.guess);
    game.guesses.push(req.body.guess);

    if (response) {
        res.render('guess', { game, response });
    } else {
        if (req.session.account_id) {
            game.account = req.session.account_id;
            req.GameDb.record_game(game);
        }
        res.render('complete', { game });
    }
});

module.exports = router;