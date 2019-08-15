const express = require('express');
const sse = require('./services/sse');
const r = require('rethinkdb');

const { HOST, PORT } = require('./config/rethinkdb');
const app = express();

app.use(sse.enable());

app.get('/stream', function(request, response) {
    sse.add(request, response);
    sse.push_sse(1, "opened", { msg: 'connection opened!' });

    // Listen for changes
    r.connect( {host: HOST, port: PORT}, async function(err, connection) {
        r.db('data').table('messages').changes().run(connection, function (err, cursor) {
            if (err) throw err;
            cursor.each(function (err, { new_val: record }) {
                if (err) throw err;
                sse.push_sse(1, "message", record);
            });
        });
    });

});



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports = app;
