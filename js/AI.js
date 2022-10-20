import PawnBase from "../js/PawnBase.js"

export default class AI 
{
    constructor(scene, pawn, name)
    {
        this.scene = scene;

        this.name = name;

        this.pawn = pawn;

        this.bIsFirstTilePlacedAI = false;

        this.score = 0;
    }

    aiMakeFirstMove(AI)
    {   
        let randomX = Phaser.Math.Between(0, 6);
        let randomY = Phaser.Math.Between(0, 6);

        if((this.scene.boardArray[randomX][randomY].bIsTaken == false) &&
        ((randomX+1 <= 6 && this.scene.boardArray[randomX+1][randomY].bIsTaken == false) || 
         (randomX-1 >= 0 && this.scene.boardArray[randomX-1][randomY].bIsTaken == false) || 
         (randomY-1 >= 0 && this.scene.boardArray[randomX][randomY-1].bIsTaken == false) || 
         (randomY+1 <= 6 && this.scene.boardArray[randomX][randomY+1].bIsTaken == false)))
         {
            this.tile = this.scene.boardArray[randomX][randomY];
            this.scene.boardArray[randomX][randomY].bIsTaken = true;

            console.log("Bialy: " + randomX + " " + randomY);

            console.log("x: " + this.scene.boardArray[randomX][randomY].XOffset)
            console.log("y: " + this.scene.boardArray[randomX][randomY].YOffset)

            this.tile.pawn = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this);

            this.aiMakeSecondMove(AI,randomX,randomY);
            //---------------------------------------------------------------------------------------------------------------------------     
         }
        else if(this.scene.CheckHowManyMovesPossible() > 0)
        {
            this.aiMakeFirstMove(AI);
           
        }
        else
        {
            this.scene.gameOver();
        }
    }

    aiMakeSecondMove(AI, x, y)
    {
        let randomNum = Phaser.Math.Between(0, 3);
        let bIsPlaced = false;
        do
        {
            switch (randomNum) {
                case 0:
                    if((y+1 <= 6) && (this.scene.boardArray[x][y+1].bIsTaken == false))
                    {
                        this.tile = this.scene.boardArray[x][y+1];
                        console.log(x+1 + " " + y);
                        this.tile.pawn = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this);
                        bIsPlaced = true;
                    }
                    break;
                case 1:
                    if((y-1 >= 0) && (this.scene.boardArray[x][y-1].bIsTaken == false))
                    {
                        this.tile = this.scene.boardArray[x][y-1];
                        console.log(x-1 + " " + y);
                        this.tile.pawn = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this);
                        bIsPlaced = true;
                    }
                    break;
                case 2:
                    if((x+1 <= 6) && (this.scene.boardArray[x+1][y].bIsTaken == false))
                    {
                        this.tile = this.scene.boardArray[x+1][y];
                        console.log(x + " " + y+1);
                        this.tile.pawn = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this);
                        bIsPlaced = true;
                    }
                    break;
                case 3:
                    if((x-1 >= 0) && (this.scene.boardArray[x-1][y].bIsTaken == false))
                    {
                        this.tile = this.scene.boardArray[x-1][y];
                        console.log(x + " " + y-1);
                        this.tile.pawn = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this);
                        bIsPlaced = true;
                    }
                    break;    
                default:
                    console.log("Zjebalo sie")
                    break;
            }
        } while(bIsPlaced != true)
        
    }

    
}