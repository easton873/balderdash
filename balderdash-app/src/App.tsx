import React from 'react';
import './App.css';

import { GUESSING_STATE, READING_STATE, SCORE_STATE, WAITING_STATE, WRITING_STATE } from './server/shared';
import { JoinGame } from './JoinGame';
import { FrontEndData } from './server/BalderdashGame';
import { setStoreState, GetStoreState, setRoomCode } from './Store';
import { Socket } from './Socket';
import { WritingScreen } from './WritingScreen';
import { ReadingScreen } from './ReadingScreen';
import { HostScreen } from './HostScreen';
import { GuessingScreen } from './GuessingScreen';
import { ScoreScreen } from './ScoreScreen';

Socket.init();

function App() {
  const store : FrontEndData = GetStoreState();
  Socket.instance.socket.on('gameState', (gameState : FrontEndData)=>{
    console.log(gameState);
    setStoreState(gameState);
    //setGameState(Store.instance.data)
  });
  Socket.instance.socket.on('hosting', (room : string)=>{
    setRoomCode(room);
  });
  if (store.isHost){
    return (
      <HostScreen/>
    )
  }
  switch(store.state){
    case WAITING_STATE:
      return (
        <div>
          <JoinGame/>
        </div>
      );
    case WRITING_STATE:
      return (
        <WritingScreen/>
      );
    case READING_STATE:
      return (
        <ReadingScreen/>
      )
    case GUESSING_STATE:
      return (
        <GuessingScreen/>
      )
    case SCORE_STATE:
      return (
        <ScoreScreen/>
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
