import Tile from "../js/Tile.js";
import Player from "../js/Player.js";
import AI from "../js/AI.js"

let GameOverText;
let ButtonDescription;
let Style;

export default class BoardScene extends Phaser.Scene 
{
    constructor()
    {
        super('BoardScene');
    }

    preload()
    {
        //Loading Assets
        //Boards
        this.load.image('Board', '../assets/Board.png');

        //Stones
        this.load.image('WhitePiece', '../assets/WhitePiece.png');
        this.load.image('BlackPiece', '../assets/BlackPiece.png');

        //Others
        this.load.image('Tile', '../assets/Tile.png');
        this.load.image('WhitePlayerNotification','../assets/WhitePlayerNotification.png');
        this.load.image('BlackPlayerNotification','../assets/BlackPlayerNotification.png');

        //Buttons
        this.load.image('PvP', '../assets/PvP.png');
        this.load.image('PvAI', '../assets/PvAI.png');
        this.load.image('AIvAI', '../assets/AIvAI.png');
        this.load.image('Restart', '../assets/Restart.png')

    }

    create() 
    {
        this.add.image(470, 422, 'Board').setScale(0.9);
    
        this.AIType;
        let Random = true;
        let Minimax = true;
        let Negamax = true;

        this.PvP = this.add.image(1050, 690, 'PvP').setInteractive().setScale(0.6);
        this.PvP.on('pointerdown', () => {
            this.numberofAI = 0;
            this.startGame(0);
            this.destroyButtons();
        });

        this.PvAI = this.add.image(1050, 790, 'PvAI').setInteractive().setScale(0.6);
        this.PvAI.on('pointerdown', () => {
            this.numberofAI = 1;
            this.startGame(1);
            this.destroyButtons();
        });

        this.RandomText = this.add.text(1020,160,"RANDOM");
        this.AIvAI = this.add.image(1050, 200, 'AIvAI').setInteractive().setScale(0.4);
        this.AIvAI.on('pointerdown', () => {
            this.numberofAI = 2;
            this.AIType = {Random};
            this.startGame(2);
            this.destroyButtons();
        });

        this.MinimaxText = this.add.text(1015,250,"MINIMAX");
        this.MINIMAXAIvAI = this.add.image(1050 ,290 , 'AIvAI').setInteractive().setScale(0.4);
        this.MINIMAXAIvAI.on('pointerdown', () => {
            this.numberofAI = 2;
            this.AIType = {Minimax};
            this.startGame(2);
            this.destroyButtons();
        })

        this.NegamaxText = this.add.text(1015,341,"NEGAMAX");
        this.NEGAMAXAIvAI = this.add.image(1050 ,380 , 'AIvAI').setInteractive().setScale(0.4);
        this.NEGAMAXAIvAI.on('pointerdown', () => {
            this.numberofAI = 2;
            this.AIType = {Negamax};
            this.startGame(2);
            this.destroyButtons();
        })

        this.ResetButton = this.add.image(1050, 38, 'Restart').setInteractive().setScale(0.4);
        this.ResetButton.on('pointerdown', () => {
            this.scene.restart();
        });
   
        Style = {font: "30px Arial"}
    }

    createBoard(numberOfColumns) 
    {
        let offSetX = 0;
		let offSetY = 0;

		this.boardArray = Array.from(Array(numberOfColumns), () => new Array(numberOfColumns));

		this.arrayXIndex = 0;
		this.arrayYIndex = 0;

		this.numberOfPawns = 0;

        for(let i = 0; i < numberOfColumns; i++)
        {
			this.arrayXIndex = 0;

            for (let j = 0; j < numberOfColumns; j++)
            {
                this.tile = new Tile(this, offSetX + 125, offSetY + 74, "Tile");

                this.tile.sprite.setInteractive();

                this.tile.XOffset = offSetX + 125;
				this.tile.YOffset = offSetY + 74;

            
                this.tile.indexX = j;
				this.tile.indexY = i;
                this.tile["bIsTaken"] = false;
                this.boardArray[j][i] = this.tile;
                offSetY += 115;
				this.arrayXIndex++;
            }
                offSetY = 0;
                offSetX += 115;
			    this.arrayYIndex++;
			}

        }

        AIvAIGame(FirstAI, SecondAI, AIType, bIsAlgorithTurn)
        {
            if(this.CheckHowManyMovesPossible() == 0)
            {
                this.gameOver();
                return;
            }

            if(AIType === "Random")
            {
                for(let i = 0; i < this.CheckHowManyMovesPossible(); i++)
                {
                    FirstAI.aiMakeFirstRandomMove(FirstAI)
                }
                this.AIvAIGame(SecondAI, FirstAI, "Random", bIsAlgorithTurn);
            }

            if(AIType === "Minimax")
            {
                if(bIsAlgorithTurn)
                {
                    FirstAI.aiMakeFirstMinimaxOptimalMove();
                    bIsAlgorithTurn = false;
                }
                else
                {
                    SecondAI.aiMakeFirstRandomMove(SecondAI)
                    bIsAlgorithTurn = true;
                }     
                
                this.AIvAIGame(FirstAI, SecondAI, "Minimax", bIsAlgorithTurn);    
            }

            if(AIType === "Negamax")
            {
                if(bIsAlgorithTurn)
                {
                    FirstAI.aiMakeFirstNegamaxOptimalMove();
                    bIsAlgorithTurn = false;
                }
                else
                {
                    SecondAI.aiMakeFirstRandomMove(SecondAI)
                    bIsAlgorithTurn = true;
                }     
                
                this.AIvAIGame(FirstAI, SecondAI, "Negamax", bIsAlgorithTurn);     
            }
        }

        startGame(numberOfAI)
        {
            this.createBoard(7);
            this.score = 1;
            this.scoreOwner = null;

            if(numberOfAI == 0) 
            {
                this.player1 = new Player(this, 'Player1');
                this.player2 = new Player(this, 'Player2');
                
            }
            
            if(numberOfAI == 1)
            {
                this.player1 = new Player(this, 'Player1');
                this.AI1 = new AI(this, 'AI1');
            }

            if(numberOfAI == 2)
            {
                if(this.AIType.Random)
                {
                    this.AI1 = new AI(this, 'AI1','Random');
                    this.AI2 = new AI(this, 'AI2','Random');
                    this.AIvAIGame(this.AI1, this.AI2, "Random", false);
                }
                else if(this.AIType.Minimax)
                {
                    this.AI1 = new AI(this, 'AI1','Minmax');
                    this.AI2 = new AI(this, 'AI2','Random');
                    this.AIvAIGame(this.AI1, this.AI2, "Minimax", false);
                }
                else if(this.AIType.Negamax)
                {
                    this.AI1 = new AI(this, 'AI1','Minmax');
                    this.AI2 = new AI(this, 'AI2','Random');
                    this.AIvAIGame(this.AI1, this.AI2, "Negamax", false);
                }
            }
        }

        destroyButtons()
        {
            this.PvP.destroy();
            this.AIvAI.destroy();
            this.PvAI.destroy();
            this.MINIMAXAIvAI.destroy();
            this.NEGAMAXAIvAI.destroy();
            this.RandomText.destroy();
            this.MinimaxText.destroy();
            this.NegamaxText.destroy();
        }

        gameOver()
        {
            if(this.numberofAI == 2) 
            {
				if(this.AIType.Random)
                {
                    this.GoThroughBoardCountingScore();
                    GameOverText = this.add.text(897,350,"Wynik Białego: " + this.AI1.score + "\nWynik Czarnego: " + this.AI2.score, Style);
				}
				else if(this.AIType.Minimax)
                {
                    this.GoThroughBoardCountingScore();
                    GameOverText = this.add.text(897,350,"Wynik Random: " + this.AI2.score + "\nWynik Minimax: " + this.AI1.score, Style);
				}
                else if(this.AIType.Negamax)
                {
                    this.GoThroughBoardCountingScore();
                    GameOverText = this.add.text(897,350,"Wynik Random: " + this.AI2.score + "\nWynik Negamax: " + this.AI1.score, Style); 
                }
            }

            if(this.numberofAI == 1)
            {
                this.GoThroughBoardCountingScore();
                GameOverText = this.add.text(897,350,"Wynik Białego: " + this.player1.score + "\nWynik Czarnego: " + this.AI1.score, Style);
            }

            if(this.numberofAI == 0)
            {
                this.GoThroughBoardCountingScore();
                GameOverText = this.add.text(897,350,"Wynik Białego: " + this.player1.score + "\nWynik Czarnego: " + this.player2.score, Style);
            }
        }
		
		GoThroughBoardCountingScore()
		{
			var TempboardArray = Array.from(Array(7), () => new Array(7));
			for(let y = 0; y <= 6; y++)
			{
				for(let x = 0; x <= 6; x++)
				{
					if(this.boardArray[x][y].PawnBase != undefined && TempboardArray[x][y] != 1)
					{
						this.boardArray[x][y].PawnBase.CheckScoreSetup(this.boardArray[x][y],1,TempboardArray);	
					}
				}	
			}	
		}
		
        
        CheckIfAnyFreeTilesAround(TileX, TileY)
        {
            return ((TileX+1 <= 6 && this.boardArray[TileX+1][TileY].bIsTaken == false) || 
                    (TileX-1 >= 0 && this.boardArray[TileX-1][TileY].bIsTaken == false) || 
                    (TileY-1 >= 0 && this.boardArray[TileX][TileY-1].bIsTaken == false) || 
                    (TileY+1 <= 6 && this.boardArray[TileX][TileY+1].bIsTaken == false))
        }

        CheckHowManyMovesPossible()
        {
        let numberOfMovesLeft = 0;
            for(let i = 0; i < 7; i++)
            {
                for(let j = 0; j < 7; j++)
                {
                    if(this.boardArray[j][i].bIsTaken == false)
                    {
                        if(this.CheckIfAnyFreeTilesAround(j,i)) 
                       {
                         numberOfMovesLeft++;
                       } 
                    }   
                }
            }
        return numberOfMovesLeft;
        }

        getNumberOfAI()
        {
            return this.numberofAI;
        }
        
        CheckWhoHasMoreScore()
        {
                if(this.getNumberOfAI() == 1)
                {   
                    let oldScoreAI = this.AI1.score; //1
					let oldScoreP = this.player1.score; //1
					let oldShapeCountA1 = this.AI1.shapeCount;
                    this.GoThroughBoardCountingScore();
					
                    let finalScore = (this.AI1.score - oldScoreAI) - (this.player1.score - oldScoreP);
				
					//let finalScore = this.CountTheCheckWhoHasMoreScore(this.AI1.score , this.player1.score , oldScoreAI , oldScoreP , this.AI1.shapeCount , oldShapeCountA1);
					//console.log("AI: " + this.AI1.score + " Gracz: " + this.player1.score + " FinalScore: " + finalScore);
					
                    this.player1.score = oldScoreP;
                    this.AI1.score = oldScoreAI;
					this.AI1.shapeCount = oldShapeCountA1
					
					
                    return finalScore;
					
					this.CheckWhoHasMoreScore(this.AI1 , this.player1);
                }
				
				if(this.getNumberOfAI() == 2)
                {   
                    let oldScoreAI2 = this.AI2.score; //1
                    let oldScoreAI1 = this.AI1.score; //  Myslace AI 
					let oldShapeCountA1 = this.AI1.shapeCount;
                    this.GoThroughBoardCountingScore();
					

                    let finalScore = ((this.AI1.score - oldScoreAI1) - (this.AI2.score - oldScoreAI2));
					//console.log("Aktualny shape count: " + this.AI1.shapeCount + " Nowy: " + oldShapeCountA1 + " FinalScore: " + finalScore);


                    this.AI2.score = oldScoreAI2;
                    this.AI1.score = oldScoreAI1;
					this.AI1.shapeCount = oldShapeCountA1;

                    return finalScore;
                }
                else 
                {
                    return;
                }
        }
		
		CountTheCheckWhoHasMoreScore(scoreP1 , scoreP2 ,oldScoreP1 , oldScoreP2 , shapeCountP1 , oldShapeCountP1 )
			{
				let scoreMultp = 1;
				switch (shapeCountP1 - oldShapeCountP1)
						{
							case -1:
								scoreMultp = (scoreMultp + 0.04);
								break;
							case 1:
								scoreMultp = (scoreMultp - 0.02);
								break;
							case 0:
								scoreMultp = (scoreMultp + 0.02);
								break;
						}
						
						
						return ((scoreP1 - oldScoreP1) - (scoreP2 - oldScoreP2)); //* scoreMultp;
			}
		

        saveCurrentScore()
        {
            this.GoThroughBoardCountingScore();
        }
		
		checkgoddamnboard()
		{
			console.log("---------------------------------------------------------------------");
			for(let i = 0; i < 7; i++)
            {
                for(let j = 0; j < 7; j++)
                {
                    if(this.boardArray[j][i].bIsTaken == false)// && this.boardArray[j][i].PawnBase == null )
                    {
						console.log("Puste Pola " + j + " " + i);
                    }  
                    if(this.boardArray[j][i].bIsTaken == true && this.boardArray[j][i].PawnBase == null )
                    {
						console.log("Zajete Pola " + j + " " + i);
                    }    
                }
            }
			
		}
		

    }


