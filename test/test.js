"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var BalderdashGame_1 = require("../balderdash-app/src/server/BalderdashGame");
var Player_1 = require("../balderdash-app/src/server/Player");
var shared_1 = require("../balderdash-app/src/server/shared");
var Entry_1 = require("../balderdash-app/src/server/Entry");
var shared_2 = require("../balderdash-app/src/server/shared");
var mockSocket = function (id) {
    return {
        emit: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
        },
        id: id
    };
};
var mockHost = new Player_1.Player(mockSocket("host"), "host", "abcde");
var roomCode = 'abcd';
describe('Test test', function () {
    it('a test', function () {
        assert.strictEqual(1, 1 + 0);
    });
});
describe('Test the game', function () {
    it('Play game test', function () {
        var game = new BalderdashGame_1.BalderdashGame(mockHost);
        var player1 = new Player_1.Player(mockSocket("1"), "Easton", roomCode);
        var player2 = new Player_1.Player(mockSocket("2"), "Krishelle", roomCode);
        var cantProceedTest = function (intendedState) {
            game.nextState(player1);
            assert.strictEqual(intendedState, game.getState().getStateId());
            game.nextState(player2);
            assert.strictEqual(intendedState, game.getState().getStateId());
            game.nextState(player1);
            assert.strictEqual(intendedState, game.getState().getStateId());
        };
        game.joinGame(player1);
        assert.strictEqual(1, game.getNumPlayers());
        assert.strictEqual(player1, game.currTurn);
        game.nextState(player1);
        assert.strictEqual(shared_1.WAITING_STATE_NAME, game.getState().getStateName());
        game.joinGame(player2);
        assert.strictEqual(2, game.getNumPlayers());
        game.nextState(player2);
        assert.strictEqual(shared_1.WAITING_STATE_NAME, game.getState().getStateName());
        game.nextState(player1);
        assert.strictEqual(true, game.confirmIsPlayersTurn(player1));
        assert.strictEqual(false, game.confirmIsPlayersTurn(player2));
        assert.strictEqual(shared_1.WRITING_STATE_NAME, game.getState().getStateName());
        assert.strictEqual(shared_1.WRITING_STATE, game.getState().getStateId());
        assert.strictEqual(true, game.confirmIsPlayersTurn(player1));
        assert.strictEqual(false, game.confirmIsPlayersTurn(player2));
        cantProceedTest(shared_1.WRITING_STATE);
        game.submitEntry(player1, "This is a funny word", "Here is the right answer");
        assert.strictEqual(2, game.entries.length);
        game.nextState(player1);
        assert.strictEqual(shared_1.WRITING_STATE, game.getState().getStateId());
        game.submitEntry(player1, "An answer that shouldn't be accepted");
        assert.strictEqual(2, game.entries.length);
        game.nextState(player1);
        assert.strictEqual(shared_1.WRITING_STATE, game.getState().getStateId());
        game.submitEntry(player2, "my actual answer", 'ignored');
        assert.strictEqual(3, game.entries.length);
        assert.strictEqual(shared_1.READING_STATE, game.getState().getStateId());
        cantProceedTest(shared_1.READING_STATE);
        game.readEntry(player2);
        game.nextState(player1);
        assert.strictEqual(true, player2.hasNotAnswered());
        assert.strictEqual(shared_1.READING_STATE, game.getState().getStateId());
        game.readEntry(player1);
        game.nextState(player1);
        // assert.strictEqual(true, player1.hasNotAnswered());
        // assert.strictEqual(READING_STATE, game.getState().getStateId());
        // game.readEntry(player1);
        // game.nextState(player1);
        assert.strictEqual(true, player1.hasNotAnswered());
        assert.strictEqual(shared_1.READING_STATE, game.getState().getStateId());
        game.readEntry(player1);
        game.nextState(player1);
        assert.strictEqual(true, player1.hasNotAnswered());
        assert.strictEqual(shared_1.GUESSING_STATE, game.getState().getStateId());
        cantProceedTest(shared_1.GUESSING_STATE);
        var rightAnswerId;
        for (var i = 0; i < game.entries.length; ++i) {
            if (game.entries[i].correct) {
                rightAnswerId = game.entries[i].id;
            }
        }
        game.voteFor(player2, rightAnswerId);
        game.nextState(player1);
        assert.strictEqual(shared_1.SCORE_STATE, game.getState().getStateId());
        assert.strictEqual(player2.score, 1);
        assert.strictEqual(player1.score, 0);
        game.nextState(player2);
        assert.strictEqual(shared_1.SCORE_STATE, game.getState().getStateId());
        game.nextState(player1);
        assert.strictEqual(shared_1.WRITING_STATE, game.getState().getStateId());
        assert.strictEqual(game.confirmIsPlayersTurn(player1), false);
        assert.strictEqual(game.confirmIsPlayersTurn(player2), true);
    });
});
describe('Test if actions can be performed in the correct state', function () {
    var game;
    var player1;
    var player2;
    var player3;
    beforeEach(function () {
        game = new BalderdashGame_1.BalderdashGame(mockHost);
        player1 = new Player_1.Player(mockSocket("1"), "Easton", roomCode);
        player2 = new Player_1.Player(mockSocket("2"), "Krishelle", roomCode);
        player3 = new Player_1.Player(mockSocket("3"), "Kimball", roomCode);
        game.joinGame(player2);
        game.joinGame(player1);
    });
    it('Submit an answer', function () {
        assert.strictEqual(true, player1.hasNotAnswered());
        game.nextState(player2);
        assert.strictEqual(true, player1.hasNotAnswered());
        game.voteFor(player1, 1);
        assert.strictEqual(true, player1.hasNotAnswered());
    });
});
describe('Test Entries', function () {
    it('Id increments', function () {
        var player1 = new Player_1.Player(mockSocket("1"), "jimmy", roomCode);
        var player2 = new Player_1.Player(mockSocket("2"), "meep", roomCode);
        var e1 = new Entry_1.Entry("howdy", player1);
        var e2 = new Entry_1.Entry("this answer blows", player2);
        assert.strictEqual(e1.id + 1, e2.id);
    });
});
describe('Random id test', function () {
    it('random id works', function () {
        for (var i = 0; i < 10000; ++i) {
            (0, shared_2.makeId)(10);
        }
    });
});
