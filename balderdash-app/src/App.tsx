import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client';
import { GUESSING_STATE, READING_STATE, SCORE_STATE, WAITING_STATE, WRITING_STATE } from './shared';
import { JoinGame } from './JoinGame';

const socket = io('http://localhost:8080');

function App() {
  const [gameState, setGameState] = useState(WAITING_STATE);
  socket.on('gameState', (gameState)=>{setGameState(gameState)});
  switch(gameState){
    case WAITING_STATE:
      return (
        <div>
          <JoinGame socket={socket}/>
        </div>
      );
    case WRITING_STATE:
      return (
        <div>
          Writing State
        </div>
      );
    case READING_STATE:
      return (
        <div>
          Reading State
        </div>
      )
    case GUESSING_STATE:
      return (
        <div>
          Guessing State
        </div>
      )
    case SCORE_STATE:
      return (
        <div>
          Score state
        </div>
      )
    default:
      return (
        <div>
          Unknown State
        </div>
      )
  }
  
}

export default App;
