"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(_socket, id, name, answered, _score) {
        if (answered === void 0) { answered = false; }
        if (_score === void 0) { _score = 0; }
        this._socket = _socket;
        this.id = id;
        this.name = name;
        this.answered = answered;
        this._score = _score;
    }
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
        this._socket(game.getState().getStateName(), game);
    };
    Object.defineProperty(Player.prototype, "socket", {
        get: function () {
            return this._socket;
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.scorePoints = function (pointsScored) {
        this._score += pointsScored;
    };
    return Player;
}());
exports.Player = Player;
