const games = {};
const roomLookup = {};

class ClientHander {
    handleClientActions(client: any, io: any){
        console.log("guy connected");
        client.on('hostGame', handleHostGame);
        client.on('joinGame', handleJoinGame);
        client.on('disconnect', handlDisconnect);
    
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
    
        function handleHostGame(){
            // room = makeid(4);
            // console.log(room);
            // games[room] = createGame();
            // // saves the room joined in handleJoinGame();
            // handleJoinGame(color, name, room);
        }
    
        function handleJoinGame(color, name, room){
            // console.log("Client's id: " + client.id);
            // const game = games[room];
            // if (game){
            //     client.join(room);
            //     roomLookup[client.id] = room;
            //     game.players[client.id] = createNewPlayer(name, color, client.id);
            //     game.stocks[client.id] = 5;
            //     game.market[client.id] = 0;
    
            //     // set every players stocks to zero of your stock
            //     for (var key in game.players){
            //         if (key != client.id){
            //             game.players[key].stocks[client.id] = 0;
            //             game.players[client.id].stocks[key] = 0;
            //         }
            //     }
    
            //     client.emit('init', game, client.id, room);
            //     emitGameState(room, game);
            // }
            // else {
            //     console.log("Room doesn't exist");
            // }
        }
    
        function handlDisconnect(){
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
    }
}

const clientHandler : ClientHander = new ClientHander();
export {clientHandler};