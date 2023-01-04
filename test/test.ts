import * as assert from "assert";
import { BalderdashGame } from "../balderdash-app/src/server/BalderdashGame";
import { Player } from "../balderdash-app/src/server/Player";
import { GUESSING_STATE, READING_STATE, SCORE_STATE, WAITING_STATE_NAME, WRITING_STATE, WRITING_STATE_NAME } from "../balderdash-app/src/server/shared";
import {Entry} from "../balderdash-app/src/server/Entry";
import {makeId} from "../balderdash-app/src/server/shared";

const mockSocket : (id : string) => any = (id : string) => {
  return{
    emit: (...args : any[])=>{},
    id: id
  }
};
const mockHost : Player = new Player(mockSocket("host"), "host", "abcde")
const roomCode: string = 'abcd'

describe('Test test', function() {
  it('a test', function() {
    assert.strictEqual(1, 1 + 0);
  });
});

describe('Test the game', function() {
  it('Play game test', function() {
    const game : BalderdashGame = new BalderdashGame(mockHost);
    let player1 = new Player(mockSocket("1"), "Easton", roomCode);
    let player2 = new Player(mockSocket("2"), "Krishelle", roomCode);
    let cantProceedTest = (intendedState) => {
      game.nextState(player1);
      assert.strictEqual(intendedState, game.getState().getStateId());
      game.nextState(player2)
      assert.strictEqual(intendedState, game.getState().getStateId());
      game.nextState(player1);
      assert.strictEqual(intendedState, game.getState().getStateId());
    }
    game.joinGame(player1);
    assert.strictEqual(1, game.getNumPlayers());
    assert.strictEqual(player1, game.currTurn);
    game.nextState(player1);
    assert.strictEqual(WAITING_STATE_NAME, game.getState().getStateName());
    game.joinGame(player2);
    assert.strictEqual(2, game.getNumPlayers());
    game.nextState(player2);
    assert.strictEqual(WAITING_STATE_NAME, game.getState().getStateName());
    game.nextState(player1);
    assert.strictEqual(true, game.confirmIsPlayersTurn(player1));
    assert.strictEqual(false, game.confirmIsPlayersTurn(player2));
    assert.strictEqual(WRITING_STATE_NAME, game.getState().getStateName());
    assert.strictEqual(WRITING_STATE, game.getState().getStateId());
    assert.strictEqual(true, game.confirmIsPlayersTurn(player1));
    assert.strictEqual(false, game.confirmIsPlayersTurn(player2));
    cantProceedTest(WRITING_STATE)
    game.submitEntry(player1, "This is a funny word", "Here is the right answer");
    assert.strictEqual(2, game.entries.length);
    game.nextState(player1);
    assert.strictEqual(WRITING_STATE, game.getState().getStateId());
    game.submitEntry(player1, "An answer that shouldn't be accepted");
    assert.strictEqual(2, game.entries.length);
    game.nextState(player1);
    assert.strictEqual(WRITING_STATE, game.getState().getStateId());
    game.submitEntry(player2, "my actual answer", 'ignored');
    assert.strictEqual(3, game.entries.length);
    assert.strictEqual(READING_STATE, game.getState().getStateId());
    cantProceedTest(READING_STATE);
    game.readEntry(player2);
    game.nextState(player1);
    assert.strictEqual(true, player2.hasNotAnswered());
    assert.strictEqual(READING_STATE, game.getState().getStateId());
    game.readEntry(player1);
    game.nextState(player1);
    assert.strictEqual(true, player1.hasNotAnswered());
    assert.strictEqual(READING_STATE, game.getState().getStateId());
    game.readEntry(player1);
    game.nextState(player1);
    assert.strictEqual(true, player1.hasNotAnswered());
    assert.strictEqual(GUESSING_STATE, game.getState().getStateId());
    cantProceedTest(GUESSING_STATE);
    let rightAnswerId : number;
    for (let i = 0; i < game.entries.length; ++i){
      if (game.entries[i].correct){
        rightAnswerId = game.entries[i].id;
      }
    }
    game.voteFor(player2, rightAnswerId);
    game.nextState(player1);
    assert.strictEqual(SCORE_STATE, game.getState().getStateId());
    assert.strictEqual(player2.score, 1);
    assert.strictEqual(player1.score, 0);
    game.nextState(player2);
    assert.strictEqual(SCORE_STATE, game.getState().getStateId());
    game.nextState(player1);
    assert.strictEqual(WRITING_STATE, game.getState().getStateId());
    assert.strictEqual(game.confirmIsPlayersTurn(player1), false);
    assert.strictEqual(game.confirmIsPlayersTurn(player2), true);
  });
});

describe('Test if actions can be performed in the correct state', () => {
  let game : BalderdashGame;
  let player1;
  let player2;
  let player3;
  beforeEach(() => {
    game = new BalderdashGame(mockHost);
    player1 = new Player(mockSocket("1"), "Easton", roomCode);
    player2 = new Player(mockSocket("2"), "Krishelle", roomCode);
    player3 = new Player(mockSocket("3"), "Kimball", roomCode);
    game.joinGame(player2);
    game.joinGame(player1);
  })
  it ('Submit an answer', () => {
    assert.strictEqual(true, player1.hasNotAnswered());
    game.nextState(player2);
    assert.strictEqual(true, player1.hasNotAnswered());
    game.voteFor(player1, 1);
    assert.strictEqual(true, player1.hasNotAnswered());
  });
});

describe('Test Entries', () => {
  it('Id increments', () => {
    let player1 : Player = new Player(mockSocket("1"), "jimmy", roomCode);
    let player2 : Player = new Player(mockSocket("2"), "meep", roomCode);
    const e1 : Entry = new Entry("howdy", player1);
    const e2 : Entry = new Entry("this answer blows", player2);
    assert.strictEqual(e1.id + 1, e2.id);
  })
})

describe('Random id test', () => {
  it('random id works', () => {
    for(let i = 0; i < 10000; ++i){
      makeId(10);
    }
  })
})