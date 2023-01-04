import React from 'react'
import { FrontEndData } from './server/BalderdashGame';
import { ViewingControls } from './Shared';
import { Socket } from './Socket';
import { GetStoreState } from './Store';

export const ReadingScreen: React.FC = () => {
    const store : FrontEndData = GetStoreState();
    const doneFunc = () => {
        Socket.instance.socket.emit('next');
    }
    if (store.isTurn){
        return (
            <div className='child'>
                <ViewingControls/>
                <br/>
                <br/>
                <button onClick={doneFunc}>Done Reading</button>
            </div>
        )
    }
  return (
    <div className='child'>
        View Main Screen
    </div>
  )
}
