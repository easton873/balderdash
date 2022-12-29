import { useRef } from "react";
import React from 'react'
import { NavProps } from "./Props";

export const FindRoom: React.FC<NavProps> = ({socket, navFunc}) => {
    const roomCode = useRef<HTMLInputElement>(null);
    const gamerTag = useRef<HTMLInputElement>(null);

    function joinRoom() : void {
        const currRoomCode : string | null = roomCode.current !== null ? roomCode.current.value : null;
        const currGamerTag : string | null = gamerTag.current !== null ? gamerTag.current.value : null;
        socket.emit('joinGame', currRoomCode, currGamerTag);
    }

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
