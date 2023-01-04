"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalderdashGameStateProxy = exports.BalderdashGameState = void 0;
var shared_js_1 = require("./shared.js");
var BalderdashGameState = /** @class */ (function () {
    function BalderdashGameState() {
    }
    BalderdashGameState.prototype.nextStateReady = function (instance) {
        return true;
    };
    return BalderdashGameState;
}());
exports.BalderdashGameState = BalderdashGameState;
var BalderdashGameStateProxy = /** @class */ (function (_super) {
    __extends(BalderdashGameStateProxy, _super);
    function BalderdashGameStateProxy(state) {
        if (state === void 0) { state = new BalderdashWaitingState(); }
        var _this = _super.call(this) || this;
        _this.state = state;
        return _this;
    }
    BalderdashGameStateProxy.prototype.getStateName = function () {
        return this.state.getStateName();
    };
    BalderdashGameStateProxy.prototype.getStateId = function () {
        return this.state.getStateId();
    };
    BalderdashGameStateProxy.prototype.getState = function () {
        return this.state;
    };
    BalderdashGameStateProxy.prototype.setState = function (state) {
        this.state = state;
    };
    BalderdashGameStateProxy.prototype.playerJoin = function (instance, player) {
        return this.state.playerJoin(instance, player);
    };
    BalderdashGameStateProxy.prototype.toNextState = function (instance, player) {
        if (instance.confirmIsPlayersTurn(player) && this.state.nextStateReady(instance)) {
            this.state.toNextState(instance, player);
            instance.emitState();
            instance.resetPlayerAnswers();
        }
    };
    BalderdashGameStateProxy.prototype.readOrReceiveOrVote = function (instance, player, intendedState) {
        if (player.hasNotAnswered() && this.getStateId() == intendedState) {
            if (this.state.readOrReceiveOrVote(instance, player, intendedState)) {
                player.answer();
                instance.emitState();
                return true;
            }
        }
        return false;
    };
    BalderdashGameStateProxy.prototype.endGame = function (instance, player) {
        if (instance.confirmIsPlayersTurn(player)) {
            this.state.endGame(instance, player);
        }
    };
    return BalderdashGameStateProxy;
}(BalderdashGameState));
exports.BalderdashGameStateProxy = BalderdashGameStateProxy;
// ************************
// Actual states start here
// ************************
var BalderdashWaitingState = /** @class */ (function () {
    function BalderdashWaitingState() {
    }
    BalderdashWaitingState.prototype.getStateName = function () {
        return shared_js_1.WAITING_STATE_NAME;
    };
    BalderdashWaitingState.prototype.getStateId = function () {
        return shared_js_1.WAITING_STATE;
    };
    BalderdashWaitingState.prototype.nextStateReady = function (instance) {
        return instance.getNumPlayers() >= 2;
    };
    BalderdashWaitingState.prototype.playerJoin = function (instance, player) {
        if (instance.getNumPlayers() == 0) {
            instance.forceTurn(player);
        }
        instance.addPlayer(player);
        return true;
    };
    BalderdashWaitingState.prototype.toNextState = function (instance, _) {
        instance.setState(new BalderdashWritingState());
    };
    BalderdashWaitingState.prototype.readOrReceiveOrVote = function (instance, player, intendedState) {
        return false;
    };
    BalderdashWaitingState.prototype.endGame = function (instance, player) { };
    return BalderdashWaitingState;
}());
var BalderdashWritingState = /** @class */ (function () {
    function BalderdashWritingState(numSubmitted) {
        if (numSubmitted === void 0) { numSubmitted = 0; }
        this.numSubmitted = numSubmitted;
    }
    BalderdashWritingState.prototype.getStateName = function () {
        return shared_js_1.WRITING_STATE_NAME;
    };
    BalderdashWritingState.prototype.getStateId = function () {
        return shared_js_1.WRITING_STATE;
    };
    BalderdashWritingState.prototype.nextStateReady = function (instance) {
        return this.numSubmitted == instance.getNumPlayers();
    };
    BalderdashWritingState.prototype.playerJoin = function (instance, player) {
        instance.addPlayer(player);
        return true;
    };
    BalderdashWritingState.prototype.toNextState = function (instance, _) {
        instance.setState(new BalderdashReadingState(instance));
    };
    BalderdashWritingState.prototype.readOrReceiveOrVote = function (instance, player, intendedState) {
        this.numSubmitted++;
        return true;
    };
    BalderdashWritingState.prototype.endGame = function (instance, player) {
        instance.setStateEnd();
    };
    return BalderdashWritingState;
}());
var BalderdashReadingState = /** @class */ (function () {
    function BalderdashReadingState(instance, numRead) {
        if (numRead === void 0) { numRead = 1; }
        this.numRead = numRead;
        instance.emitToMainScreen();
    }
    BalderdashReadingState.prototype.getStateName = function () {
        return shared_js_1.READING_STATE_NAME;
    };
    BalderdashReadingState.prototype.getStateId = function () {
        return shared_js_1.READING_STATE;
    };
    BalderdashReadingState.prototype.nextStateReady = function (instance) {
        // Plus one because the player whose turn it is gets to
        // write one and also the correct one
        return this.numRead >= instance.getNumPlayers() + 1;
    };
    BalderdashReadingState.prototype.playerJoin = function (instance, player) {
        throw new Error("Method not implemented.");
    };
    BalderdashReadingState.prototype.toNextState = function (instance, _) {
        instance.setState(new BalderDashGuessingState());
    };
    BalderdashReadingState.prototype.readOrReceiveOrVote = function (instance, player, intendedState) {
        this.numRead++;
        return false;
    };
    BalderdashReadingState.prototype.endGame = function (instance, player) {
        instance.setStateEnd();
    };
    return BalderdashReadingState;
}());
var BalderDashGuessingState = /** @class */ (function () {
    function BalderDashGuessingState(numGuessed) {
        if (numGuessed === void 0) { numGuessed = 0; }
        this.numGuessed = numGuessed;
    }
    BalderDashGuessingState.prototype.getStateName = function () {
        return shared_js_1.GUESSING_STATE_NAME;
    };
    BalderDashGuessingState.prototype.getStateId = function () {
        return shared_js_1.GUESSING_STATE;
    };
    BalderDashGuessingState.prototype.nextStateReady = function (instance) {
        // one less than num players because the player whose turn
        // it is doesn't vote
        return this.numGuessed === instance.getNumPlayers() - 1;
    };
    BalderDashGuessingState.prototype.playerJoin = function (instance, player) {
        throw new Error("Method not implemented.");
    };
    BalderDashGuessingState.prototype.toNextState = function (instance, _) {
        instance.setState(new BalderdashViewScoresState(instance));
    };
    BalderDashGuessingState.prototype.readOrReceiveOrVote = function (instance, player, intendedState) {
        this.numGuessed++;
        return true;
    };
    BalderDashGuessingState.prototype.endGame = function (instance, player) {
        instance.setStateEnd();
    };
    return BalderDashGuessingState;
}());
var BalderdashViewScoresState = /** @class */ (function () {
    function BalderdashViewScoresState(instance) {
        instance.addScores();
    }
    BalderdashViewScoresState.prototype.getStateName = function () {
        return shared_js_1.SCORE_STATE_NAME;
    };
    BalderdashViewScoresState.prototype.getStateId = function () {
        return shared_js_1.SCORE_STATE;
    };
    BalderdashViewScoresState.prototype.nextStateReady = function (instance) {
        return true;
    };
    BalderdashViewScoresState.prototype.playerJoin = function (instance, player) {
        throw new Error("Method not implemented.");
    };
    BalderdashViewScoresState.prototype.toNextState = function (instance, _) {
        instance.setState(new BalderdashWritingState());
        instance.nextPlayersTurn();
    };
    BalderdashViewScoresState.prototype.readOrReceiveOrVote = function (instance, player, intendedState) {
        return false;
    };
    BalderdashViewScoresState.prototype.endGame = function (instance, player) {
        instance.setStateEnd();
    };
    return BalderdashViewScoresState;
}());
