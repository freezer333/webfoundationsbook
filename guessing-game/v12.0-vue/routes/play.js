const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;
    const id = await req.db.createGame(secret);
    req.session.gameId = id;
    res.json({ gameId: id });
});

router.post('/', async (req, res) => {
    const game = await req.db.findGame(req.session.gameId);
    if (!game) {
        res.status(400).send('Not Found');
        return;
    }

    await req.db.recordGuess(game, req.body.guess);

    const guess = parseInt(req.body.guess);

    if (guess < game.secret) {
        res.json({ result: "low" })
    } else if (guess > game.secret) {
        res.json({ result: "high" });
    } else {
        await req.db.complete(game);
        res.json({ result: "complete" });
    }
})

module.exports = router;