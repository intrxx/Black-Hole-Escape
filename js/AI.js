import PawnBase from "../js/PawnBase.js"

export default class AI 
{
    constructor(scene, pawn, name)
    {
        this.scene = scene;

        this.name = name;

        this.pawn = pawn;

        this.score = 0;
    }
}