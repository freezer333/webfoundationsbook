const qs = require('querystring');

class Parser {
    #schema;
    constructor(schema = []) {
        this.#schema = schema;
    }
    _apply_schema(payload) {
        for (const item of this.#schema.filter(i => payload[i.key])) {
            if (item.type === 'int') {
                payload[item.key] = parseInt(payload[item.key])
            } else if (item.type === 'float') {
                payload[item.key] = parseInt(payload[item.key])
            } else if (item.type === 'bool') {
                payload[item.key] = payload[item.key] === "true"
            }
        }

        // Now check that each required field is present
        for (const item of this.#schema.filter( i => i.required)) {
            if (payload[item.key] === undefined) {
                throw Error(`Schema validation error:  ${item.key} is not present`);
            }
        }

        // Finally, set defaults.
        for (const item of this.#schema.filter( i => i.default)) {
            if (payload[item.key] === undefined) {
                payload[item.key] = item.default;
            }
        }
        return payload
    }
}

class QueryParser extends Parser {
    constructor() {
        super();
    }
    parse(req) {
        if (req.url.indexOf("?") >= 0) {
            const query = qs.parse(req.url.split('?')[1]);
            return this._apply_schema(query);
        }
        else {
            return {}
        }
    }
}
class BodyParser extends Parser {
    constructor(schema) {
        super(schema);
    }
    async parse(req) {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                body = qs.parse(body);
                resolve(this._apply_schema(body));
            });
        });
    }
}


class Route {
    // Method should be either GET or POSt
    // Path is the URL
    // Handler is a function to call when this route is requested
    // query and body are boolean flags, indicating if there is a query string or 
    // body to parse.
    // schema is the schema object to use to parse the query or body
    constructor (method, path, handler, query = false, body = false, schema = []) {
        this.method = method;
        this.path = path;
        this.handler = handler;
        this.has_query = query;
        this.has_body = body;
        this.schema = schema;

        if (this.has_query) {
            this.qparser = new QueryParser(schema);
        }
        if (this.has_body) {
            this.bparser =new BodyParser(schema);
        }
    }

    matches(req) {
        if (req.method.toUpperCase() !== this.method) return false;

        // We check the url differently if there is an expected query string, since it 
        // will be part of the url string itself.
        if (this.has_query) {
            return req.url.startsWith(this.path + "?");
        } else {
            return req.url === this.path;
        }
    }

    async serve(req, res) {
        let parser = null;
        if (this.qparser) {
            req.query = this.qparser.parse(req);
        }
        if (this.bparser) {
            req.body = await this.bparser.parse(req);
        }
        await this.handler(req, res);
    }
}


class Router {
    constructor() {
        this.routes = [];
    }
    get(path, handler, has_query = false, schema = []) {
        const r = new Route('GET', path, handler, has_query, false, schema);
        this.routes.push(r);
    }
    post(path, handler, has_body = false, schema = []) {
        const r = new Route('POST', path, handler, false, has_body, schema);
        this.routes.push(r);
    }
    async on_request(req, res) {
        for (const route of this.routes) {
            if (route.matches(req)) {
                route.serve(req, res);
                return;
            }
        }
        // No route matched, return not found.
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<!doctype html><html><head><title>Not Found</title></head><body><h1>Not Found</h1></body></html>')
        res.end();
    }
}

