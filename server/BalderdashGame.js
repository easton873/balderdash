"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalderdashGame = void 0;
var BalderDashGameState_js_1 = require("./BalderDashGameState.js");
var Entry_js_1 = require("./Entry.js");
var shared_js_1 = require("./shared.js");
var BalderdashGame = /** @class */ (function () {
    function BalderdashGame(players, gameState, _currTurn, _entries) {
        if (players === void 0) { players = new Map(); }
        if (gameState === void 0) { gameState = new BalderDashGameState_js_1.BalderdashGameStateProxy(); }
        if (_currTurn === void 0) { _currTurn = null; }
        if (_entries === void 0) { _entries = []; }
        this.players = players;
        this.gameState = gameState;
        this._currTurn = _currTurn;
        this._entries = _entries;
    }
    Object.defineProperty(BalderdashGame.prototype, "entries", {
        get: function () {
            return this._entries;
        },
        enumerable: false,
        configurable: true
    });
    BalderdashGame.prototype.getPlayer = function (id) {
        return this.players.get(id);
    };
    BalderdashGame.prototype.getState = function () {
        return this.gameState;
    };
    BalderdashGame.prototype.setState = function (nextState) {
        this.gameState.setState(nextState);
    };
    BalderdashGame.prototype.joinGame = function (player) {
        return this.gameState.playerJoin(this, player);
    };
    BalderdashGame.prototype.addPlayer = function (player) {
        this.players.set(player.id, player);
    };
    BalderdashGame.prototype.getNumPlayers = function () {
        return this.players.size;
    };
    BalderdashGame.prototype.forceTurn = function (player) {
        this._currTurn = player;
    };
    Object.defineProperty(BalderdashGame.prototype, "currTurn", {
        get: function () {
            return this._currTurn;
        },
        enumerable: false,
        configurable: true
    });
    BalderdashGame.prototype.nextPlayersTurn = function () {
        var _this = this;
        var next = false;
        this._entries = [];
        this.players.forEach(function (player, id) {
            if (next) {
                _this._currTurn = player;
                next = false;
                return;
            }
            else if (player == _this._currTurn) {
                next = true;
            }
        });
        if (next) {
            this._currTurn = __spreadArray([], __read(this.players.values()), false)[0];
        }
    };
    BalderdashGame.prototype.setStateEnd = function () {
        this.players = new Map();
        this.gameState = new BalderDashGameState_js_1.BalderdashGameStateProxy();
        this._currTurn = null;
    };
    BalderdashGame.prototype.confirmIsPlayersTurn = function (player) {
        return player == this._currTurn;
    };
    BalderdashGame.prototype.emitState = function () {
        var _this = this;
        this.players.forEach(function (player, id) {
            player.emitState(_this);
        });
    };
    BalderdashGame.prototype.getEntry = function (id) {
        for (var i = 0; i < this._entries.length; ++i) {
            if (this._entries[i].id == id) {
                return this._entries[i];
            }
        }
        return null;
    };
    BalderdashGame.prototype.voteFor = function (player, id) {
        if (!this.confirmIsPlayersTurn(player) && this.gameState.readOrReceiveOrVote(this, player, shared_js_1.GUESSING_STATE)) {
            var entry = this.getEntry(id);
            if (entry) {
                entry.voteFor(player);
            }
        }
    };
    BalderdashGame.prototype.submitEntry = function (player, entryText, correctAnswer) {
        if (correctAnswer === void 0) { correctAnswer = ""; }
        if (this.gameState.readOrReceiveOrVote(this, player, shared_js_1.WRITING_STATE)) {
            this._entries.push(new Entry_js_1.Entry(entryText, player));
            if (this.confirmIsPlayersTurn(player)) {
                this._entries.push(new Entry_js_1.Entry(correctAnswer, player, true));
            }
            if (this.gameState.nextStateReady(this)) {
                this._currTurn.socket("all received");
            }
        }
    };
    BalderdashGame.prototype.readEntry = function (player) {
        if (this.confirmIsPlayersTurn(player)) {
            this.gameState.readOrReceiveOrVote(this, player, shared_js_1.READING_STATE);
        }
        if (this.gameState.nextStateReady(this)) {
            this._currTurn.socket("all received");
        }
    };
    BalderdashGame.prototype.addScores = function () {
        this._entries.forEach(function (entry) {
            entry.addPoints();
        });
    };
    BalderdashGame.prototype.nextState = function (player) {
        this.gameState.toNextState(this, player);
    };
    BalderdashGame.prototype.resetPlayerAnswers = function () {
        this.players.forEach(function (player, _) {
            player.resetAnswered();
        });
    };
    return BalderdashGame;
}());
exports.BalderdashGame = BalderdashGame;
