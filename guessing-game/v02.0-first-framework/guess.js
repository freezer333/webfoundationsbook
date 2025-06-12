
// Contents of guess.js - with framework.js in the same directory
const Framework = require('./framework');
const http = require('http');

const games = [];


class Game {
    #secret;
    constructor(id) {
        this.id = id;

        // Create the secret number
        this.#secret = Math.floor(Math.random() * 10) + 1;
        this.guesses = [];
        this.complete = false;
    }

    guess_response(user_guess) {
        if (user_guess > this.#secret) {
            return "too high";
        } else if (user_guess < this.#secret) {
            return "too low";
        } else {
            return undefined;
        }
    }

    make_guess(user_guess) {
        this.guesses.push(user_guess);
        if (user_guess === this.#secret) {
            this.complete = true;
            this.time = new Date();
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
    const game = new Game(games.length);
    games.push(game);
    send_page(res, make_guess_page(game));

}

const guess = async (req, res) => {
    const game = games.find((g) => g.id === req.body.gameId);
    if (!game) {
        res.writeHead(404);
        res.end();
        return;
    }
    const response = game.make_guess(req.body.guess);
    if (response) {
        send_page(res, make_guess_page(game, response));
    } else {
        send_page(res, `<h1> Great job!</h1> <a href="/">Play again</a>`);
    }
}

const history = (req, res) => {
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
    const game = games.find((g) => g.id === req.query.gameId);
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


http.createServer((req, res) => { router.on_request(req, res) }).listen(8080);
