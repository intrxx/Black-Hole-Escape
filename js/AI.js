import PawnBase from "../js/PawnBase.js"


export default class AI 
{
    constructor(scene, name , TypeOfAi)
    {
        this.scene = scene;

        this.name = name;
		
		this.TypeOfAi = TypeOfAi;

        this.bAIMadeMove = false;

        this.score = 0;
		this.shapeCount = 0;
		this.shapeOnAvr = 0;
		this.secondBigShape = 0;
    }
	
    //----------------------------------------------------------------------------------------------------------------------------------------------
    // START OF RANDOM AI

    aiMakeFirstRandomMove(AI)
    {   
        let randomX = Phaser.Math.Between(0, 6);
        let randomY = Phaser.Math.Between(0, 6);
		let Player1;
		let Player2;

        if((this.scene.boardArray[randomX][randomY].bIsTaken == false) && (this.scene.CheckIfAnyFreeTilesAround(randomX, randomY)))
         {
            this.tile = this.scene.boardArray[randomX][randomY];
            this.scene.boardArray[randomX][randomY].bIsTaken = true;
            this.scene.boardArray[randomX][randomY].bIsFinalTaken = true;
            
            if(this.scene.getNumberOfAI() == 1)
            {
				Player1 = this.scene.player1;
				Player2 = this.scene.AI1;
            }
            else if(this.scene.getNumberOfAI() == 2)
            {
                if(this.scene.AIType == "Random")
                {
					Player1 = this.scene.AI1;
					Player2 = this.scene.AI2;
                }
                else if(this.scene.AIType == "Minimax" || this.scene.AIType == "Negamax"  || this.scene.AIType == "AlfaBeta" || this.scene.AIType == "Montecarlo")
                {
					Player1 = this.scene.AI2;
					Player2 = this.scene.AI1;
                } 
            }  
			this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', Player1);
            this.aiMakeSecondRandomMove(Player2, randomX, randomY);   
         }
        else if(this.scene.CheckHowManyMovesPossible() > 0)
        {
            this.aiMakeFirstRandomMove(AI);
        }
    }

    aiMakeSecondRandomMove(Owner, x, y)
    {
        let bIsPlaced = false;
		let cordIf;
		let xCord;
		let yCord;
		
        do
        {
            let randomNum = Phaser.Math.Between(0, 3);
            switch (randomNum) 
			{
                case 0:
                        cordIf = (y+1 <= 6);
						xCord = (x);
						yCord = (y+1);

                    break;
                case 1:
                      	cordIf = (y-1 >= 0);
						xCord = (x);
						yCord = (y-1);
                    break;
                case 2:
						cordIf = (x+1 <= 6);
						xCord = (x+1);
						yCord = y;
                    break;
                case 3:
						cordIf = (x-1 >= 0);
						xCord = (x-1);
						yCord = y;
                    break;    
                default:
                    console.log("Fail reading random number")
                    break;
			}
				if(cordIf && (this.scene.boardArray[xCord][yCord].bIsTaken == false))
				{
				this.tile = this.scene.boardArray[xCord][yCord];
                this.scene.boardArray[xCord][yCord].bIsTaken = true; 
                this.scene.boardArray[xCord][yCord].bIsFinalTaken = true;      
                this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', Owner);
                bIsPlaced = true;	
				}
					
            
        } while(bIsPlaced != true)    
    }

    // END OF RANDOM AI
    //----------------------------------------------------------------------------------------------------------------------------------------------
    // START OF MINIMAX AI

    aiMakeFirstMinimaxOptimalMove() 
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
                    //Mark the spot with first pawn
                    this.tile = this.scene.boardArray[j][i];
                    this.scene.boardArray[j][i].bIsTaken = true;
                    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', this.scene.AI1);
                    
                    //Enter the function that places second pawn and call minimax in it
					if (this.scene.getNumberOfAI() == 2)
					{
                    optimalSecondMoveScore = this.aiMakeSecondMinimaxOptimalMove(j, i, this.scene.AI2, true, 0, true, true);
					}
					else
					{
					optimalSecondMoveScore = this.aiMakeSecondMinimaxOptimalMove(j, i, this.scene.player1, true, 0, true, true);
					}
				
                    //Unmark the spot
                    this.tile = this.scene.boardArray[j][i];
                    this.tile.PawnBase = null;
                    this.scene.boardArray[j][i].bIsTaken = false;
                    
                    if(optimalSecondMoveScore.optimalScore > optimalScore)
                    {
                        optimalScore = optimalSecondMoveScore.optimalScore;
                        optimalMove = {j, i};
                        
                        let SecondJ = optimalSecondMoveScore.tempJ;
                        let SecondI = optimalSecondMoveScore.tempI;
                        optimalSecondMove = {SecondJ, SecondI};
                    }     
                }   
            }
        }
        //Place the pawn on the optimal tiles
        if(this.scene.CheckHowManyMovesPossible() > 0)
        {
			
            this.tile = this.scene.boardArray[optimalMove.j][optimalMove.i];
            this.scene.boardArray[optimalMove.j][optimalMove.i].bIsTaken = true;
            this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);
			
            this.tile = this.scene.boardArray[optimalSecondMove.SecondJ][optimalSecondMove.SecondI];
            this.scene.boardArray[optimalSecondMove.SecondJ][optimalSecondMove.SecondI].bIsTaken = true;
			if (this.scene.getNumberOfAI() == 2)
			{
			 this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this.scene.AI2);	
			}
			else
			{
			this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this.scene.player1);	
			}
			this.scene.CheckWhoHasMoreScore();
            
        }
        
        this.scene.saveCurrentScore();
    }

    aiMakeSecondMinimaxOptimalMove(j, i, owner, bCallMiniMax, depth, isMaximizing, bFirstCall)
    {
        let optimalMove;
        let XCord;
        let YCord;
        let FirstCheck;
		let score;
		let bCheckOptimalScore;
		let optimalScore;

        if (isMaximizing)
        {
            optimalScore = -Infinity;
        }
        else 
        {
            optimalScore = Infinity;
        }

        for(let z = 0; z < 4; z++) 
        {
            switch (z)
            {
            case 0:
                XCord = i+1
                YCord = j
                FirstCheck = (i+1 <= 6);
              break;
            case 1:
                XCord = i
                YCord = j+1
                FirstCheck = (j+1 <= 6);
              break;
            case 2:
                XCord = i
                YCord = j-1
                FirstCheck = (j-1 >= 0);
              break;
            case 3:
                XCord = i-1
                YCord = j
                FirstCheck = (i-1 >= 0);
              break;  
            }
            
            if((FirstCheck == true) && (this.scene.boardArray[YCord][XCord].bIsTaken == false))
            {
             //Do the move 
             this.tile = this.scene.boardArray[YCord][XCord];
             this.scene.boardArray[YCord][XCord].bIsTaken = true;
             this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
            
              //Call minimax
              if(bCallMiniMax == true)
              {
				if(depth < this.scene.MaxDepth)
                {
                    if (this.scene.getNumberOfAI() == 2 && isMaximizing == false)
                    {
                        score = this.minimax(depth, true, this.scene.AI1);	
                    }
                    else if(this.scene.getNumberOfAI() == 2 && isMaximizing == true)
                    {
                        score = this.minimax(depth, false, this.scene.AI2);
                    }
                    else if(this.scene.getNumberOfAI() == 1 && isMaximizing == true)
                    {
                        score = this.minimax(depth, false, this.scene.player1);
                    }
                    else if(this.scene.getNumberOfAI() == 1 && isMaximizing == false)
                    {
                        score = this.minimax(depth, true, this.scene.AI1);	
                    }
                }
				else
                {
                    score = this.scene.CheckWhoHasMoreScore();
                }	
             }
             else
             {
                 score = this.scene.CheckWhoHasMoreScore();
             }

            if (isMaximizing)
            {
                bCheckOptimalScore = (score >  optimalScore);
            }
            else if(!isMaximizing)
            {
                bCheckOptimalScore = (score <  optimalScore);
            }

             this.tile = this.scene.boardArray[YCord][XCord];
             this.tile.PawnBase = null;
             this.scene.boardArray[YCord][XCord].bIsTaken = false;
             
             if(bCheckOptimalScore)
             {
                 optimalScore = score;
                 let tempI = XCord;
                 let tempJ = YCord;
                 optimalMove = {tempJ, tempI, optimalScore};
             }
        }
        }  

        if (bFirstCall)
        {
            return optimalMove;    
        }
        return  optimalScore;
           
    }
    
    minimax(depth, isMaximizing, owner)
    {
        let optimalScore;
        let ownerOfSecondPawn
        let score=0;
        
        if(isMaximizing)
        {
            optimalScore = -Infinity;
            ownerOfSecondPawn = this.scene.AI1;
        }
        else 
        {
            optimalScore = Infinity;
            
            if (this.scene.getNumberOfAI() == 2)
            {
                ownerOfSecondPawn = this.scene.AI2;
            }
            else
            {
                ownerOfSecondPawn = this.scene.player1;
            }
        }

        for(let i = 0; i < 7; i++)
        {
            for(let j = 0; j < 7; j++)
            {
                if(this.scene.boardArray[j][i].bIsTaken == false && this.scene.CheckIfAnyFreeTilesAround(j, i))
                {
                    this.tile = this.scene.boardArray[j][i];
                    this.scene.boardArray[j][i].bIsTaken = true;
                    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
            
                    if(depth < this.scene.MaxDepth)
                    {
                        depth++;
                        score = this.aiMakeSecondMinimaxOptimalMove(j, i, ownerOfSecondPawn, true, depth, isMaximizing, false);
                    }
                    else 
                    {
                        score = this.scene.CheckWhoHasMoreScore();
                    }

                    if(isMaximizing)
                    {
                        if(score > optimalScore)
                        {
                            optimalScore = score;     
                        }
                                        
                    } 
                    else if(!isMaximizing)
                    {
                        if(score < optimalScore)
                        {
                            optimalScore = score;        
                        } 
                    }
                        this.tile = this.scene.boardArray[j][i];
                        this.tile.PawnBase = null;
                        this.scene.boardArray[j][i].bIsTaken = false;
                }   
            }
        } 

        if (optimalScore == Infinity || optimalScore == -Infinity)
        {
            return optimalScore = 0;     
        }
            
            return optimalScore;    
    }

    // END OF MINIMAX AI
    //----------------------------------------------------------------------------------------------------------------------------------------------
    // START OF NEGAMAX AI

    aiMakeFirstNegamaxOptimalMove() 
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
                    this.tile = this.scene.boardArray[j][i];
                    this.scene.boardArray[j][i].bIsTaken = true;
                    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', this.scene.AI1);
                    
					if (this.scene.getNumberOfAI() == 2)
					{
                    optimalSecondMoveScore = this.aiMakeSecondNegamaxOptimalMove(j, i, this.scene.AI2, true, 0, 1, true);
					}
					else
					{
					optimalSecondMoveScore = this.aiMakeSecondNegamaxOptimalMove(j, i, this.scene.player1, true, 0, 1, true);
					}
				
                    this.tile = this.scene.boardArray[j][i];
                    this.tile.PawnBase = null;
                    this.scene.boardArray[j][i].bIsTaken = false;
                    
                    if(optimalSecondMoveScore.optimalScore > optimalScore)
                    {
                        optimalScore = optimalSecondMoveScore.optimalScore;
                        optimalMove = {j, i};
                        
                        let SecondJ = optimalSecondMoveScore.tempJ;
                        let SecondI = optimalSecondMoveScore.tempI;
                        optimalSecondMove = {SecondJ, SecondI};
                    }     
                }   
            }
        }
        if(this.scene.CheckHowManyMovesPossible() > 0)
        {
			
            this.tile = this.scene.boardArray[optimalMove.j][optimalMove.i];
            this.scene.boardArray[optimalMove.j][optimalMove.i].bIsTaken = true;
            this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);
			
            this.tile = this.scene.boardArray[optimalSecondMove.SecondJ][optimalSecondMove.SecondI];
            this.scene.boardArray[optimalSecondMove.SecondJ][optimalSecondMove.SecondI].bIsTaken = true;
			if (this.scene.getNumberOfAI() == 2)
			{
			 this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this.scene.AI2);	
			}
			else
			{
			this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this.scene.player1);	
			}
			this.scene.CheckWhoHasMoreScore();
        }
        this.scene.saveCurrentScore();
    }

    aiMakeSecondNegamaxOptimalMove(j, i, owner, bCallNegaMax, depth, sign, bFirstCall)
    {
        let optimalMove;
        let XCord;
        let YCord;
        let FirstCheck;
		let score;
		let optimalScore;
        optimalScore = -Infinity;
       
        for(let z = 0; z < 4; z++) 
        {
            switch (z)
            {
            case 0:
                XCord = i+1
                YCord = j
                FirstCheck = (i+1 <= 6);
              break;
            case 1:
                XCord = i
                YCord = j+1
                FirstCheck = (j+1 <= 6);
              break;
            case 2:
                XCord = i
                YCord = j-1
                FirstCheck = (j-1 >= 0);
              break;
            case 3:
                XCord = i-1
                YCord = j
                FirstCheck = (i-1 >= 0);
              break;  
            }
            
            if((FirstCheck == true) && (this.scene.boardArray[YCord][XCord].bIsTaken == false))
            {
                this.tile = this.scene.boardArray[YCord][XCord];
                this.scene.boardArray[YCord][XCord].bIsTaken = true;
                this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
                
                if(bCallNegaMax == true)
                {
                    if(depth < this.scene.MaxDepth)
                    {
                        if (this.scene.getNumberOfAI() == 2)
                        {
                            score = this.negamax(depth, sign, this.scene.AI1);	
                        }
                        else if(this.scene.getNumberOfAI() == 1)
                        {
                            score = this.negamax(depth, sign, this.scene.player1);
                        }
                    }
                    else
                    {
                        score = this.scene.CheckWhoHasMoreScore();
                    }	
                }
                else
                {
                    score = this.scene.CheckWhoHasMoreScore();
                }

                this.tile = this.scene.boardArray[YCord][XCord];
                this.tile.PawnBase = null;
                this.scene.boardArray[YCord][XCord].bIsTaken = false;
                
                if(score > optimalScore)
                {
                    optimalScore = score;
                    let tempI = XCord;
                    let tempJ = YCord;
                    optimalMove = {tempJ, tempI, optimalScore};
                }
            }
        }  

        if (bFirstCall)
        {
            return optimalMove;    
        }
        return  optimalScore;
           
    }

    negamax(depth, sign, owner)
    {
        let optimalScore;
        let ownerOfSecondPawn
        let score=0;
        
        optimalScore = -Infinity;
            
        if (this.scene.getNumberOfAI() == 2)
        {
            ownerOfSecondPawn = this.scene.AI2;
        }
        else
        {
            ownerOfSecondPawn = this.scene.player1;
        }
        
        for(let i = 0; i < 7; i++)
        {
            for(let j = 0; j < 7; j++)
            {
                if(this.scene.boardArray[j][i].bIsTaken == false && this.scene.CheckIfAnyFreeTilesAround(j, i))
                {
                    this.tile = this.scene.boardArray[j][i];
                    this.scene.boardArray[j][i].bIsTaken = true;
                    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
            
                    if(depth < this.scene.MaxDepth)
                    {
                        depth++;
                        score = this.aiMakeSecondNegamaxOptimalMove(j, i, ownerOfSecondPawn, true, depth, -sign, false);
                    }
                    else 
                    {
                        score = this.scene.CheckWhoHasMoreScore();
                    }

                    if(score > optimalScore)
                    {
                        optimalScore = score;     
                    }
                                        
                    this.tile = this.scene.boardArray[j][i];
                    this.tile.PawnBase = null;
                    this.scene.boardArray[j][i].bIsTaken = false;
                }   
            }
        } 

        if (optimalScore == Infinity || optimalScore == -Infinity)
        {
            return optimalScore = 0;     
        }
            
            return optimalScore;    
    }

    // END OF Negamax AI
    //----------------------------------------------------------------------------------------------------------------------------------------------
	// START OF ALFABETA AI
	
	aiMakeFirstAlfaBetaOptimalMove() 
    {
        this.scene.saveCurrentScore();
        let optimalScore = -Infinity;
        let optimalSecondMoveScore;
        let optimalMove;
        let optimalSecondMove;
		let AlfaBetaArrayScore = Array.from(Array(2), () => new Array(this.scene.MaxDepth));
		
		AlfaBetaArrayScore = this.ClearAlfaBeta(AlfaBetaArrayScore);
		
        for(let i = 0; i < 7; i++)
        {
            for(let j = 0; j < 7; j++)
            {
                if(this.scene.boardArray[j][i].bIsTaken == false && this.scene.CheckIfAnyFreeTilesAround(j, i))
                {
                    //Mark the spot with first pawn
                    this.tile = this.scene.boardArray[j][i];
                    this.scene.boardArray[j][i].bIsTaken = true;
                    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', this.scene.AI1);
                    
                    //Enter the function that places second pawn and call minimax in it
					if (this.scene.getNumberOfAI() == 2)
					{
                    optimalSecondMoveScore = this.aiMakeSecondAlfaBetaOptimalMove(j, i, this.scene.AI2, true, 0, true, true, AlfaBetaArrayScore);
					}
					else
					{
					optimalSecondMoveScore = this.aiMakeSecondAlfaBetaOptimalMove(j, i, this.scene.player1, true, 0, true, true,AlfaBetaArrayScore);
					}
				
                    //Unmark the spot
                    this.tile = this.scene.boardArray[j][i];
                    this.tile.PawnBase = null;
                    this.scene.boardArray[j][i].bIsTaken = false;
                    
                    if(optimalSecondMoveScore.optimalScore > optimalScore)
                    {
                        optimalScore = optimalSecondMoveScore.optimalScore;
                        optimalMove = {j, i};
                        
                        let SecondJ = optimalSecondMoveScore.tempJ;
                        let SecondI = optimalSecondMoveScore.tempI;
                        optimalSecondMove = {SecondJ, SecondI};
                    }     
                }   
            }
        }
        //Place the pawn on the optimal tiles
        if(this.scene.CheckHowManyMovesPossible() > 0)
        {
			
            this.tile = this.scene.boardArray[optimalMove.j][optimalMove.i];
            this.scene.boardArray[optimalMove.j][optimalMove.i].bIsTaken = true;
            this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);
			
            this.tile = this.scene.boardArray[optimalSecondMove.SecondJ][optimalSecondMove.SecondI];
            this.scene.boardArray[optimalSecondMove.SecondJ][optimalSecondMove.SecondI].bIsTaken = true;
			if (this.scene.getNumberOfAI() == 2)
			{
			 this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this.scene.AI2);	
			}
			else
			{
			this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', this.scene.player1);	
			}
			this.scene.CheckWhoHasMoreScore();
            
        }
        
        this.scene.saveCurrentScore();
    }

    aiMakeSecondAlfaBetaOptimalMove(j, i, owner, bCallAlfaBeta, depth, isMaximizing, bFirstCall,AlfaBetaArrayScore)
    {
        let optimalMove;
        let XCord;
        let YCord;
        let FirstCheck;
		let score;
		let bCheckOptimalScore;
		let optimalScore;
		

        if (isMaximizing)
        {
            optimalScore = -Infinity;
			
        }
        else 
        {
            optimalScore = Infinity;
        }

        for(let z = 0; z < 4; z++) 
        {
            switch (z)
            {
            case 0:
                XCord = i+1
                YCord = j
                FirstCheck = (i+1 <= 6);
              break;
            case 1:
                XCord = i
                YCord = j+1
                FirstCheck = (j+1 <= 6);
              break;
            case 2:
                XCord = i
                YCord = j-1
                FirstCheck = (j-1 >= 0);
              break;
            case 3:
                XCord = i-1
                YCord = j
                FirstCheck = (i-1 >= 0);
              break;  
            }
            
            if((FirstCheck == true) && (this.scene.boardArray[YCord][XCord].bIsTaken == false))
            {
             //Do the move 
             this.tile = this.scene.boardArray[YCord][XCord];
             this.scene.boardArray[YCord][XCord].bIsTaken = true;
             this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
            
              //Call AlfaBeta
				if(bCallAlfaBeta == true && depth < this.scene.MaxDepth)
                {
                    if (this.scene.getNumberOfAI() == 2 && isMaximizing == false)
                    {
                        score = this.AlfaBeta(depth, true, this.scene.AI1,AlfaBetaArrayScore);	
                    }
                    else if(this.scene.getNumberOfAI() == 2 && isMaximizing == true)
                    {
                        score = this.AlfaBeta(depth, false, this.scene.AI2,AlfaBetaArrayScore);
                    }
                    else if(this.scene.getNumberOfAI() == 1 && isMaximizing == true)
                    {
                        score = this.AlfaBeta(depth, false, this.scene.player1,AlfaBetaArrayScore);
                    }
                    else if(this.scene.getNumberOfAI() == 1 && isMaximizing == false)
                    {
                        score = this.AlfaBeta(depth, true, this.scene.AI1,AlfaBetaArrayScore);	
                    }
                }
				else
                {
                    score = this.scene.CheckWhoHasMoreScore();
                }	

            if (isMaximizing)
            {
                bCheckOptimalScore = (score >  optimalScore);
            }
            else if(!isMaximizing)
            {
                bCheckOptimalScore = (score <  optimalScore);
            }

             this.tile = this.scene.boardArray[YCord][XCord];
             this.tile.PawnBase = null;
             this.scene.boardArray[YCord][XCord].bIsTaken = false;
             
             if(bCheckOptimalScore)
             {
                 optimalScore = score;
                 let tempI = XCord;
                 let tempJ = YCord;
                 optimalMove = {tempJ, tempI, optimalScore};
             }
        }
        }  

        if (bFirstCall)
        {
            return optimalMove;    
        }
        return  optimalScore;
           
    }
    
    AlfaBeta(depth, isMaximizing, owner , AlfaBetaArrayScore)
    {
        let optimalScore;
        let ownerOfSecondPawn
        let score=0;
        
        if(isMaximizing)
        {
            optimalScore = -Infinity;
            ownerOfSecondPawn = this.scene.AI1;
        }
        else 
        {
            optimalScore = Infinity;
            
            if (this.scene.getNumberOfAI() == 2)
            {
                ownerOfSecondPawn = this.scene.AI2;
            }
            else
            {
                ownerOfSecondPawn = this.scene.player1;
            }
        }

        for(let i = 0; i < 7; i++)
        {
            for(let j = 0; j < 7; j++)
            {
                if(this.scene.boardArray[j][i].bIsTaken == false && this.scene.CheckIfAnyFreeTilesAround(j, i))
                {
                    this.tile = this.scene.boardArray[j][i];
                    this.scene.boardArray[j][i].bIsTaken = true;
                    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', owner);
					score = this.scene.CheckWhoHasMoreScore();
					
					if(isMaximizing)
					{ 
						if(depth < this.scene.MaxDepth && AlfaBetaArrayScore[0][depth] > score)
						{
							depth++;
							AlfaBetaArrayScore[0][depth] = score;
							score = this.aiMakeSecondAlfaBetaOptimalMove(j, i, ownerOfSecondPawn, true, depth, isMaximizing, false,AlfaBetaArrayScore);
							
						}
					}
					else
					{
						if(depth < this.scene.MaxDepth && AlfaBetaArrayScore[1][depth] < score)
						{
							depth++;
							AlfaBetaArrayScore[1][depth] = score;
							score = this.aiMakeSecondAlfaBetaOptimalMove(j, i, ownerOfSecondPawn, true, depth, isMaximizing, false,AlfaBetaArrayScore);
							
						}
					}

                    if(isMaximizing)
                    {
                        if(score > optimalScore)
                        {
                            optimalScore = score;     
                        }
                                        
                    } 
                    else if(!isMaximizing)
                    {
                        if(score < optimalScore)
                        {
                            optimalScore = score;        
                        } 
                    }
                        this.tile = this.scene.boardArray[j][i];
                        this.tile.PawnBase = null;
                        this.scene.boardArray[j][i].bIsTaken = false;
                }   
            }
        } 

        if (optimalScore == Infinity || optimalScore == -Infinity)
        {
            return optimalScore = 0;     
        }
            
            return optimalScore;    
    }
	
	ClearAlfaBeta(AlfaBetaArrayScore)
	{
		for (let i = 0; i < 2; i++)
		{
			for (let j = 0; j < this.scene.MaxDepth; j++)
			{
				if(i == 0)
				{
				AlfaBetaArrayScore[i][j] = -Infinity;
				}
				else 
				{
				AlfaBetaArrayScore[i][j] = 	Infinity;
				}					
				
			}
			
		}
		return AlfaBetaArrayScore;
		
	}

	// END OF ALFABETA AI
    //----------------------------------------------------------------------------------------------------------------------------------------------
    // START OF MONTE CARLO SEARCH

    MonteCarloSearch(noOfSims, SecondPawnOwner)
    {
    let bestMove = {x: 0, y:0};
    let secondMoveBestMove = {x: 0, y:0};
    let bestPropability = -1;
    let bIsFPlaced = false;  
    let cordFIf;
    let sI = 0;
    let sJ = 0;   
 
    for(let i = 0; i < 7; i++)
    {
        for(let j = 0; j < 7; j++)
        {   
            if(!(this.scene.CheckIfAnyFreeTilesAround(j, i))) continue;

                this.tile = this.scene.boardArray[j][i];
                this.scene.boardArray[j][i].bIsTaken = true;
                this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', this.scene.AI1);

                bIsFPlaced = false;   
                do
                {
                    let randomNum = Phaser.Math.Between(0, 3);
                    switch (randomNum) 
                    {
                        case 0:
                            cordFIf = (i+1 <= 6);
                            sJ = (j);
                            sI = (i+1);
                            break;
                        case 1:
                            cordFIf = (i-1 >= 0);
                            sJ = (j);
                            sI = (i-1);
                            break;
                        case 2:
                            cordFIf = (j+1 <= 6);
                            sJ = (j+1);
                            sI = (i);
                            break;
                        case 3:
                            cordFIf = (j-1 >= 0);
                            sJ = (j-1);
                            sI = (i);
                            break;    
                    }
                        if(cordFIf && (this.scene.boardArray[sJ][sI].bIsTaken == false))
                        {
                            this.tile = this.scene.boardArray[sJ][sI];
                            this.scene.boardArray[sJ][sI].bIsTaken = true;       
                            this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', SecondPawnOwner);

                            bIsFPlaced = true;	
                        }
                } while(bIsFPlaced != true) 
               
            let wining = 0;
            
            for(let x = 0; x < noOfSims; x++)
            {
                let nextPlayer = SecondPawnOwner;
                let move = {j, i};
                let secondMove = {sJ, sI};
                //console.log("Move: x = " + secondMove.sJ + " y = " + secondMove.sI);
                let cordIf;
                let bIsPlaced = false;
                
                while(this.scene.CheckHowManyMovesPossible() != 0 )
                {
                    if(nextPlayer == this.scene.AI1)
                    {
                        do 
                        {
                            move.j = Phaser.Math.Between(0, 6);
                            move.i = Phaser.Math.Between(0, 6); 
    
                        } while(!(this.scene.CheckIfAnyFreeTilesAround(move.j, move.i)))
    
                        //console.log("x: " + move.j + " y: " + move.i);
                        this.tile = this.scene.boardArray[move.j][move.i];
                        this.scene.boardArray[move.j][move.i].bIsTaken = true;
                        this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', this.scene.AI1);

                        bIsPlaced = false;
                        do
                        {   
                            let randomNum = Phaser.Math.Between(0, 3);
                            switch (randomNum) 
                            {
                                case 0:
                                        cordIf = (move.i+1 <= 6);
                                        secondMove.sJ = (move.j);
                                        secondMove.sI = (move.i+1);
                
                                    break;
                                case 1:
                                        cordIf = (move.i-1 >= 0);
                                        secondMove.sJ = (move.j);
                                        secondMove.sI = (move.i-1);
                                    break;
                                case 2:
                                        cordIf = (move.j+1 <= 6);
                                        secondMove.sJ = (move.j+1);
                                        secondMove.sI = (move.i);
                                    break;
                                case 3:
                                        cordIf = (move.j-1 >= 0);
                                        secondMove.sJ = (move.j-1);
                                        secondMove.sI = (move.i);
                                    break;    
                            }
                                if(cordIf && (this.scene.boardArray[secondMove.sJ][secondMove.sI].bIsTaken == false))
                                {
                                    this.tile = this.scene.boardArray[secondMove.sJ][secondMove.sI];
                                    this.scene.boardArray[secondMove.sJ][secondMove.sI].bIsTaken = true;       
                                    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', SecondPawnOwner);

                                    bIsPlaced = true;	
                                }

                                nextPlayer = SecondPawnOwner;
                        } while(bIsPlaced != true)
                    }
                    else if(nextPlayer == SecondPawnOwner)
                    {
                        do 
                        {
                            move.j = Phaser.Math.Between(0, 6);
                            move.i = Phaser.Math.Between(0, 6); 
    
                        } while(!this.scene.CheckIfAnyFreeTilesAround(move.j, move.i))
                        
                        //console.log("x: " + move.j + " y: " + move.i);
                        
                        this.tile = this.scene.boardArray[move.j][move.i];
                        this.scene.boardArray[move.j][move.i].bIsTaken = true;
                        this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', this.scene.AI1);
                        
                        bIsPlaced = false;
                        do
                        {
                            let randomNum = Phaser.Math.Between(0, 3);
                            switch (randomNum) 
                            {
                                case 0:
                                        cordIf = (move.i+1 <= 6);
                                        secondMove.sJ = (move.j);
                                        secondMove.sI = (move.i+1);
                
                                    break;
                                case 1:
                                        cordIf = (move.i-1 >= 0);
                                        secondMove.sJ = (move.j);
                                        secondMove.sI = (move.i-1);
                                    break;
                                case 2:
                                        cordIf = (move.j+1 <= 6);
                                        secondMove.sJ = (move.j+1);
                                        secondMove.sI = (move.i);
                                    break;
                                case 3:
                                        cordIf = (move.j-1 >= 0);
                                        secondMove.sJ = (move.j-1);
                                        secondMove.sI = (move.i);
                                    break;       
                            }
                                if(cordIf && (this.scene.boardArray[secondMove.sJ][secondMove.sI].bIsTaken == false))
                                {
                                    this.tile = this.scene.boardArray[secondMove.sJ][secondMove.sI];
                                    this.scene.boardArray[secondMove.sJ][secondMove.sI].bIsTaken = true;       
                                    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, '1', SecondPawnOwner);

                                    bIsPlaced = true;	
                                }

                                nextPlayer = this.scene.AI1;
                        } while(bIsPlaced != true)

                    }

                }

                if(SecondPawnOwner == this.scene.AI2)
                {
                    let OldAI1Score = this.scene.AI1.score;
                    let OldAI2Score = this.scene.AI2.score;
    
                    this.scene.GoThroughBoardCountingScore();
    
                    if(this.scene.AI1.score > this.scene.AI2.score) 
                    {
                        wining++;
                    }
    
                    this.scene.AI1.score = OldAI1Score;
                    this.scene.AI2.score = OldAI2Score;
                }
                else if(SecondPawnOwner == this.scene.player1)
                {
                    let OldAI1Score = this.scene.AI1.score;
                    let OldPlayerScore = this.scene.player1.score;
    
                    this.scene.GoThroughBoardCountingScore();
    
                    if(this.scene.AI1.score > this.scene.player1.score) 
                    {
                        wining++;
                    }
    
                    this.scene.AI1.score = OldAI1Score;
                    this.scene.player1.score = OldPlayerScore; 
                }
                
                for(let i = 0; i < 7; i++)
                {
                    for(let j = 0; j < 7; j++)
                    {
                        //console.log("x: " + j + " y: " + i + " Polozony: " + this.scene.boardArray[j][i].bIsFinalTaken)
                        if(this.scene.boardArray[j][i].bIsFinalTaken === false)
                        {
                            this.tile = this.scene.boardArray[j][i];
                            this.tile.PawnBase = null;
                            this.scene.boardArray[j][i].bIsTaken = false;
                        }  
                    }
                } 
                
            }
                //console.log("Winings: " + wining)
                let propability = wining / noOfSims;
                //console.log("Propability: " + propability)

                if(bestPropability < propability)
                {
                    //console.log("kurwa")
                    bestPropability = propability;

                    bestMove.x = j;
                    bestMove.y = i;
                    secondMoveBestMove.x = sJ;
                    secondMoveBestMove.y = sI;
                }
                
                
                    this.tile = this.scene.boardArray[j][i];
                    this.tile.PawnBase = null;
                    this.scene.boardArray[j][i].bIsTaken = false;

                    this.tile = this.scene.boardArray[sJ][sI];
                    this.tile.PawnBase = null;
                    this.scene.boardArray[sJ][sI].bIsTaken = false;
                        
        }
    }

   // console.log("Best move: x:" + bestMove.FtempJ + " y: " +bestMove.FtemiI);
    this.tile = this.scene.boardArray[bestMove.x][bestMove.y];
    this.scene.boardArray[bestMove.x][bestMove.y].bIsTaken = true;
    this.scene.boardArray[bestMove.x][bestMove.y].bIsFinalTaken = true;
    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);

   // console.log("Second Best move: x:" + secondMoveBestMove.tempJ + " y: " +secondMoveBestMove.tempI);
    this.tile = this.scene.boardArray[secondMoveBestMove.x][secondMoveBestMove.y];
    this.scene.boardArray[secondMoveBestMove.x][secondMoveBestMove.y].bIsTaken = true;
    this.scene.boardArray[secondMoveBestMove.x][secondMoveBestMove.y].bIsFinalTaken = true;
    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', SecondPawnOwner);
  
    }
}




