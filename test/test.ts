import * as assert from "assert";
import { BalderdashGame } from "../server/BalderdashGame";
import { Player } from "../server/Player";
import { GUESSING_STATE, READING_STATE, SCORE_STATE, WAITING_STATE_NAME, WRITING_STATE, WRITING_STATE_NAME } from "../server/shared";
import {Entry} from "../server/Entry";
import {makeId} from "../server/shared";

const mockSocket = (x: any, y: any)=>{};

describe('Test test', function() {
  it('a test', function() {
    assert.strictEqual(1, 1 + 0);
  });
});

describe('Test the game', function() {
  it('Play game test', function() {
    const game : BalderdashGame = new BalderdashGame();
    let player1 = new Player(mockSocket, "abc", "Easton");
    let player2 = new Player(mockSocket, "def", "Krishelle");
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
    game.nextState(player2);
    assert.strictEqual(WRITING_STATE, game.getState().getStateId());
    game.nextState(player1);
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
    game = new BalderdashGame();
    player1 = new Player(mockSocket, "abc", "Easton");
    player2 = new Player(mockSocket, "def", "Krishelle");
    player3 = new Player(mockSocket, "123", "Kimball");
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
    let player1 : Player = new Player(mockSocket, "jimmy", "jimmy");
    let player2 : Player = new Player(mockSocket, "meep", "meep");
    const e1 : Entry = new Entry("howdy", player1);
    const e2 : Entry = new Entry("this answer blows", player2);
    assert.strictEqual(e1.id + 1, e2.id);
  })
})

describe('Random id test', () => {
  it('random id works', () => {
    for(let i = 0; i < 100000; ++i){
      makeId(10);
    }
  })
})