"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientHandler = void 0;
var BalderdashGame_js_1 = require("./BalderdashGame.js");
var Player_js_1 = require("./Player.js");
var shared_js_1 = require("./shared.js");
var games = new Map();
var roomLookup = new Map();
var hosts = new Map();
var confirmGame = function (g) {
    if (g) {
        return g;
    }
    throw Error("Game is undefined");
};
var queryGame = function (g) {
    if (g) {
        return g;
    }
    return null;
};
var ClientHander = /** @class */ (function () {
    function ClientHander() {
    }
    ClientHander.prototype.handleClientActions = function (client, io) {
        console.log("guy connected");
        client.on('hostGame', handleHostGame);
        client.on('joinGame', handleJoinGame);
        client.on('disconnect', handlDisconnect);
        client.on('vote', handleVote);
        client.on('submit', handleSubmitEntry);
        client.on('next', handleNext);
        client.on('readNext', handleReadNext);
        client.on('readPrev', handleReadPrev);
        // function getCurrGame(){
        //     let room = roomLookup[client.id];
        //     return games[room];
        // }
        // function getCurrPlayer(){
        //     return getCurrGame().players[client.id];
        // }
        function emitGameState(roomName, gameInstance) {
            console.log('emitting game to room ' + roomName);
            gameInstance.emitState();
            //io.sockets.in(roomName).emit('gameState', gameInstance.exportState(player));
        }
        function handleHostGame() {
            if (hosts.get(client.id)) {
                console.log('already hosting');
                return;
            }
            var room = (0, shared_js_1.makeId)(4);
            console.log(room);
            var host = new Player_js_1.Player(client, "Host", room);
            var game = new BalderdashGame_js_1.BalderdashGame(host);
            games.set(room, game);
            hosts.set(client.id, host);
            client.emit("hosting", room);
            game.emitState();
        }
        function handleReadNext() {
            var game = confirmGame(roomLookup.get(client.id));
            game.readEntry(game.getPlayer(client.id));
            game.emitToMainScreen();
        }
        function handleReadPrev() {
        }
        function handleJoinGame(roomCode, gamerTag) {
            roomCode = roomCode.toLowerCase();
            console.log("Client's id: " + client.id);
            var game = queryGame(games.get(roomCode));
            if (roomLookup.get(client.id)) {
                console.log('already in a game');
                return;
            }
            if (game) {
                var player = new Player_js_1.Player(client, gamerTag, roomCode);
                if (game.joinGame(player)) {
                    client.join(roomCode);
                    roomLookup.set(client.id, game);
                    emitGameState(roomCode, game);
                }
                // roomLookup[client.id] = room;
                // game.players[client.id] = createNewPlayer(name, color, client.id);
                // game.stocks[client.id] = 5;
                // game.market[client.id] = 0;
                // // set every players stocks to zero of your stock
                // for (var key in game.players){
                //     if (key != client.id){
                //         game.players[key].stocks[client.id] = 0;
                //         game.players[client.id].stocks[key] = 0;
                //     }
                // }
                // client.emit('init', game, client.id, room);
                // emitGameState(room, game);
            }
            else {
                console.log("Room doesn't exist");
            }
        }
        function handlDisconnect() {
            console.log('client disconnected');
            // create a way for the player to reconnect to themselves
            // delete game.players[client.id];
            // delete game.stocks[client.id];
            // delete game.market[client.id];
            // for (var key in game.players){
            //     let currPlayer = game.players[key];
            //     delete currPlayer.stocks[client.id]
            // }
            //emitGameState(0, game);
        }
        function handleVote() {
            var game = confirmGame(roomLookup.get(client.id));
            game.voteForCurrent(game.getPlayer(client.id));
        }
        function handleSubmitEntry(entryText, correctAnswer) {
            if (correctAnswer === void 0) { correctAnswer = ""; }
            console.log("submitting");
            var game = confirmGame(roomLookup.get(client.id));
            game.submitEntry(game.getPlayer(client.id), entryText, correctAnswer);
            client.emit('success');
        }
        function handleNext() {
            console.log('next');
            var game = confirmGame(roomLookup.get(client.id));
            game.nextState(game.getPlayer(client.id));
        }
    };
    return ClientHander;
}());
var clientHandler = new ClientHander();
exports.clientHandler = clientHandler;
