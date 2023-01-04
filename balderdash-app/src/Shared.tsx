import React from 'react'
import { FEPlayer, FrontEndData } from './server/BalderdashGame'
import { Socket } from './Socket';
import { GetStoreState } from './Store';

export const PlayerList = () => {
    const gameState : FrontEndData = GetStoreState();
  return (
    <div>
        <h3>Current Players:</h3>
    {gameState.players.map(player => {
        return <p key={player.name}>{player.name}</p>
    })}
    </div>
  )
}

interface NumPlayersNotAnsweredDisplayProps{
  numWaitingOn: number;
}

export const NumPlayersNotAnsweredDisplay: React.FC<NumPlayersNotAnsweredDisplayProps> = ({numWaitingOn}) => {
  const store : FrontEndData = GetStoreState();
  return <p>Waiting on {numWaitingOn - store.players.reduce((sum : number, val : FEPlayer) => {return sum + (val.answered ? 1 : 0);}, 0)} players</p>
}

export const nextFunc = () => {
  Socket.instance.socket.emit('next');
}

export const ViewingControls: React.FC = () => {
  const nextFunc = () => {
      Socket.instance.socket.emit('readNext');
  }
  return (
      <div>
          <button>Previous</button>
          &nbsp;
          <button onClick={nextFunc}>Next</button>
      </div>
  )
}