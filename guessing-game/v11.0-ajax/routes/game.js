const express = require('express')
const router = express.Router();
const Game = require('wf-guess-game').Game;

router.get('/', async (req, res) => {
    const game = new Game();
    req.session.game = game;
    console.log("New game created", game);
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
    console.log("Guess made", req.body.guess, "Response:", response);
    if (response) {

        // This means the guess was incorrect.
        // Just respond with the response, which is a JSON object
        // of the form {{}}
        res.json({ correct: false, message: response });
    } else {
        if (req.session.account_id) {
            game.account = req.session.account_id;
            req.GameDb.record_game(game);
        }
        res.json({ correct: true, num_guesses: game.guesses.length });
    }
});

module.exports = router;