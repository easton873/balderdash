import { BalderdashGame } from "./BalderdashGame.js";

export class Player{
    constructor(
        private _socket : any,
        readonly id: string,
        private name: string,
        private answered : boolean = false,
        private _score : number = 0,
    ){}

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
        this._socket(game.getState().getStateName(), game);
    }

    public get socket(){
        return this._socket;
    }

    public scorePoints(pointsScored : number){
        this._score += pointsScored;
    }
}