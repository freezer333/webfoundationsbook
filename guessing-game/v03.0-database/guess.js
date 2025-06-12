
// Contents of guess.js - with framework.js in the same directory
const Framework = require('./framework');
const http = require('http');
const sql = require('better-sqlite3');
require('dotenv').config();

if (process.env.DB_FILENAME === undefined) {
    console.error('Please set the DB_FILENAME environment variable');
    process.exit(1);
}
const db = sql(process.env.DB_FILENAME);

class Game {

    static fromRecord(record) {
        const game = new Game();
        game.id = record.id;
        game.secret = record.secret;
        game.guesses = record.guesses;
        game.complete = record.completed;
        game.time = record.time;
        game.guesses = record.guesses;
        return game;
    }

    constructor() {
        // Create the secret number
        this.secret = Math.floor(Math.random() * 10) + 1;
        this.guesses = [];
        this.complete = 0;
    }

    guess_response(user_guess) {
        if (user_guess > this.secret) {
            return "too high";
        } else if (user_guess < this.secret) {
            return "too low";
        } else {
            return undefined;
        }
    }

    make_guess(user_guess) {
        if (user_guess === this.secret) {
            this.complete = 1;
            this.time = (new Date()).toLocaleDateString();
        }
        return this.guess_response(user_guess);
    }
}


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
    const game = new Game(); // <- no id passed to constructor

    const stmt = db.prepare('insert into game (secret, completed) values (?, ?)');
    const info = stmt.run(game.secret, game.complete);

    // The info object returned by the run command will always contain lastInsertRowId
    // when running an insert command - since sqlite is generating the id for us.
    game.id = info.lastInsertRowid;

    //games.push(game);  <- no longer using the array!
    send_page(res, make_guess_page(game));
}

const guess = async (req, res) => {
    const record = db.prepare('select * from game where id = ?').get(req.body.gameId);
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
    const g = db.prepare('insert into guesses (game, guess, time) values (?, ?, ?)');
    g.run(game.id, req.body.guess, (new Date()).getTime());

    const stmt = db.prepare('update game set completed = ?, time = ? where id = ?');
    stmt.run(game.complete, game.time, game.id)

}

const history = (req, res) => {

    const records = db.prepare('select * from game where completed = ?').all(1);
    for (const r of records) {
        r.guesses = db.prepare('select * from guesses where game = ? order by time').all(r.id).map(g => g.guess);
    }
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
    const record = db.prepare('select * from game where id = ?').get(req.query.gameId);
    record.guesses = db.prepare('select * from guesses where game = ? order by time desc').all(record.id).map(g => g.guess);
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

// Delete all the incomplete games on startup.
db.prepare('delete from game where completed = ?').run(0);

http.createServer((req, res) => { router.on_request(req, res) }).listen(8080);
