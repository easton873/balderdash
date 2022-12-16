const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    });

var path = require('path');
import { clientHandler } from "./game";
const { handleClientActions } = require('./game');

const PORT = process.env.PORT || 8080;

app.use( express.static(path.resolve('./balderdash-app/build/')));

app.get('/', function(req, res) {
    res.sendFile(path.resolve('./balderdash-app/build/index.html'));
});

server.listen(PORT, ()=>{
    console.log("Up and at 'em");
});

// const io = require('socket.io')({
//     cors: {
//         origin: '*',
//     }
// });

io.on('connection', client => {
    clientHandler.handleClientActions(client, io);
});
