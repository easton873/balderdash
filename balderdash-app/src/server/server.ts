import { clientHandler } from "./game";

const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    });

const path = require('path');

const PORT = process.env.PORT || 8080;

app.use( express.static(path.resolve('./balderdash-app/build/')));

app.get('/', function(req : any, res : any) {
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

io.on('connection', (client : any) => {
    clientHandler.handleClientActions(client, io);
});
