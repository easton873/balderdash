import React from 'react'
import { FrontEndData } from './server/BalderdashGame';
import { nextFunc, NumPlayersNotAnsweredDisplay, ViewingControls } from './Shared';
import { Socket } from './Socket';
import { GetStoreState } from './Store';

const VoteButton: React.FC = () => {
    const voteForFunc = () => {
        Socket.instance.socket.emit('vote');
    }
    return (
        <button onClick={voteForFunc}>Vote</button>
    )
}

export const GuessingScreen = () => {
    const store : FrontEndData = GetStoreState();
    if (store.isTurn){
        return (
            <div className='child'>
                <ViewingControls/>
                <NumPlayersNotAnsweredDisplay numWaitingOn={store.players.length - 1}/>
                <br/>
                <button onClick={nextFunc}>
                    Done Voting
                </button>
            </div>
        )
    }
  return (
    
    <div className='child'>
        <VoteButton/>
    </div>
  )
}
