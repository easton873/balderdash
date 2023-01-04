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
exports.FrontEndData = exports.FEEntry = exports.FEPlayer = exports.BalderdashGame = void 0;
var BalderDashGameState_js_1 = require("./BalderDashGameState.js");
var Entry_js_1 = require("./Entry.js");
var shared_js_1 = require("./shared.js");
// export interface BalderdashGameController{
//     nextState(player : Player);
//     joinGame(player : Player);
//     submitEntry(player : Player, entryText : string, extraText : string);
//     readEntry(player : Player);
//     voteForCurrent(player: Player);
// }
var BalderdashGame = /** @class */ (function () {
    function BalderdashGame(host, players, gameState, _currTurn, _entries, _currEntry) {
        if (players === void 0) { players = new Map(); }
        if (gameState === void 0) { gameState = new BalderDashGameState_js_1.BalderdashGameStateProxy(); }
        if (_currTurn === void 0) { _currTurn = null; }
        if (_entries === void 0) { _entries = []; }
        if (_currEntry === void 0) { _currEntry = 0; }
        this.host = host;
        this.players = players;
        this.gameState = gameState;
        this._currTurn = _currTurn;
        this._entries = _entries;
        this._currEntry = _currEntry;
    }
    Object.defineProperty(BalderdashGame.prototype, "entries", {
        get: function () {
            return this._entries;
        },
        enumerable: false,
        configurable: true
    });
    BalderdashGame.prototype.getCurrEntry = function () {
        return this._entries[this._currEntry];
    };
    BalderdashGame.prototype.getPlayer = function (id) {
        var player = this.players.get(id);
        if (player) {
            return player;
        }
        throw Error("Player undefined");
    };
    BalderdashGame.prototype.getPlayers = function () {
        return this.players;
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
            else if (player === _this._currTurn) {
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
        return player === this._currTurn;
    };
    BalderdashGame.prototype.emitToMainScreen = function () {
        this.host.emitRead(this.getCurrEntry().content);
    };
    BalderdashGame.prototype.emitState = function () {
        var _this = this;
        this.host.emitState(this);
        __spreadArray([], __read(this.players.values()), false).forEach(function (player) {
            player.emitState(_this);
        });
    };
    BalderdashGame.prototype.getEntry = function (id) {
        for (var i = 0; i < this._entries.length; ++i) {
            if (this._entries[i].id === id) {
                return this._entries[i];
            }
        }
        return null;
    };
    BalderdashGame.prototype.voteFor = function (player, id) {
        var entry = this.getEntry(id);
        if (!this.confirmIsPlayersTurn(player) && entry && !entry.isCreator(player) && this.gameState.readOrReceiveOrVote(this, player, shared_js_1.GUESSING_STATE)) {
            entry.voteFor(player);
        }
    };
    BalderdashGame.prototype.voteForCurrent = function (player) {
        this.voteFor(player, this.getCurrEntry().id);
    };
    BalderdashGame.prototype.submitEntry = function (player, entryText, correctAnswer) {
        if (correctAnswer === void 0) { correctAnswer = ""; }
        if (!this._currTurn) {
            console.log("Currently it is not any player's turn");
            return;
        }
        if (this.gameState.readOrReceiveOrVote(this, player, shared_js_1.WRITING_STATE)) {
            this._entries.push(new Entry_js_1.Entry(entryText, player));
            if (this.confirmIsPlayersTurn(player)) {
                this._entries.push(new Entry_js_1.Entry(correctAnswer, player, true));
            }
            this.requestNextState();
        }
    };
    BalderdashGame.prototype.nextEntry = function () {
        if (++this._currEntry === this.entries.length) {
            this._currEntry = 0;
        }
    };
    BalderdashGame.prototype.readEntry = function (player) {
        if (!this._currTurn) {
            console.log("Currently it is not any player's turn");
            return;
        }
        if (this.confirmIsPlayersTurn(player)) {
            this.gameState.readOrReceiveOrVote(this, player, shared_js_1.READING_STATE);
            this.nextEntry();
        }
        // TODO fix tracking reading and then move on
    };
    BalderdashGame.prototype.addScores = function () {
        this._entries.forEach(function (entry) {
            entry.addPoints();
        });
    };
    BalderdashGame.prototype.nextState = function (player) {
        this.gameState.toNextState(this, player);
    };
    BalderdashGame.prototype.requestNextState = function () {
        if (this._currTurn) {
            this.nextState(this._currTurn);
        }
    };
    BalderdashGame.prototype.resetPlayerAnswers = function () {
        this.players.forEach(function (player, _) {
            player.resetAnswered();
        });
    };
    BalderdashGame.prototype.makeFEEntries = function () {
        var feEntries = [];
        for (var i = 0; i < this._entries.length; ++i) {
            feEntries.push(this._entries[i].convertToFEData());
        }
        return feEntries;
    };
    BalderdashGame.prototype.exportState = function (player) {
        return new FrontEndData(this.getState().getStateId(), this._currTurn === player, true, __spreadArray([], __read(this.players.values()), false), this.host === player, this.getState().getStateId() === shared_js_1.SCORE_STATE ? this.makeFEEntries() : [], FEPlayer.copyPlayer(player));
    };
    return BalderdashGame;
}());
exports.BalderdashGame = BalderdashGame;
var FEPlayer = /** @class */ (function () {
    function FEPlayer(name, score, answered) {
        this.name = name;
        this.score = score;
        this.answered = answered;
    }
    FEPlayer.copyPlayer = function (player) {
        return new FEPlayer(player.name, player.score, !player.hasNotAnswered());
    };
    return FEPlayer;
}());
exports.FEPlayer = FEPlayer;
var FEEntry = /** @class */ (function () {
    function FEEntry(author, voters) {
        this.author = author;
        this.voters = voters;
    }
    return FEEntry;
}());
exports.FEEntry = FEEntry;
var FrontEndData = /** @class */ (function () {
    function FrontEndData(state, isTurn, hasJoined, players, isHost, entriesWithVotes, currPlayer) {
        this.state = state;
        this.isTurn = isTurn;
        this.hasJoined = hasJoined;
        this.isHost = isHost;
        this.entriesWithVotes = entriesWithVotes;
        this.currPlayer = currPlayer;
        this.players = players.map(function (player) { return FEPlayer.copyPlayer(player); });
    }
    return FrontEndData;
}());
exports.FrontEndData = FrontEndData;
