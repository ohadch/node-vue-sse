const express = require('express');
const Stream = require('./stream');

const app = express();
const stream = new Stream();

app.use(stream.enable());

app.get('/stream', function(request, response) {
    stream.add(request, response);
    stream.push_sse(1, "opened", { msg: 'connection opened!' });
});

app.get('/test_route', function(request, response){
    stream.push_sse(2, "new_event", { event: true });
    return response.json({ msg: 'admit one' });
});

let count = 0;

setInterval(function(){
    console.log("Pushing event");
    stream.push_sse(1, "chat", { event: true });
}, 1000);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports = app;
