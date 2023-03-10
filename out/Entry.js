"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entry = void 0;
var BalderdashGame_js_1 = require("./BalderdashGame.js");
var Entry = /** @class */ (function () {
    function Entry(_content, creator, _correct, peopleVotingFor) {
        if (_correct === void 0) { _correct = false; }
        if (peopleVotingFor === void 0) { peopleVotingFor = []; }
        this._content = _content;
        this.creator = creator;
        this._correct = _correct;
        this.peopleVotingFor = peopleVotingFor;
        this._id = Entry.idNum++;
    }
    Object.defineProperty(Entry.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entry.prototype, "correct", {
        get: function () {
            return this._correct;
        },
        enumerable: false,
        configurable: true
    });
    Entry.prototype.voteFor = function (player) {
        this.peopleVotingFor.push(player);
        player.answer();
    };
    Entry.prototype.addPoints = function () {
        if (this._correct) {
            this.peopleVotingFor.forEach(function (p) {
                p.scorePoints(1);
            });
        }
        else {
            this.creator.scorePoints(this.peopleVotingFor.length);
        }
    };
    Object.defineProperty(Entry.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Entry.prototype.convertToFEData = function () {
        var voters = [];
        for (var i = 0; i < this.peopleVotingFor.length; ++i) {
            voters.push(this.peopleVotingFor[i].name);
        }
        return new BalderdashGame_js_1.FEEntry(this.correct ? 'Correct' : this.creator.name, voters);
    };
    Entry.prototype.isCreator = function (p) {
        return p === this.creator;
    };
    Entry.idNum = 0;
    return Entry;
}());
exports.Entry = Entry;
