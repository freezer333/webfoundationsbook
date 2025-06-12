const Framework = require('./framework');

const schema = [
    {
        key: 'first',
        type: 'string',
        required: true
    },
    {
        key: 'last',
        type: 'string',
        required: true
    },
    {
        key: 'age',
        type: 'number'
    },
    {
        key: 'country',
        type: 'string',
        default: 'United States'
    }
]

const http = require('http');

const serve_home_page = (req, res) => {
   /*... serve the page ...*/
}

const serve_person_form = (req, res) => {
   /*... serve the page ...*/
}

const render_person_response = (req, res) => {
    /*... serve the page ...*/
}

const router = new Framework.Router();
router.get('/', serve_home_page);
router.get('/person', serve_person_form);
router.post('/person', render_person_response, true, schema);
http.createServer((req, res) => { router.on_request(req, res) }).listen(8080);
