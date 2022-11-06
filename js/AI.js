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
    //-------------------------------------------------------------------------------------------------------------------------------------
    // 1. Sprawdzamy pola gdzie mamy wiekrzy score dla obecnego gracza
    // 2. Sprawdzamy pola w około gdzie score jest najmniejszy dla gracza przeciwnego
    // 3. Jezeli glebokosc jest wiekrza niz 1 
    //-------------------------------------------------------------------------------------------------------------------------------------
    //przykladowa implementacja ruchu
    aiMakeFirstOptimalMove() 
    {
        this.scene.saveCurrentScore();

        let optimalScore = -Infinity;
        let optimalSecondMoveScore;
        let optimalMove;
        let optimalSecondMove;
        for(let i = 0; i < 7; i++)
        {
            for(let j = 0; j < 7; j++)
            {
                if(this.scene.boardArray[j][i].bIsTaken == false && this.scene.CheckIfAnyFreeTilesAround(j, i))
                {
                    if(this.scene.getNumberOfAI() == 1)
                    {
                    //tutaj stawiamy pionka zeby sprawdzic scora
                    this.tile = this.scene.boardArray[j][i];
                    this.scene.boardArray[j][i].bIsTaken = true;
                    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', this.scene.AI1);

                    optimalSecondMoveScore = this.aiMakeSecondOptimalMove(j, i, this.scene.player1);
                    console.log(optimalSecondMoveScore.optimalScore);

                    //let score = this.scene.CheckWhoHasMoreScore();
                    
                    this.tile = this.scene.boardArray[j][i];
                    //w tym momencie musimy cofac ten ruch
                    console.log("+++++++++++++++++++");
                    console.log(this.tile.indexX + " " + this.tile.indexY)
                    this.tile.PawnBase = null;
                    this.scene.boardArray[j][i].bIsTaken = false;
                    //console.log("isTaken?: " + this.scene.boardArray[j][i].bIsTaken)
                    
                    //tutaj przypisujemy ten wynik do najlepszego wyniku jesli jest wiekszy
                    if(optimalSecondMoveScore.optimalScore > optimalScore)
                    {
                        console.log("********************************************")
                        optimalScore = optimalSecondMoveScore.optimalScore;
                        optimalMove = {j, i};
                        
                        let SecondJ = optimalSecondMoveScore.tempJ;
                        let SecondI = optimalSecondMoveScore.tempI;
                        console.log("Second cords: " + SecondJ + " " + SecondI)
                        optimalSecondMove = {SecondJ, SecondI};
                    }

                    }    
                }   
            }
        }
        this.tile = this.scene.boardArray[optimalMove.j][optimalMove.i];
        this.scene.boardArray[optimalMove.j][optimalMove.i].bIsTaken = true;
        this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);

        this.tile = this.scene.boardArray[optimalSecondMove.SecondJ][optimalSecondMove.SecondI];
        this.scene.boardArray[optimalSecondMove.SecondJ][optimalSecondMove.SecondI].bIsTaken = true;
        this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this.scene.player1);

        //console.log(optimalMove.j + " i " + optimalMove.i);
        //console.log("Optimal move zajety?: " + this.scene.boardArray[optimalMove.j][optimalMove.i].bIsTaken);

        this.scene.saveCurrentScore();
       // this.aiMakeSecondOptimalMove(optimalMove.j, optimalMove.i, this.scene.player1);
    }

    aiMakeSecondOptimalMove(j, i, owner)
    {
        let optimalScore = -Infinity;
        let optimalMove;

        if((i+1 <= 6) && (this.scene.boardArray[j][i+1].bIsTaken == false))
        {
            //Do the move
            this.tile = this.scene.boardArray[j][i+1];
            this.scene.boardArray[j][i+1].bIsTaken = true;
            this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);

            console.log("-------------------------------------------------");
            console.log("x: " + j + " y: " + (i+1));
            //Check the score
            let score = this.scene.CheckWhoHasMoreScore();

            //Undo the move
            this.tile.PawnBase = null;
            this.scene.boardArray[j][i+1].bIsTaken = false;
            
            //Bind the score
            if(score > optimalScore)
            {
                optimalScore = score;
                let tempI = i+1;
                let tempJ = j;
                optimalMove = {tempJ, tempI, optimalScore};
            }
        }
        
        if((i-1 >= 0) && (this.scene.boardArray[j][i-1].bIsTaken == false))
        {
            //Do the move
            this.tile = this.scene.boardArray[j][i-1];
            this.scene.boardArray[j][i-1].bIsTaken = true;
            this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
            
            console.log("-------------------------------------------------");
            console.log("x: " + j + " y: " + (i-1));

            //Check the score
            let score = this.scene.CheckWhoHasMoreScore();

            //Undo the move
            this.tile.PawnBase = null;
            this.scene.boardArray[j][i-1].bIsTaken = false;
            
            //Bind the score
            if(score > optimalScore)
            {
                optimalScore = score;
                let tempI = i-1;
                let tempJ = j;
                optimalMove = {tempJ, tempI, optimalScore};
            }
        }   

        if((j+1 <= 6) && (this.scene.boardArray[j+1][i].bIsTaken == false))
        {
            //Do the move
            this.tile = this.scene.boardArray[j+1][i];
            this.scene.boardArray[j+1][i].bIsTaken = true;
            this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
            
            console.log("-------------------------------------------------");
            console.log("x: " + (j+1) + " y: " + i);
            //Check the score
            let score = this.scene.CheckWhoHasMoreScore();

            //Undo the move
            this.tile.PawnBase = null;
            this.scene.boardArray[j+1][i].bIsTaken = false;
            
            //Bind the score
            if(score > optimalScore)
            {
                optimalScore = score;
                let tempJ = j+1;
                let tempI = i;
                optimalMove = {tempJ, tempI, optimalScore};
            }
        }

        if((j-1 >= 0) && (this.scene.boardArray[j-1][i].bIsTaken == false))
        {
            //Do the move
            this.tile = this.scene.boardArray[j-1][i];
            this.scene.boardArray[j-1][i].bIsTaken = true;
            this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
            
            console.log("-------------------------------------------------");
            console.log("x: " + (j-1) + " y: " + i);
            //Check the score
            let score = this.scene.CheckWhoHasMoreScore();

            //Undo the move
            this.tile.PawnBase = null;
            this.scene.boardArray[j-1][i].bIsTaken = false;
            //Bind the score
            if(score > optimalScore)
            {
                optimalScore = score;
                let tempJ = j-1;
                let tempI = i;
                optimalMove = {tempJ, tempI, optimalScore};
            }
        }  

        return optimalMove;

        //this.tile = this.scene.boardArray[optimalMove.tempJ][optimalMove.tempI];
        //this.scene.boardArray[optimalMove.tempJ][optimalMove.tempI].bIsTaken = true;
        //this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', owner);
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
                        this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);

                        if(depth < maxDepth)
                        {
                            score = this.minimax(board, depth + 1, true, this.scene.AI1, maxDepth);
                        }
                        else 
                        {
                            score = this.scene.CheckWhoHasMoreScore();
                        }
                        if(score > optimalScore)
                        {
                            optimalScore = score;              
                        } 
                        else if(score == optimalScore)
                        {
                            optimalMove = {i, j};
                        }

                        this.tile.PawnBase = null;
                        this.scene.boardArray[j][i].bIsTaken = false;

                        }   
                    }   
                }
            } 
            return optimalScore;    
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
                            this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
    
                            if(depth < maxDepth)
                            {
                                score = this.minimax(board, depth + 1, false, this.scene.player1, maxDepth);
                            }
                            else 
                            {
                             score = this.scene.CheckWhoHasMoreScore();  
                            }
                            if(score < optimalScore)
                            {
                                optimalScore = score;  
                            } 
                            else if(score == optimalScore)
                            {
                                optimalMove = {i, j};
                            }
    
                            this.tile.PawnBase = null;
                            this.scene.boardArray[j][i].bIsTaken = false;
                        }
                    }   
                }
            } 
            return optimalScore;
        }
    }
}