import { BalderdashGame } from "./BalderdashGame.js";

export class Player{
    readonly id : string;
    constructor(
        private _socket : any,
        private _name: string,
        private _roomCode: string,
        private answered : boolean = false,
        private _score : number = 0,
    ){
        this.id = _socket.id;
    }

    public get name(){
        return this._name;
    }

    public get roomCode(){
        return this._roomCode;
    }

    public get score(){
        return this._score;
    }

    public answer(): void{
        this.answered = true;
    }

    public resetAnswered(): void{
        this.answered = false;
    }

    public hasNotAnswered(): boolean{
        return !this.answered;
    }

    public emitState(game : BalderdashGame): void{
        this._socket.emit('gameState', game.exportState(this));
    }

    public emit(message : string){
        this._socket.emit(message);
    }

    public emitRead(answer : string){
        this._socket.emit("read", answer);
    }

    // public get socket(){
    //     return this._socket;
    // }

    public scorePoints(pointsScored : number){
        this._score += pointsScored;
    }
}