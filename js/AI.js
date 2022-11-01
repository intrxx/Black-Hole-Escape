import PawnBase from "../js/PawnBase.js"

export default class AI 
{
    constructor(scene, name)
    {
        this.scene = scene;

        this.name = name;

        this.bAIMadeMove = false;

        this.score = 0;
    }

    aiMakeFirstRandomMove(AI)
    {   
        let randomX = Phaser.Math.Between(0, 6);
        let randomY = Phaser.Math.Between(0, 6);

        if((this.scene.boardArray[randomX][randomY].bIsTaken == false) &&
        (this.scene.CheckIfAnyFreeTilesAround(randomX, randomY)))
         {
            this.tile = this.scene.boardArray[randomX][randomY];
            this.scene.boardArray[randomX][randomY].bIsTaken = true;
            
            if(this.scene.getNumberOfAI() == 1)
            {
                this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this.scene.player1);
                
                
                this.aiMakeSecondRandomMove(this.scene.AI1, randomX, randomY);  
            }
            else if(this.scene.getNumberOfAI() == 2)
            {
                this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this.scene.AI1);
                this.aiMakeSecondRandomMove(this.scene.AI2, randomX, randomY);  
            }
            
            
         }
        else if(this.scene.CheckHowManyMovesPossible() > 0)
        {
            this.aiMakeFirstRandomMove(AI);
        }
    }

    aiMakeSecondRandomMove(Owner, x, y)
    {
        let bIsPlaced = false;
        do
        {
            let randomNum = Phaser.Math.Between(0, 3);
            switch (randomNum) {
                case 0:
                    if((y+1 <= 6) && (this.scene.boardArray[x][y+1].bIsTaken == false))
                    {
                        this.tile = this.scene.boardArray[x][y+1];
                        this.scene.boardArray[x][y+1].bIsTaken = true;
                        
                        this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', Owner);
                        
                        bIsPlaced = true;
                    }
                    break;
                case 1:
                    if((y-1 >= 0) && (this.scene.boardArray[x][y-1].bIsTaken == false))
                    {
                        this.tile = this.scene.boardArray[x][y-1];
                        this.scene.boardArray[x][y-1].bIsTaken = true;
                        
                        this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', Owner);
                        
                        bIsPlaced = true;
                    }
                    break;
                case 2:
                    if((x+1 <= 6) && (this.scene.boardArray[x+1][y].bIsTaken == false))
                    {
                        this.tile = this.scene.boardArray[x+1][y];
                        this.scene.boardArray[x+1][y].bIsTaken = true;
                        
                        this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', Owner);
                        
                        bIsPlaced = true;
                    }
                    break;
                case 3:
                    if((x-1 >= 0) && (this.scene.boardArray[x-1][y].bIsTaken == false))
                    {
                        this.tile = this.scene.boardArray[x-1][y];
                        this.scene.boardArray[x-1][y].bIsTaken = true;
                        
                        this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', Owner);
                        
                        bIsPlaced = true;
                    }
                    break;    
                default:
                    console.log("Fail reading random number")
                    break;
            }
        } while(bIsPlaced != true)
        
    }

    //przykladowa implementacja ruchu
    aiMakeFirstOptimalMove() 
    {
        let optimalScore = -Infinity;
        let optimalMove;

        for(let i = 0; i < 7; i++)
        {
            for(let j = 0; j < 7; j++)
            {
                if(this.boardArray[j][i].bIsTaken == false && this.CheckIfAnyFreeTilesAround(j,i))
                {
                    //tutaj stawiamy pionka zeby sprawdzic scora
                    this.tile = this.scene.boardArray[j][i];
                    
                    //tutaj sprawdzamy wynik na tym polu
                    let score = this.minimax(board, 0, false);

                    //w tym momencie musimy cofac ten ruch
                    this.tile = this.scene.boardArray[j][i];

                    //tutaj przypisujemy ten wynik do najlepszego wyniku jesli jest wiekrzy
                    if(score > optimalScore)
                    {
                        optimalScore = score;
                        optimalMove = { i, j};
                    }
                }   
            }
        }
        this.scene.boardArray[optimalMove.i][optimalMove.j];
        this.scene.boardArray[optimalMove.i][optimalMove.j].bIsTaken = true;

        this.aiMakeSecondOptimalMove(optimalMove.i, optimalMove.y);
    }

    aiMakeSecondOptimalMove(x, y)
    {
        let optimalScore = -Infinity;
        let optimalMove;

        if((y+1 <= 6) && (this.scene.boardArray[x][y+1].bIsTaken == false))
        {
            //Do the move
            this.tile = this.scene.boardArray[x][y+1];
            
            //Check the score
            let score = this.minimax(board, 0, false);

            //Undo the move
            this.tile = this.scene.boardArray[x][y+1];
            
            //Bind the score
            if(score > optimalScore)
            {
                optimalScore = score;
                optimalMove = { i, j};
            }
        }
        
        if((y-1 >= 0) && (this.scene.boardArray[x][y-1].bIsTaken == false))
        {
            //Do the move
            this.tile = this.scene.boardArray[x][y-1];
            
            //Check the score
            let score = this.minimax(board, 0, false);
            
            //Undo the move
            this.tile = this.scene.boardArray[x][y+1];
            
            //Bind the score
            if(score > optimalScore)
            {
                optimalScore = score;
                optimalMove = { i, j};
            }
        }   

        if((x+1 <= 6) && (this.scene.boardArray[x+1][y].bIsTaken == false))
        {
            //Do the move
            this.tile = this.scene.boardArray[x+1][y];
            
            //Check the score
            let score = this.minimax(board, 0, false);
            
            //Undo the move
            this.tile = this.scene.boardArray[x+1][y];
            
            //Bind the score
            if(score > optimalScore)
            {
                optimalScore = score;
                optimalMove = { i, j};
            }
        }

        if((x-1 >= 0) && (this.scene.boardArray[x-1][y].bIsTaken == false))
        {
            //Do the move
            this.tile = this.scene.boardArray[x-1][y];
            
            //Check the score
            let score = this.minimax(board, 0, false);
            
            //Undo the move
            this.tile = this.scene.boardArray[x-1][y];
            
            //Bind the score
            if(score > optimalScore)
            {
                optimalScore = score;
                optimalMove = { i, j};
            }
        }  

        this.scene.boardArray[optimalMove.i][optimalMove.j];
        this.scene.boardArray[optimalMove.i][optimalMove.j].bIsTaken = true;
    }

    minimax(board, depth, isMaximazing)
    {
        return 1;
    }
}