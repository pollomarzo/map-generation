const express = require('express');
const path = require('path');
const app = express();
var cors = require('cors')

var CACHE = {
    is_approved: false,
    questions: [],
    factors: [],
    abstracts: [],
};

const cleanup = (text) => text.replace(/\s\s+/g, ' ');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// just allow all requests 
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')));


app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/data', function (req, res) {
    return res.send(CACHE);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/abstract', function (req, res) {
    console.log("received this: ", req.body);
    if (req.body.original_uri &&
        req.body.original_label &&
        req.body.text &&
        req.body.annotated_text &&
        !CACHE.abstracts.some((q) => q.original_uri === req.body.original_uri))
        CACHE.abstracts.push({
            ...req.body,
            text: cleanup(req.body.text)
        });
    return res.send('got your abstract thx');
});


app.post('/question', function (req, res) {
    console.log("received this: ", req.body);
    if (req.body.original_uri &&
        req.body.original_label &&
        req.body.question &&
        req.body.text &&
        req.body.annotated_text &&
        !CACHE.questions.some((q) => q.original_uri === req.body.original_uri && q.question === req.body.question))
        CACHE.questions.push({
            ...req.body,
            text: cleanup(req.body.text)
        });
    return res.send('got your question-ans pair thx');
});

app.post('/approval', function (req, res) {
    console.log("received this: ", req.body);
    if (req.body.is_approved && req.body.factors) {
        CACHE.is_approved = req.body.is_approved;
        CACHE.factors = req.body.factors.map(text => cleanup(text));
        /** or maybe this looks better
         * CACHE = {
         *  ...CACHE,
         *  ...req.body,
         * };
         * pretty nice... will think about it
         */
    }
    return res.send('got your factor list thx');
});

app.listen(process.env.PORT || 8080);