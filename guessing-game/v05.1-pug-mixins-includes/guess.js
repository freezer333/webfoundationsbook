const http = require('http');

// Modules we've already written, and published on NPM!
const Game = require('wf-guess-game').Game;
const GuessDatabase = require('wf-guess-db').GuessDatabase;
const Framework = require('wf-framework');

// Now let's include pug too
const pug = require('pug');

// Load the .env environment variables for the database.
require('dotenv').config();

const render = (res, file, model) => {
    const html = pug.renderFile(`./views/${file}.pug`, model);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
}

const start = (req, res) => {
    // add_game returns the same game it adds, with an id
    const game = GameDb.add_game(new Game());
    render(res, 'guess', { game });
}

const guess = async (req, res) => {
    const record = GameDb.get_game(req.body.gameId);
    if (!record) {
        res.writeHead(404);
        res.end();
        return;
    }
    // create a game instance from the record found in the db
    const game = Game.fromRecord(record);
    const response = game.make_guess(req.body.guess);

    // add_guess returns a guess record with a game id, guess, and time.
    const guess = GameDb.add_guess(game, req.body.guess);
    game.guesses.push(guess.guess);
    GameDb.update_game(game);

    if (response) {
        render(res, 'guess', { game, response });
    } else {
        render(res, 'complete', { game });
    }
}

const history = (req, res) => {
    const records = GameDb.get_games();
    const games = records.map(r => Game.fromRecord(r));
    render(res, 'history', { games: games.filter(f => f.complete) });
}

const game_history = (req, res) => {
    const record = GameDb.get_game(req.query.gameId);
    const game = Game.fromRecord(record);

    if (!game) {
        res.writeHead(404);
        res.end();
        return;
    }

    render(res, 'game_history', { game });
}

const schema = [
    { key: 'guess', type: 'int' },
    { key: 'gameId', type: 'int' }
];

if (process.env.DB_FILENAME === undefined) {
    console.error('Please set the DB_FILENAME environment variable');
    process.exit(1);
}

const GameDb = new GuessDatabase(process.env.DB_FILENAME);

const router = new Framework.Router();
router.get('/', start);
router.post('/', guess, true, schema);
router.get('/history', history);
router.get('/history', game_history, true, [{ key: 'gameId', type: 'int', required: true }]);

http.createServer((req, res) => { router.on_request(req, res) }).listen(8080);