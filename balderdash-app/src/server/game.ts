import { BalderdashGame } from "./BalderdashGame.js";
import { Player } from "./Player.js";
import { makeId } from "./shared.js";

const games : Map<string, BalderdashGame> = new Map<string, BalderdashGame>();
const roomLookup : Map<string, BalderdashGame> = new Map<string, BalderdashGame>();
const hosts : Map<string, Player> = new Map<string, Player>();

const confirmGame = (g : BalderdashGame | undefined) : BalderdashGame => {
    if (g){
        return g;
    }
    throw Error("Game is undefined");
}

const queryGame = (g : BalderdashGame | undefined) : BalderdashGame | null => {
    if (g){
        return g;
    }
    return null;
}

class ClientHander {
    handleClientActions(client: any, io: any){
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
    
        function emitGameState(roomName : string, gameInstance : BalderdashGame) : void {
            console.log('emitting game to room ' + roomName);
            gameInstance.emitState();
            //io.sockets.in(roomName).emit('gameState', gameInstance.exportState(player));
        }
    
        function handleHostGame(){
            if (hosts.get(client.id)){
                console.log('already hosting');
                return;
            }
            const room = makeId(4);
            console.log(room);
            const host : Player = new Player(client, "Host", room);
            const game : BalderdashGame = new BalderdashGame(host);
            games.set(room, game);
            hosts.set(client.id, host);
            client.emit("hosting", room);
            game.emitState();
        }

        function handleReadNext(){
            const game : BalderdashGame = confirmGame(roomLookup.get(client.id));
            game.readEntry(game.getPlayer(client.id));
            game.emitToMainScreen();
        }

        function handleReadPrev(){

        }
    
        function handleJoinGame(roomCode : string, gamerTag : string){
            roomCode = roomCode.toLowerCase();
            console.log("Client's id: " + client.id);
            const game : BalderdashGame | null = queryGame(games.get(roomCode));
            if (roomLookup.get(client.id)){
                console.log('already in a game');
                return;
            }
            if (game){
                const player : Player = new Player(client, gamerTag, roomCode);
                if (game.joinGame(player)){
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

        function handleVote() : void {
            const game : BalderdashGame = confirmGame(roomLookup.get(client.id));
            game.voteForCurrent(game.getPlayer(client.id));
        }

        function handleSubmitEntry(entryText : string, correctAnswer : string = "") : void {
            console.log("submitting");
            const game : BalderdashGame = confirmGame(roomLookup.get(client.id));
            game.submitEntry(game.getPlayer(client.id), entryText, correctAnswer);
            client.emit('success');
        }

        function handleNext() : void {
            console.log('next');
            const game : BalderdashGame = confirmGame(roomLookup.get(client.id));
            game.nextState(game.getPlayer(client.id));
        }
    }
}

const clientHandler : ClientHander = new ClientHander();
export {clientHandler};