import React, { useState } from 'react'
import { NumPlayersNotAnsweredDisplay } from './Shared';
import { PlayerList } from './Shared';
import { FrontEndData } from './server/BalderdashGame';
import { GUESSING_STATE, READING_STATE, SCORE_STATE, WAITING_STATE, WRITING_STATE } from './server/shared';
import { Socket } from './Socket';
import { GetRoomCode, GetStoreState } from './Store'

const RoomCodeDisplay: React.FC = () => {
    const roomCode: string = GetRoomCode();
    return (
        <div>
            Room Code: <h1>{roomCode}</h1>
        </div>
    )
}

interface AnswerProps{
    answer : string;
}

const AnswerDisplay: React.FC<AnswerProps> = ({answer}) => {
    return (
        <div>
            <h1>{answer}</h1>
        </div>
    )
}

const VotesDisplay: React.FC = () => {
    const store : FrontEndData = GetStoreState();
    return (
        <div>
            <h3>Votes</h3>
            {store.entriesWithVotes.map(entry => {
                return <p>{entry.author}: {entry.voters.map(voter => {
                    return <span>{voter} </span>;
                })}</p>;
            })}
        </div>
    );
}

const PlayersScoreDisplay: React.FC = () => {
    const store : FrontEndData = GetStoreState();
    return (
        <div>
            <h3>Scores</h3>
            {store.players.map(player => {
                return <p>{player.name}: {player.score}</p>
            })}
        </div>
    )
}

const ScoreScreenDisplay: React.FC = () => {
    return (
        <div>
            <VotesDisplay/>
            <PlayersScoreDisplay/>
        </div>
    )
}

const HostScreenState: React.FC = () => {
    const store : FrontEndData = GetStoreState();
    const [answer, setAnswer] = useState("");
    Socket.instance.socket.on("read", (newAnswer : string) => {
        setAnswer(newAnswer);
    })
    switch(store.state){
        case WAITING_STATE:
            return <PlayerList/>
        case WRITING_STATE:
            return <NumPlayersNotAnsweredDisplay numWaitingOn={store.players.length}/>
        case GUESSING_STATE:
        case READING_STATE:
            return <AnswerDisplay answer={answer}/>
        case SCORE_STATE:
            return <ScoreScreenDisplay/>
        default:
            return (
                <div>Undefined Screen State</div>
            )
    }
}

export const HostScreen: React.FC = () => {
  return (
    <div className='child'>
        <RoomCodeDisplay/>
        <HostScreenState/>
    </div>
  )
}
