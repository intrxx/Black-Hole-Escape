# TAIJI


Board Game made in Phaser 3.0 using Java Script

All assets are made by DearOhDeer

To lunch the game download the code and open index.html with Live Server

Implemented AI:

- Random AI,
- Minimax AI,
- Negamax AI,
- Alpha-Beta AI.


Monte Carlo Code:

```js
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
            // Do the first move
            if(!(this.scene.CheckIfAnyFreeTilesAround(j, i) && this.scene.boardArray[j][i].bIsFinalTaken == false)) continue;

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
                let move = {i, j};
                let secondMove = {sI, sJ};
                let cordIf;
                let bIsPlaced = false;
                
                // Simulate the game till end
                while(this.scene.CheckHowManyMovesPossible() > 0 )
                {
                    if(nextPlayer == this.scene.AI1)
                    {
                        do 
                        {
                            move.j = Phaser.Math.Between(0, 6);
                            move.i = Phaser.Math.Between(0, 6); 
    
                        } while(!(this.scene.CheckIfAnyFreeTilesAround(move.j, move.i) && this.scene.boardArray[j][i].bIsFinalTaken == false))
    
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
    
                        } while(!(this.scene.CheckIfAnyFreeTilesAround(move.j, move.i) && this.scene.boardArray[j][i].bIsFinalTaken == false))
                        
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

                // Check the score
                if(SecondPawnOwner == this.scene.AI2)
                {
                    let OldAI1Score = this.scene.AI1.score;
                    let OldAI2Score = this.scene.AI2.score;
    
                    this.scene.GoThroughBoardCountingScore();
                    
                    // Add to wining if AI won the simulation
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

                // Clear the board of simulation
                for(let i = 0; i < 7; i++)
                {
                    for(let j = 0; j < 7; j++)
                    {
                        if(this.scene.boardArray[j][i].bIsFinalTaken === false)
                        {
                            this.tile = this.scene.boardArray[j][i];
                            this.tile.PawnBase = null;
                            this.scene.boardArray[j][i].bIsTaken = false;
                        }  
                    }
                }           
            }
            let propability = wining / noOfSims;
             
            // Assign the wining cords to best moves
            if(propability > bestPropability)
            {
                bestPropability = propability;
                bestMove.x = j;
                bestMove.y = i;
                secondMoveBestMove.x = sJ;
                secondMoveBestMove.y = sI;
            }             
        }
    }
    

    // Play the best move
    this.tile = this.scene.boardArray[bestMove.x][bestMove.y];
    this.scene.boardArray[bestMove.x][bestMove.y].bIsTaken = true;
    this.scene.boardArray[bestMove.x][bestMove.y].bIsFinalTaken = true;
    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'BlackPiece', this.scene.AI1);

    this.tile = this.scene.boardArray[secondMoveBestMove.x][secondMoveBestMove.y];
    this.scene.boardArray[secondMoveBestMove.x][secondMoveBestMove.y].bIsTaken = true;
    this.scene.boardArray[secondMoveBestMove.x][secondMoveBestMove.y].bIsFinalTaken = true;
    this.tile.PawnBase = new PawnBase(this.scene, this.tile.XOffset, this.tile.YOffset, 'WhitePiece', SecondPawnOwner);
    
    }
    ```
