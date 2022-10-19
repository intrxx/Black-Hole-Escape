import PawnBase from "../js/PawnBase.js";

let OldXindex = 0;
let OldYindex = 0;
export default class Tile extends Phaser.Physics.Arcade.Sprite 
{
    constructor(scene, x, y, sprite)
	{
		super(scene, x, y, sprite);

		this.scene = scene;

		this.PawnBase = null;

		this.indexX = 0;
		this.indexY = 0;

		this.XOffset = 0;
		this.YOffset = 0;

		this.sprite = scene.add.image(x, y, sprite).setScale(0.85);

        this.sprite.on('pointerdown', () => {
		    if(this.scene.bGameHasStarted == false) { return;}
			if(this.PawnBase == null && this.scene.player1.numberOfMoves > 0)
			{
                console.log("Tura Pierwszego");
                if(this.scene.player1.bIsFirstTilePlaced == false) 
                {
                    if((this.indexX+1 < 6 && this.scene.boardArray[this.indexX+1][this.indexY].bIsTaken == false) || 
                    (this.indexX-1 >= 0 && this.scene.boardArray[this.indexX-1][this.indexY].bIsTaken == false) || 
                    (this.indexY-1 >= 0 && this.scene.boardArray[this.indexX][this.indexY-1].bIsTaken == false) || 
                    (this.indexY+1 < 6 && this.scene.boardArray[this.indexX][this.indexY+1].bIsTaken == false))
                    {
                    this.PawnBase = new PawnBase(this.scene, this.XOffset, this.YOffset, 'WhiteStone', this.scene.player1);
                    this.scene.numberOfPawns++;
                    this.scene.player1.bIsFirstTilePlaced = true;

                    OldXindex = this.indexX;
                    OldYindex = this.indexY;

                    this.scene.boardArray[this.indexX][this.indexY].bIsTaken = true;

                    
                    this.scene.player1.numberOfMoves--; 

                    if(this.scene.numberOfPawns == 48)
					{
						this.scene.gameOver();
					}
                    }
                } 
                else if((this.scene.player1.bIsFirstTilePlaced = true && this.PawnBase == null) && ((OldXindex == this.indexX && OldYindex + 1 == this.indexY) ||  (OldYindex == this.indexY && OldXindex + 1 == this.indexX) || (OldXindex == this.indexX && OldYindex - 1 == this.indexY) ||  (OldYindex == this.indexY && OldXindex - 1 == this.indexX)))
                {
                    
                    this.PawnBase = new PawnBase(this.scene, this.XOffset, this.YOffset, 'BlackStone', this.scene.player2);
                    this.scene.numberOfPawns++;

                    this.scene.player1.numberOfMoves--; 

                    this.scene.boardArray[this.indexX][this.indexY].bIsTaken = true;
                   
                    if(this.scene.numberOfPawns == 48)
					{
						this.scene.gameOver();
					}
                    
                } 
                else 
                {
                    console.log("Nie mozna postawic kloca")
                }
                
                if(this.scene.player1.numberOfMoves == 0) 
                {
                    this.scene.player2.numberOfMoves = 2;
                    this.scene.player1.bIsFirstTilePlaced = false;
                }
                
            } 
            else if(this.PawnBase == null && this.scene.player2.numberOfMoves > 0) 
            {
                console.log("Tura Drugiego");
                if(this.scene.player1.bIsFirstTilePlaced == false) 
                {
                    if((this.indexX+1 < 6 && this.scene.boardArray[this.indexX+1][this.indexY].bIsTaken == false) || 
                    (this.indexX-1 >= 0 && this.scene.boardArray[this.indexX-1][this.indexY].bIsTaken == false) || 
                    (this.indexY-1 >= 0 && this.scene.boardArray[this.indexX][this.indexY-1].bIsTaken == false) || 
                    (this.indexY+1 < 6 && this.scene.boardArray[this.indexX][this.indexY+1].bIsTaken == false))
                    {
                    this.PawnBase = new PawnBase(this.scene, this.XOffset, this.YOffset, 'WhiteStone', this.scene.player2);
                    this.scene.numberOfPawns++;
                    this.scene.player1.bIsFirstTilePlaced = true;

                    OldXindex = this.indexX;
                    OldYindex = this.indexY;

                    this.scene.boardArray[this.indexX][this.indexY].bIsTaken = true;
                    
                    this.scene.player2.numberOfMoves--;

                    if(this.scene.numberOfPawns == 48)
					{
						this.scene.gameOver();
					}
                     }
                } 
                else if((this.scene.player1.bIsFirstTilePlaced = true && this.PawnBase == null) && ((OldXindex == this.indexX && OldYindex + 1 == this.indexY) ||  (OldYindex == this.indexY && OldXindex + 1 == this.indexX) || (OldXindex == this.indexX && OldYindex - 1 == this.indexY) ||  (OldYindex == this.indexY && OldXindex - 1 == this.indexX)))
                {
                    this.PawnBase = new PawnBase(this.scene, this.XOffset, this.YOffset, 'BlackStone', this.scene.player1);
                    this.scene.numberOfPawns++;
                    
                    this.scene.player2.numberOfMoves--;

                    this.scene.boardArray[this.indexX][this.indexY].bIsTaken = true;

                    if(this.scene.numberOfPawns == 48)
					{
						this.scene.gameOver();
					}
                }
                else 
                {
                    console.log("Nie mozna postawic kloca")
                }
                
                if(this.scene.player2.numberOfMoves == 0) 
                {
                    this.scene.player1.numberOfMoves = 2;
                    this.scene.player1.bIsFirstTilePlaced = false;
                }
            }
    });
    }
}
