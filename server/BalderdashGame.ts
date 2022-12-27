import { BalderdashGameState, BalderdashGameStateProxy } from "./BalderDashGameState.js";
import { Entry } from "./Entry.js";
import { Player } from "./Player.js";
import { GUESSING_STATE, READING_STATE, WRITING_STATE } from "./shared.js";

export interface BalderdashGameController{
    nextState(player : Player);
    joinGame(player : Player);
    submitEntry(player : Player, entryText : string, extraText : string);
    readEntry(player : Player);
}

export class BalderdashGame {
    constructor(
        private players : Map<string, Player> = new Map<string, Player>(),
        private gameState : BalderdashGameStateProxy = new BalderdashGameStateProxy(),
        private _currTurn : Player | null = null,
        private _entries : Entry[] = [],
    ){}

    public get entries(){
        return this._entries;
    }

    public getPlayer(id : string) : Player {
        return this.players.get(id);
    }

    public getState() : BalderdashGameState {
        return this.gameState;
    }

    public setState(nextState : BalderdashGameState) : void {
        this.gameState.setState(nextState);
    }

    public joinGame(player : Player) : boolean {
        return this.gameState.playerJoin(this, player);
    }

    public addPlayer(player : Player) : void {
        this.players.set(player.id, player);
    }

    public getNumPlayers() : number {
        return this.players.size;
    }

    public forceTurn(player: Player) : void{
        this._currTurn = player;
    }

    public get currTurn(){
        return this._currTurn;
    }

    public nextPlayersTurn() : void {
        let next = false;
        this._entries = [];
        this.players.forEach((player : Player, id : string) => {
            if (next){
                this._currTurn = player;
                next = false;
                return;
            }
            else if (player == this._currTurn){
                next = true;
            }
        });
        if (next){
            this._currTurn = [...this.players.values()][0];
        }
    }

    public setStateEnd() : void {
        this.players = new Map<string, Player>();
        this.gameState = new BalderdashGameStateProxy();
        this._currTurn = null;
    }

    public confirmIsPlayersTurn(player : Player) : boolean{
        return player == this._currTurn;
    }

    public emitState(): void{
        this.players.forEach((player : Player, id : string) => {
            player.emitState(this);
        });
    }

    public getEntry(id : number) : Entry | null {
        for(let i = 0; i < this._entries.length; ++i){
            if (this._entries[i].id == id){
                return this._entries[i];
            }
        }
        return null;
    }

    public voteFor(player : Player, id : number) : void {
        if (!this.confirmIsPlayersTurn(player) && this.gameState.readOrReceiveOrVote(this, player, GUESSING_STATE)){
            const entry : Entry | null = this.getEntry(id);
            if (entry){
                entry.voteFor(player);
            }
        }
    }

    public submitEntry(player : Player, entryText : string, correctAnswer : string = "") : void {
        if (this.gameState.readOrReceiveOrVote(this, player, WRITING_STATE)){
            this._entries.push(new Entry(entryText, player));
            if (this.confirmIsPlayersTurn(player)){
                this._entries.push(new Entry(correctAnswer, player, true));
            }
            if (this.gameState.nextStateReady(this)){
                this._currTurn.socket("all received");
            }
        }
    }

    public readEntry(player : Player){
        if (this.confirmIsPlayersTurn(player)){
            this.gameState.readOrReceiveOrVote(this, player, READING_STATE);
        }
        if (this.gameState.nextStateReady(this)){
            this._currTurn.socket("all received");
        }
    }

    public addScores() : void {
        this._entries.forEach((entry : Entry) => {
            entry.addPoints();
        });
    }

    public nextState(player : Player) : void {
        this.gameState.toNextState(this, player);
    }

    public resetPlayerAnswers() : void{
        this.players.forEach((player : Player, _) => {
            player.resetAnswered();
        })
    }
}