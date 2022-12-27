"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientHandler = void 0;
var Player_js_1 = require("./Player.js");
var games = new Map();
var roomLookup = new Map();
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
        var game = roomLookup.get(client.id);
        // function getCurrGame(){
        //     let room = roomLookup[client.id];
        //     return games[room];
        // }
        // function getCurrPlayer(){
        //     return getCurrGame().players[client.id];
        // }
        function emitGameState(roomName, gameInstance) {
            console.log(roomName);
            io.sockets.in(roomName).
                emit('gameState', gameInstance);
        }
        function handleHostGame() {
            // room = makeid(4);
            // console.log(room);
            // games[room] = createGame();
            // // saves the room joined in handleJoinGame();
            // handleJoinGame(color, name, room);
        }
        function handleJoinGame(roomCode, gamerTag) {
            console.log("Client's id: " + client.id);
            var game = games.get(roomCode);
            if (game) {
                if (game.joinGame(new Player_js_1.Player(client.emit, client.id, gamerTag))) {
                    client.join(roomCode);
                    roomLookup.set(client.id, game);
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
        function handleVote(voteId) {
            game.voteFor(game.getPlayer(client.id), voteId);
        }
        function handleSubmitEntry(entryText, correctAnswer) {
            if (correctAnswer === void 0) { correctAnswer = ""; }
            game.submitEntry(game.getPlayer(client.id), entryText, correctAnswer);
        }
        function handleNext() {
            game.nextState(game.getPlayer(client.id));
        }
    };
    return ClientHander;
}());
var clientHandler = new ClientHander();
exports.clientHandler = clientHandler;
