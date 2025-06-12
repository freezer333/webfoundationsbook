
const http = require('http');
const Framework = require('wf-framework');
const Game = require('wf-guess-game').Game;
const GuessDatabase = require('wf-guess-db').GuessDatabase;


require('dotenv').config();

if (process.env.DB_FILENAME === undefined) {
    console.error('Please set the DB_FILENAME environment variable');
    process.exit(1);
}

const GameDb = new GuessDatabase(process.env.DB_FILENAME);

// The following three functions are prime candidates for a framework too, 
// and we will be moving them into something soon!
const heading = () => {
    const html = `
        <!doctype html><html><head><title>Guess</title></head>
        <body>`;
    return html;
}

const footing = () => {
    return `</body></html>`;
}

const send_page = (res, body) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(heading() + body + footing());
    res.end();
}

const make_guess_page = (game, result) => {
    const message = result === undefined ?
        `<p>I'm thinking of a number from 1-10!</p>` :
        `<p>Sorry your guess was ${result}, try again!</p>`;
    return `
        <form action="/" method="POST">
            ${message}
            <label for="guess">Enter your guess:</label>
            <input name="guess" placeholder="1-10" type="number" min="1" max="10"/>
            <input name="gameId" type="hidden" value="${game.id}"/>
            <button type="submit">Submit</button>
        </form>
        <a href="/history">Game History</a>
    `;
}

const start = (req, res) => {
    const game = new Game();
    GameDb.add_game(game);
    send_page(res, make_guess_page(game));
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
    if (response) {
        send_page(res, make_guess_page(game, response));
    } else {
        send_page(res, `<h1> Great job!</h1> <a href="/">Play again</a>`);
    }

    GameDb.add_guess(game, req.body.guess);
    GameDb.update_game(game);
}

const history = (req, res) => {
    const records = GameDb.get_games();
    const games = records.map(r => Game.fromRecord(r));

    const html = heading() +
        `
        <table>
            <thead>
                <tr>
                    <th>Game ID</th>
                    <th>Num Guesses</th>
                    <th>Completed</th>
                </tr>
            </thead>
            <tbody>
                ${games.filter(g => g.complete).map(g => `
                    <tr>
                        <td><a href="/history?gameId=${g.id}">${g.id}</a></td>
                        <td>${g.guesses.length}</td>
                        <td>${g.time}</td>
                    </tr>
                `).join('\n')}
            </tbody>
        </table>
        <a href="/">Play the game!</a>
        `
        + footing();
    send_page(res, html);
}

const game_history = (req, res) => {
    const record = GameDb.get_game(req.query.gameId);
    const game = Game.fromRecord(record);

    if (!game) {
        res.writeHead(404);
        res.end();
        return;
    }
    const html = heading() +
        `
        <table>
            <thead>
                <tr>
                    <th>Value</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                ${game.guesses.map(g => `
                    <tr>
                        <td>${g}</td>
                        <td>${game.guess_response(g) ? game.guess_response(g) : 'success'}</td>
                    </tr>
                `).join('\n')}
            </tbody>
        </table>
        <a href="/history">Game History</a>
        `
        + footing();
    send_page(res, html);
}


const schema = [
    { key: 'guess', type: 'int' },
    { key: 'gameId', type: 'int' }
];

const router = new Framework.Router();
router.get('/', start);
router.post('/', guess, true, schema);
router.get('/history', history);
router.get('/history', game_history, true, [{ key: 'gameId', type: 'int', required: true }]);

http.createServer((req, res) => { router.on_request(req, res) }).listen(process.env.PORT || 8080);
