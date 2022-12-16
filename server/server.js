"use strict";
exports.__esModule = true;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});
var path = require('path');
var game_1 = require("./game");
var handleClientActions = require('./game').handleClientActions;
var PORT = process.env.PORT || 8080;
app.use(express.static(path.resolve('./front end')));
app.get('/', function (req, res) {
    res.sendFile(path.resolve('./front end/index.html'));
});
server.listen(PORT, function () {
    console.log("Up and at 'em");
});
// const io = require('socket.io')({
//     cors: {
//         origin: '*',
//     }
// });
io.on('connection', function (client) {
    console.log(typeof client);
    console.log(typeof io);
    game_1.clientHandler.handleClientActions(client, io);
});
