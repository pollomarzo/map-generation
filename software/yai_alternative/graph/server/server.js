const express = require('express');
const path = require('path');
const app = express();
var cors = require('cors')

var CACHE = [];

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

app.post('/graph', function (req, res) {
    console.log("received this: ", req.body);
    if (req.body.original_uri &&
        req.body.original_label &&
        req.body.question &&
        req.body.text &&
        req.body.annotated_text)
        CACHE = [...CACHE, req.body];
    return res.send('got your shit thx');
});

app.listen(process.env.PORT || 8080);