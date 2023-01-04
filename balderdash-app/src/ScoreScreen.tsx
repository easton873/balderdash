import React from 'react'
import { FrontEndData } from './server/BalderdashGame';
import { nextFunc } from './Shared';
import { GetStoreState } from './Store';

const PlayerScoreDisplay: React.FC = () => {
    const store : FrontEndData = GetStoreState();
    return (
        <div>
        You have {store.currPlayer.score} point(s)
        </div>
    )
}

export const ScoreScreen: React.FC = () => {
    const store : FrontEndData = GetStoreState();
    if (store.isTurn){
        return (
            <div className='child'>
                <PlayerScoreDisplay/>
                <button onClick={nextFunc}>Next Turn</button>
            </div>
        )
    }
  return (
    <div className='child'>
        <PlayerScoreDisplay/>
    </div>
  )
}
