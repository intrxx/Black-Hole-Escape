import PawnBase from "../js/PawnBase.js"

let scores =
    {
       Tie: 0,
       Human: -1,
       AI1: 1
    }

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
    //-------------------------------------------------------------------------------------------------------------------------------------
    // 1. Sprawdzamy pola gdzie mamy wiekrzy score dla obecnego gracza
    // 2. Sprawdzamy pola w około gdzie score jest najmniejszy dla gracza przeciwnego
    // 3. Jezeli glebokosc jest wiekrza niz 1 
    //-------------------------------------------------------------------------------------------------------------------------------------
    //przykladowa implementacja ruchu
    aiMakeFirstOptimalMove() 
    {
        let optimalScore = -Infinity;
        let optimalMove;

        for(let i = 0; i < 7; i++)
        {
            for(let j = 0; j < 7; j++)
            {
                if(this.scene.boardArray[j][i].bIsTaken == false && this.scene.CheckIfAnyFreeTilesAround(j,i))
                {
                    if(this.scene.getNumberOfAI() == 1)
                    {
                    //tutaj stawiamy pionka zeby sprawdzic scora
                    this.tile = this.scene.boardArray[j][i];
                    this.scene.boardArray[j][i].bIsTaken = true;
                    this.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', this.scene.AI1);
                    
                    //tutaj sprawdzamy wynik na tym polu
                    //let score = this.minimax(this.scene.boardArray, 0, true, this.scene.player1, 1);
                    //console.log("Score in make first move: " + 1);
                    let result = this.scene.CheckWhoHasMoreScore();
                    let score = scores[result];
                    console.log(score);

                    //w tym momencie musimy cofac ten ruch
                    this.PawnBase.destroy();
                    this.scene.boardArray[j][i].bIsTaken = false;
                    //console.log("isTaken?: " + this.scene.boardArray[j][i].bIsTaken)
                    
                    //tutaj przypisujemy ten wynik do najlepszego wyniku jesli jest wiekszy
                    if(score > optimalScore)
                    {
                        optimalScore = score;
                        optimalMove = {i, j};
                    }
                    }    
                }   
            }
        }
        this.tile = this.scene.boardArray[optimalMove.i][optimalMove.j];
        this.scene.boardArray[optimalMove.i][optimalMove.j].bIsTaken = true;
        this.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);

        console.log(this.PawnBase);
        console.log(optimalMove.i + " i " + optimalMove.j);
        console.log("Optimal move zajety?: " + this.scene.boardArray[optimalMove.i][optimalMove.j].bIsTaken);

        //this.aiMakeSecondOptimalMove(optimalMove.i, optimalMove.j, this.scene.AI1);
    }

    aiMakeSecondOptimalMove(x, y, owner)
    {
        let optimalScore = -Infinity;
        let optimalMove;

        if((y+1 <= 6) && (this.scene.boardArray[x][y+1].bIsTaken == false))
        {
            //Do the move
            this.tile = this.scene.boardArray[x][y+1];
            this.scene.boardArray[x][y+1].bIsTaken = true;
            this.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', owner);
            
            //Check the score
            let score = this.minimax(board, 0, false);

            //Undo the move
            this.PawnBase.destroy();
            this.scene.boardArray[x][y+1].bIsTaken = false;
            
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
            this.scene.boardArray[x][y-1].bIsTaken = true;
            this.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);
            
            //Check the score
            let score = this.minimax(board, 0, false);

            //Undo the move
            this.PawnBase.destroy();
            this.scene.boardArray[x][y-1].bIsTaken = false;
            
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
            this.scene.boardArray[x+1][y].bIsTaken = true;
            this.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);
            
            //Check the score
            let score = this.minimax(board, 0, false);

            //Undo the move
            this.PawnBase.destroy();
            this.scene.boardArray[x+1][y].bIsTaken = false;
            
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
            this.scene.boardArray[x-1][y].bIsTaken = true;
            this.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);
            
            //Check the score
            let score = this.minimax(board, 0, false);

            //Undo the move
            this.PawnBase.destroy();
            this.scene.boardArray[x-1][y].bIsTaken = false;
            //Bind the score
            if(score > optimalScore)
            {
                optimalScore = score;
                optimalMove = { i, j};
            }
        }  

        this.tile = this.scene.boardArray[optimalMove.i][optimalMove.j];
        this.scene.boardArray[optimalMove.i][optimalMove.j].bIsTaken = true;
        this.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);
    }

    minimax(board, depth, isMaximazing, maxDepth)
    {
        if(isMaximazing)
        {
            let optimalScore = -Infinity;
            let optimalMove;
            for(let i = 0; i < 7; i++)
            {
                for(let j = 0; j < 7; j++)
                {
                    if(this.scene.boardArray[j][i].bIsTaken == false && this.scene.CheckIfAnyFreeTilesAround(j,i))
                    {
                        if(this.scene.getNumberOfAI() == 1)
                        {
                        let score;
                        this.tile = this.scene.boardArray[j][i];
                        this.scene.boardArray[j][i].bIsTaken = true;
                        this.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);

                        if(depth < maxDepth)
                        {
                            score = this.minimax(board, depth + 1, true, this.scene.AI1, maxDepth);
                        }
                        else 
                        {
                            let result = this.scene.CheckWhoHasMoreScore();
                            score = scores[result];
                        }
                        if(score > optimalScore)
                        {
                            optimalScore = score;
                            optimalMove = [];
                            
                        } else if(score == optimalScore)
                        {
                            optimalMove = {i, j};
                        }

                        this.PawnBase.destroy();
                        this.scene.boardArray[j][i].bIsTaken = false;

                        }   
                    }   
                }
            } 
            return optimalMove;    
        }
        else
        {
            let optimalScore = Infinity;
            let optimalMove;
            for(let i = 0; i < 7; i++)
            {
                for(let j = 0; j < 7; j++)
                {
                    if(this.scene.boardArray[j][i].bIsTaken == false && this.scene.CheckIfAnyFreeTilesAround(j,i))
                    {
                        if(this.scene.getNumberOfAI() == 1)
                        {
                            let score;
                            this.tile = this.scene.boardArray[j][i];
                            this.scene.boardArray[j][i].bIsTaken = true;
                            this.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
    
                            if(depth < maxDepth)
                            {
                                score = this.minimax(board, depth + 1, false, this.scene.player1, maxDepth);
                            }
                            else 
                            {
                                let result = this.scene.CheckWhoHasMoreScore();
                                score = scores[result];
                            }
                            if(score < optimalScore)
                            {
                                optimalScore = score;
                                optimalMove = [];
                                
                            } else if(score == optimalScore)
                            {
                                optimalMove = {i, j};
                            }
    
                            this.PawnBase.destroy();
                            this.scene.boardArray[j][i].bIsTaken = false;
                        }
                    }   
                }
            } 
            return optimalScore;
        }
    }
}