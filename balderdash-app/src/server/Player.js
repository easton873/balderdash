"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(_socket, _name, _roomCode, answered, _score) {
        if (answered === void 0) { answered = false; }
        if (_score === void 0) { _score = 0; }
        this._socket = _socket;
        this._name = _name;
        this._roomCode = _roomCode;
        this.answered = answered;
        this._score = _score;
        this.id = _socket.id;
    }
    Object.defineProperty(Player.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "roomCode", {
        get: function () {
            return this._roomCode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "score", {
        get: function () {
            return this._score;
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.answer = function () {
        this.answered = true;
    };
    Player.prototype.resetAnswered = function () {
        this.answered = false;
    };
    Player.prototype.hasNotAnswered = function () {
        return !this.answered;
    };
    Player.prototype.emitState = function (game) {
        this._socket.emit('gameState', game.exportState(this));
    };
    Player.prototype.emit = function (message) {
        this._socket.emit(message);
    };
    Player.prototype.emitRead = function (answer) {
        this._socket.emit("read", answer);
    };
    // public get socket(){
    //     return this._socket;
    // }
    Player.prototype.scorePoints = function (pointsScored) {
        this._score += pointsScored;
    };
    return Player;
}());
exports.Player = Player;
