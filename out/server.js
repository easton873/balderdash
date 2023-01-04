"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
var path = require('path');
var PORT = process.env.PORT || 8080;
app.use(express.static(path.resolve('./balderdash-app/build/')));
app.get('/', function (req, res) {
    res.sendFile(path.resolve('./balderdash-app/build/index.html'));
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
    game_1.clientHandler.handleClientActions(client, io);
});
