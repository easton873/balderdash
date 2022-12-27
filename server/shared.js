"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeId = exports.SCORE_STATE_NAME = exports.GUESSING_STATE_NAME = exports.READING_STATE_NAME = exports.WRITING_STATE_NAME = exports.WAITING_STATE_NAME = exports.SCORE_STATE = exports.GUESSING_STATE = exports.READING_STATE = exports.WRITING_STATE = exports.WAITING_STATE = void 0;
exports.WAITING_STATE = 0;
exports.WRITING_STATE = 1;
exports.READING_STATE = 2;
exports.GUESSING_STATE = 3;
exports.SCORE_STATE = 4;
exports.WAITING_STATE_NAME = "waiting";
exports.WRITING_STATE_NAME = "writing";
exports.READING_STATE_NAME = "reading";
exports.GUESSING_STATE_NAME = "guessing";
exports.SCORE_STATE_NAME = "score";
var randomChar = function () {
    var chars = "qwertyuiopasdfghjklzxcvbnm1234567890";
    return chars[Math.floor(Math.random() * chars.length)];
};
var makeId = function (length) {
    var id = "";
    for (var i = 0; i < length; ++i) {
        id += randomChar();
    }
    return id;
};
exports.makeId = makeId;
