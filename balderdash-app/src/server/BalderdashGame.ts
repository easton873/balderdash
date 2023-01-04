import { BalderdashGameState, BalderdashGameStateProxy } from "./BalderDashGameState.js";
import { Entry } from "./Entry.js";
import { Player } from "./Player.js";
import { GUESSING_STATE, READING_STATE, SCORE_STATE, WRITING_STATE } from "./shared.js";

// export interface BalderdashGameController{
//     nextState(player : Player);
//     joinGame(player : Player);
//     submitEntry(player : Player, entryText : string, extraText : string);
//     readEntry(player : Player);
//     voteForCurrent(player: Player);
// }

export class BalderdashGame {
    constructor(
        private host : Player,
        private players : Map<string, Player> = new Map<string, Player>(),
        private gameState : BalderdashGameStateProxy = new BalderdashGameStateProxy(),
        private _currTurn : Player | null = null,
        private _entries : Entry[] = [],
        private _currEntry : number = 0,
    ){}

    public get entries(){
        return this._entries;
    }

    public getCurrEntry() : Entry {
        return this._entries[this._currEntry];
    }

    public getPlayer(id : string) : Player {
        const player : Player | undefined =  this.players.get(id);
        if (player){
            return player;
        }
        throw Error("Player undefined");
    }

    public getPlayers() : Map<string, Player>{
        return this.players;
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
            else if (player === this._currTurn){
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
        return player === this._currTurn;
    }

    public emitToMainScreen(): void {
        this.host.emitRead(this.getCurrEntry().content);
    }

    public emitState(): void{
        this.host.emitState(this);
        [...this.players.values()].forEach((player : Player) => {
            player.emitState(this);
        });
    }

    public getEntry(id : number) : Entry | null {
        for(let i = 0; i < this._entries.length; ++i){
            if (this._entries[i].id === id){
                return this._entries[i];
            }
        }
        return null;
    }

    public voteFor(player : Player, id : number) : void {
        const entry : Entry | null = this.getEntry(id);
        if (!this.confirmIsPlayersTurn(player) && entry && !entry.isCreator(player) && this.gameState.readOrReceiveOrVote(this, player, GUESSING_STATE)){
            entry.voteFor(player);
        }
    }

    public voteForCurrent(player : Player) : void {
        this.voteFor(player, this.getCurrEntry().id);
    }

    public submitEntry(player : Player, entryText : string, correctAnswer : string = "") : void {
        if (!this._currTurn){
            console.log("Currently it is not any player's turn");
            return;
        }
        if (this.gameState.readOrReceiveOrVote(this, player, WRITING_STATE)){
            this._entries.push(new Entry(entryText, player));
            if (this.confirmIsPlayersTurn(player)){
                this._entries.push(new Entry(correctAnswer, player, true));
            }
            this.requestNextState();
        }
    }

    public nextEntry() : void{
        if (++this._currEntry === this.entries.length){
            this._currEntry = 0;
        }
    }

    public readEntry(player : Player){
        if (!this._currTurn){
            console.log("Currently it is not any player's turn");
            return;
        }
        if (this.confirmIsPlayersTurn(player)){
            this.gameState.readOrReceiveOrVote(this, player, READING_STATE);
            this.nextEntry();
        }
        // TODO fix tracking reading and then move on
    }

    public addScores() : void {
        this._entries.forEach((entry : Entry) => {
            entry.addPoints();
        });
    }

    public nextState(player : Player) : void {
        this.gameState.toNextState(this, player);
    }

    public requestNextState() : void {
        if (this._currTurn){
            this.nextState(this._currTurn);
        }
    }

    public resetPlayerAnswers() : void{
        this.players.forEach((player : Player, _) => {
            player.resetAnswered();
        })
    }
    private makeFEEntries() : FEEntry[] {
        const feEntries: FEEntry[] = [];
        for (let i = 0; i < this._entries.length; ++i){
            feEntries.push(this._entries[i].convertToFEData());
        }
        return feEntries;
    }
    public exportState(player : Player) : FrontEndData{
        return new FrontEndData(
            this.getState().getStateId(),
            this._currTurn === player,
            true,
            [...this.players.values()],
            this.host === player,
            this.getState().getStateId() === SCORE_STATE ? this.makeFEEntries() : [],
            FEPlayer.copyPlayer(player)
        );
    }
}

export class FEPlayer{
    public name : string;
    public score : number;
    public answered : boolean;
    public static copyPlayer(player : Player) : FEPlayer{
        return new FEPlayer(player.name, player.score, !player.hasNotAnswered());
    }

    constructor(name : string, score : number, answered : boolean) {
        this.name = name;
        this.score = score;
        this.answered = answered
    }
}

export class FEEntry{
    constructor(
        public author : string,
        public voters : string[]
    ){}
}

export class FrontEndData{
    public players : FEPlayer[];
    constructor(
        public state : number,
        public isTurn : boolean,
        public hasJoined : boolean,
        players : Player[],
        public isHost : boolean,
        public entriesWithVotes : FEEntry[],
        public currPlayer : FEPlayer,
    ){
        this.players = players.map((player) => {return FEPlayer.copyPlayer(player)});
    }
}