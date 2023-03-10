import { FEEntry } from "./BalderdashGame.js";
import { Player } from "./Player.js";


export class Entry {
    private static idNum = 0;
    private _id : number;
    constructor(private _content : string, private creator : Player, private _correct : boolean = false, private peopleVotingFor : Player[] = []){
        this._id = Entry.idNum++;
    }
    public get content(){
        return this._content;
    }
    public get correct(){
        return this._correct;
    }
    public voteFor(player : Player) : void {
        this.peopleVotingFor.push(player);
        player.answer();
    }
    public addPoints() : void{
        if (this._correct){
            this.peopleVotingFor.forEach((p : Player) => {
                p.scorePoints(1);
            })
        }
        else {
            this.creator.scorePoints(this.peopleVotingFor.length);
        }
    }
    public get id() : number {
        return this._id;
    }
    public convertToFEData() : FEEntry {
        const voters : string[] = [];
        for (let i = 0; i < this.peopleVotingFor.length; ++i){
            voters.push(this.peopleVotingFor[i].name);
        }
        return new FEEntry(this.correct ? 'Correct' : this.creator.name, voters);
    }
    public isCreator(p : Player) : boolean {
        return p === this.creator;
    }
}