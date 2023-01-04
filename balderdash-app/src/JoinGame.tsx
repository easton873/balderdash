import React, { useState } from 'react'
import { FindRoom } from './FindRoom';
import { HostGame } from './HostGame';

const JOIN_SCREEN = 0
const HOST_SCREEN = 1;
const FIND_ROOM_SCREEN = 2;

export const JoinGame: React.FC = () => {
    const [whichScreen, setWhichScreen] = useState(JOIN_SCREEN);
    const createNavFunc = (intendedScreen : number) : () => void =>{
        return () => {setWhichScreen(intendedScreen)}
    }
    switch(whichScreen){
        case JOIN_SCREEN:
            return (
                <div className='child'>
                    <p>Welcome to Balderdash</p>
                    <button onClick={createNavFunc(HOST_SCREEN)}>Host Game</button>
                    <br/>
                    <button onClick={createNavFunc(FIND_ROOM_SCREEN)}>Join Game</button>
                </div>
            )
        case HOST_SCREEN:
            return (
                <HostGame navFunc={createNavFunc(JOIN_SCREEN)}/>
            )
        case FIND_ROOM_SCREEN:
            return (
                <FindRoom navFunc={createNavFunc(JOIN_SCREEN)}/>
            )
        default:
            return (
                <div>undefined state</div>
            )
    }
  
}
