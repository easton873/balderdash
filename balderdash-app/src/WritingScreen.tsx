import React, { useRef, useState } from 'react'
import { FrontEndData } from './server/BalderdashGame';
import { NumPlayersNotAnsweredDisplay } from './Shared';
import { Socket } from "./Socket"
import { GetStoreState } from './Store';

interface Props{
  submitFunc : () => void;
}

const SubmitButton: React.FC<Props> = ({submitFunc}) => {
  return (
    <button onClick={submitFunc}>Submit</button>
  )
}

export const WritingScreen : React.FC = () => {
  const [isSent, setIsSent] = useState(false);
  const answerBox = useRef<HTMLInputElement>(null);
  const correctAnswer = useRef<HTMLInputElement>(null);
  const store : FrontEndData = GetStoreState();
  Socket.instance.socket.on('success', () => {
    setIsSent(true);
  });
  if (isSent){
    return (
      <div className='child'>Waiting for everybody else to submit</div>
    )
  }
  else {
    const submitAnswer = () : void => {
      const currAnswer : string = answerBox.current !== null ? answerBox.current.value : "";
      const currCorrectAnswer : string = correctAnswer.current !== null ? correctAnswer.current.value : "";
      if (currAnswer === "" || (currCorrectAnswer === "" && store.isTurn)){
        alert("Must Type Something");
        return;
      }
      Socket.instance.socket.emit('submit', currAnswer, currCorrectAnswer);
    }
    if (!store.isTurn){
      return (
        <div className='child'>
          <p>Submit Your Answer Here:</p>
          <input ref={answerBox} type="text"></input>
          <br/>
          <SubmitButton submitFunc={submitAnswer}/>
        </div>
      )
    }
    else {
      return (
        <div className='child'>
          <h2>It's your turn to write the correct answer!</h2>
          <p>Correct Answer Here:</p>
          <input ref={correctAnswer} type="text"></input>
          <br/>
          <p>And submit Your Answer Here:</p>
          <input ref={answerBox} type="text"></input>
          <br/>
          <SubmitButton submitFunc={submitAnswer}/>
        </div>
      )
    }
  }
}
