import { BalderdashGame } from "./BalderdashGame.js";
import { Player } from "./Player.js";
import {READING_STATE, GUESSING_STATE, WAITING_STATE, WRITING_STATE, SCORE_STATE, WAITING_STATE_NAME, WRITING_STATE_NAME, READING_STATE_NAME, GUESSING_STATE_NAME, SCORE_STATE_NAME, BalderdashState} from "./shared.js";


export abstract class BalderdashGameState {
    abstract playerJoin(instance : BalderdashGame, player : Player) : boolean;
    abstract toNextState(instance : BalderdashGame, player: Player) : void;
    abstract readOrReceiveOrVote(instance : BalderdashGame, player : Player, intendedState : BalderdashState) : boolean;
    abstract endGame(instance : BalderdashGame, player : Player) : void;
    abstract getStateId() : BalderdashState;
    abstract getStateName() : string;
    public nextStateReady(instance : BalderdashGame) : boolean {
        return true;
    }
}

export class BalderdashGameStateProxy extends BalderdashGameState {
    constructor(private state : BalderdashGameState = new BalderdashWaitingState()){
        super();
    }
    getStateName(): string {
        return this.state.getStateName();
    }
    public getStateId(): BalderdashState {
        return this.state.getStateId();
    }
    public setState(state : BalderdashGameState){
        this.state = state;
    }
    playerJoin(instance: BalderdashGame, player: Player): boolean {
        return this.state.playerJoin(instance, player);
    }
    toNextState(instance: BalderdashGame, player: Player): void {
        if (instance.confirmIsPlayersTurn(player) && this.state.nextStateReady(instance)){
            this.state.toNextState(instance, player);
            instance.emitState();
            instance.resetPlayerAnswers();
        }
    }
    readOrReceiveOrVote(instance: BalderdashGame, player: Player, intendedState : BalderdashState): boolean {
        if (player.hasNotAnswered() && this.getStateId() == intendedState){
            if (this.state.readOrReceiveOrVote(instance, player, intendedState)){
                player.answer();
                return true;
            }
        }
        return false;
    }
    endGame(instance: BalderdashGame, player: Player): void {
        if (instance.confirmIsPlayersTurn(player)){
            this.state.endGame(instance, player);
        }
    }

}

// ************************
// Actual states start here
// ************************

class BalderdashWaitingState implements BalderdashGameState {
    getStateName(): string {
        return WAITING_STATE_NAME;
    }
    getStateId(): BalderdashState {
        return WAITING_STATE;
    }
    nextStateReady(instance : BalderdashGame): boolean {
        return instance.getNumPlayers() >= 2
    }
    playerJoin(instance : BalderdashGame, player : Player): boolean {
        if (instance.getNumPlayers() == 0){
            instance.forceTurn(player);
        }
        instance.addPlayer(player);
        return true;
    }
    toNextState(instance: BalderdashGame, _ : Player): void {
        instance.setState(new BalderdashWritingState());
    }
    readOrReceiveOrVote(instance : BalderdashGame, player : Player, intendedState : BalderdashState): boolean {
        return false;
    }

    endGame(instance : BalderdashGame, player : Player): void {}
}

class BalderdashWritingState implements BalderdashGameState {
    constructor(private numSubmitted : number = 0){}
    getStateName(): string {
        return WRITING_STATE_NAME;
    }
    getStateId(): BalderdashState {
        return WRITING_STATE;
    }
    nextStateReady(instance: BalderdashGame): boolean {
        return this.numSubmitted == instance.getNumPlayers();
    }
    playerJoin(instance: BalderdashGame, player: Player): boolean {
        instance.addPlayer(player);
        return true;
    }
    toNextState(instance : BalderdashGame, player : Player): void {
        instance.setState(new BalderdashReadingState());
    }
    readOrReceiveOrVote(instance : BalderdashGame, player : Player, intendedState : BalderdashState): boolean {
        this.numSubmitted++;
        return true;
    }
    endGame(instance : BalderdashGame, player : Player): void {
        instance.setStateEnd();
    }

}

class BalderdashReadingState implements BalderdashGameState {
    constructor(private numRead : number = 0){}
    getStateName(): string {
        return READING_STATE_NAME;
    }
    getStateId(): BalderdashState {
        return READING_STATE;
    }
    nextStateReady(instance: BalderdashGame): boolean {
        // Plus one because the player whose turn it is gets to
        // write one and also the correct one
        return this.numRead == instance.getNumPlayers() + 1;
    }
    playerJoin(instance: BalderdashGame, player: Player): boolean {
        throw new Error("Method not implemented.");
    }
    toNextState(instance : BalderdashGame, player : Player): void {
        instance.setState(new BalderDashGuessingState());
    }
    readOrReceiveOrVote(instance : BalderdashGame, player : Player, intendedState : BalderdashState): boolean {
        this.numRead++;
        return false;
    }
    endGame(instance : BalderdashGame, player : Player): void {
        instance.setStateEnd();
    }
}

class BalderDashGuessingState implements BalderdashGameState {
    constructor(private numGuessed : number = 0){}
    getStateName(): string {
        return GUESSING_STATE_NAME;
    }
    getStateId(): BalderdashState {
        return GUESSING_STATE;
    }
    nextStateReady(instance: BalderdashGame): boolean {
        // one less than num players because the player whose turn
        // it is doesn't vote
        return this.numGuessed == instance.getNumPlayers() - 1;
    }
    playerJoin(instance: BalderdashGame, player: Player): boolean {
        throw new Error("Method not implemented.");
    }
    toNextState(instance : BalderdashGame, player : Player): void {
        instance.setState(new BalderdashViewScoresState(instance));
    }
    readOrReceiveOrVote(instance : BalderdashGame, player : Player, intendedState : BalderdashState): boolean {
        this.numGuessed++;
        return true;
    }
    endGame(instance : BalderdashGame, player : Player): void {
        instance.setStateEnd();
    }
}

class BalderdashViewScoresState implements BalderdashGameState {
    constructor(instance : BalderdashGame){
        instance.addScores();
    }
    getStateName(): string {
        return SCORE_STATE_NAME;
    }
    getStateId(): BalderdashState {
        return SCORE_STATE;
    }
    nextStateReady(instance: BalderdashGame): boolean {
        return true;
    }
    playerJoin(instance: BalderdashGame, player: Player): boolean {
        throw new Error("Method not implemented.");
    }
    toNextState(instance: BalderdashGame, player: Player): void {
        instance.setState(new BalderdashWritingState());
        instance.nextPlayersTurn();
    }
    readOrReceiveOrVote(instance: BalderdashGame, player: Player, intendedState : BalderdashState): boolean {
        return false;
    }
    endGame(instance: BalderdashGame, player: Player): void {
        instance.setStateEnd();
    }

}