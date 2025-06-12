const sql = require('better-sqlite3');

class GuessDatabase {
    #db
    constructor(db_filename) {
        this.#db = sql(db_filename);
        this.#bootstrap();
        this.#sweep_incomplete();
    }

    /** Creates the tables */
    #bootstrap() {
        const game = `create table if not exists game (id integer primary key, secret integer, completed integer, time text)`;
        const guess = `create table if not exists guesses (
                         game integer, 
                         guess integer, 
                         time integer, 
                         foreign key(game) references game(id) on delete cascade
                       )`;
        this.#db.prepare(game).run();
        this.#db.prepare(guess).run();
    }

    /** Deletes the incomplete games */
    #sweep_incomplete() {
        this.#db.prepare('delete from game where completed = ?').run(0);
    }

    /** inserts a game, assigns game.id to the created
     *  primary key
     */
    add_game(game) {
        const stmt = this.#db.prepare('insert into game (secret, completed) values (?, ?)');
        const info = stmt.run(game.secret, game.complete);
        game.id = info.lastInsertRowid;
        return game;
    }

    /** Updates the completed, time values of the game */
    update_game(game) {
        const stmt = this.#db.prepare('update game set completed = ?, time = ? where id = ?');
        stmt.run(game.complete, game.time, game.id);
        return game;
    }

    /** Adds a guess record for the game */
    add_guess(game, guess) {
        const g = this.#db.prepare('insert into guesses (game, guess, time) values (?, ?, ?)');
        const _guess = { game: game.id, guess: guess, time: (new Date()).getTime() };
        g.run(_guess.game, _guess.guess, _guess.time);
        return _guess;
    }

    record_game(game) {
        const completed = this.add_game(game);
        game.time = new Date().toLocaleDateString();
        game.complete = 1;
        this.update_game(completed);
        for (const guess of game.guesses) {
            this.add_guess(completed, guess);
        }
    }

    /* Finds the game record for the game, by id - and populates
    *  the guesses array with the guesses for the game.
    */
    get_game(game_id) {
        const record = this.#db.prepare('select * from game where id = ?').get(game_id);
        record.guesses = this.#db.prepare('select * from guesses where game = ? order by time').all(record.id).map(g => g.guess);
        return record;
    }

    /** Returns all the (complete) games */
    get_games() {
        const records = this.#db.prepare('select * from game where completed = ?').all(1);
        for (const r of records) {
            r.guesses = this.#db.prepare('select * from guesses where game = ? order by time').all(r.id).map(g => g.guess);
        }
        return records
    }
}


exports.GuessDatabase = GuessDatabase;