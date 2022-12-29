import React from 'react'
import { NavProps } from './Props'

export const HostGame: React.FC<NavProps> = ({socket, navFunc}) => {
    const hostGame = () => {
        console.log('hosting on front');
        socket.emit('hostGame');
    }
  return (
    <div className='child'>
        <p>Welcome to Balderdash</p>
        <br/>
        <button onClick={hostGame}>Host Game</button>
        <br/>
        <button onClick={navFunc}>Back</button>
    </div>
  )
}
