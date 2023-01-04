import React from 'react'
import { Props } from './Props'
import { Socket } from './Socket'

export const HostGame: React.FC<Props> = ({navFunc}) => {
    const hostGame = () => {
        console.log('hosting on front');
        Socket.instance.socket.emit('hostGame');
    }
  return (
    <div className='child'>
        <p>Welcome to Balderdash</p>
        <button onClick={hostGame}>Host Game</button>
        <br/>
        <button onClick={navFunc}>Back</button>
    </div>
  )
}
