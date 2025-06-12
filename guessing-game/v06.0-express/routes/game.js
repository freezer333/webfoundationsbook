const express = require('express')
const router = express.Router();
const Game = require('wf-guess-game').Game;

router.get('/', async (req, res) => {
    const game = req.GameDb.add_game(new Game());
    res.render('guess', { game });
});

router.post('/', async (req, res) => {
    const record = req.GameDb.get_game(parseInt(req.body.gameId));
    if (!record) {
        res.status(404).end();
        return;
    }
    // create a game instance from the record found in the db
    const game = Game.fromRecord(record);
    const response = game.make_guess(req.body.guess);

    // add_guess returns a guess record with a game id, guess, and time.
    const guess = req.GameDb.add_guess(game, req.body.guess);
    game.guesses.push(guess.guess);
    req.GameDb.update_game(game);

    if (response) {
        res.render('guess', { game, response });
    } else {
        res.render('complete', { game });
    }
});

module.exports = router;