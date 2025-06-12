const express = require('express')
const router = express.Router();
const moment = require('moment');

router.get('/', async (req, res) => {
    res.render('history', { title: 'Guessing Game History' });
})

router.get('/games', async (req, res) => {
    const games = await req.db.findCompleteGames();
    console.log(games);
    games.forEach(g => g.time = moment(parseInt(g.time)).format('MMM D yyyy - h:mma'))
    res.json(games);
})

router.get('/:gameId', async (req, res) => {
    res.render('game', { game_id: req.params.gameId });
});
router.get('/:gameId/guesses', async (req, res) => {
    const game_guesses = await req.db.findGuesses(req.params.gameId);
    game_guesses.forEach(g => g.time = moment(parseInt(g.time)).format('MMM D yyyy - h:mma'))
    res.json(game_guesses);
});

module.exports = router;
