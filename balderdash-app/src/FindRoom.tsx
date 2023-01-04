import { useRef } from "react";
import React from 'react'
import { Props } from "./Props";
import { GetStoreState } from "./Store";
import { FrontEndData } from "./server/BalderdashGame";
import { PlayerList } from "./Shared";
import { Socket } from "./Socket";

export const FindRoom: React.FC<Props> = ({navFunc}) => {
    const gameState : FrontEndData = GetStoreState()  ;
    const roomCode = useRef<HTMLInputElement>(null);
    const gamerTag = useRef<HTMLInputElement>(null);

    const joinRoom = () : void => {
        const currRoomCode : string | null = roomCode.current !== null ? roomCode.current.value : null;
        const currGamerTag : string | null = gamerTag.current !== null ? gamerTag.current.value : null;
        Socket.instance.socket.emit('joinGame', currRoomCode, currGamerTag);
    }

    const startGame = () : void => {
      Socket.instance.socket.emit('next');
    }

    if (gameState.hasJoined){
      if (gameState.isTurn){
        return (
          <div className="child">
            <PlayerList/>
            <button onClick={startGame}>Start Game</button>
          </div>
        )
      }
      return (
        <div className="child">
          <PlayerList/>
          Waiting for Host to start
        </div>
      )
    }
    else {
      return (
        <div className="child">
            <p>Room Code</p>
            <input ref={roomCode} type="text"></input>
            <p>Name</p>
            <input ref={gamerTag} type="text"></input>
            <br/>
            <button onClick={joinRoom}>Join Game</button>
            <br/>
            <button onClick={navFunc}>Back</button>
        </div>
      )
    }
}
