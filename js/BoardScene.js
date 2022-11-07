import Tile from "../js/Tile.js";
import Player from "../js/Player.js";
import AI from "../js/AI.js"

let GameOverText;
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
    
        this.bGameHasStarted = false;
        this.AIType;
        let Random = true;
        let Minimax = true;

        this.PvP = this.add.image(1050, 590, 'PvP').setInteractive().setScale(0.6);
        this.PvP.on('pointerdown', () => {
            this.bGameHasStarted = true;

            this.numberofAI = 0;
            
            this.startGame(0);
            this.destroyButtons();
        });

        this.PvAI = this.add.image(1050, 690, 'PvAI').setInteractive().setScale(0.6);
        this.PvAI.on('pointerdown', () => {
            this.bGameHasStarted = true;

            this.numberofAI = 1;
            this.startGame(1);
            this.destroyButtons();
        });

        this.AIvAI = this.add.image(1050, 790, 'AIvAI').setInteractive().setScale(0.6);
        this.AIvAI.on('pointerdown', () => {
            this.bGameHasStarted = true;
            this.numberofAI = 2;
            this.AIType = {Random};
            this.startGame(2);
            this.destroyButtons();
        });

        this.MINIMAXAIvAI = this.add.image(200, 900, 'AIvAI').setInteractive().setScale(0.4);
        this.MINIMAXAIvAI.on('pointerdown', () => {
            this.bGameHasStarted = true;
            this.numberofAI = 2;
            this.AIType = {Minimax};
            this.startGame(2);
            this.destroyButtons();
        })

        this.ResetButton = this.add.image(1030, 45, 'Restart').setInteractive().setScale(0.4);
        this.ResetButton.on('pointerdown', () => {
            this.bGameHasStarted = false;

            this.scene.restart();
        });

        
            
        this.numberOfGame = 0;

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

        AIvAIGame(FirstAI, SecondAI)
        {
            if(this.CheckHowManyMovesPossible() == 0)
            {
                this.gameOver();
                return;
            }

            for(let i = 0; i < this.CheckHowManyMovesPossible(); i++)
            {
                FirstAI.aiMakeFirstRandomMove(FirstAI)
            }
            this.AIvAIGame(SecondAI, FirstAI);
        }

        MINIMAXAIvAIGame(FirstAI, SecondAI, bISMINIMAXAITurn)
        {
            if(this.CheckHowManyMovesPossible() == 0)
            {
                this.gameOver();
                return;
            }

            if(bISMINIMAXAITurn)
            {
                FirstAI.aiMakeFirstOptimalMove();
                bISMINIMAXAITurn = false;
                console.log("Optimal")
            }
            else
            {
                SecondAI.aiMakeFirstRandomMove(FirstAI)
                bISMINIMAXAITurn = true;
            }     
            
            this.MINIMAXAIvAIGame(FirstAI, SecondAI, bISMINIMAXAITurn);
        }

        startGame(numberOfAI)
        {
            this.numberOfGames++;
               
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
                    this.AI1 = new AI(this, 'AI1');
                    this.AI2 = new AI(this, 'AI2');
                    this.AIvAIGame(this.AI1, this.AI2);
                }
                else if(this.AIType.Minimax)
                {
                    this.AI1 = new AI(this, 'AI1');
                    this.player1 = new AI(this, 'player1');
                    this.MINIMAXAIvAIGame(this.AI1, this.player1, false)
                }
            }
        }

        destroyButtons()
        {
            this.PvP.destroy();
            this.AIvAI.destroy();
            this.PvAI.destroy();
            this.MINIMAXAIvAI.destroy();
        }

        gameOver()
        {
            if(this.numberofAI == 2) 
            {
                this.GoThroughBoardCountingScore();
                GameOverText = this.add.text(897,350,"Wynik Białego: " + this.AI1.score + "\nWynik Czarnego: " + this.AI2.score, Style);
                console.log("The winner is: " + this.CheckWhoHasMoreScore());
            }

            if(this.numberofAI == 1)
            {
                this.GoThroughBoardCountingScore();
                GameOverText = this.add.text(897,350,"Wynik Białego: " + this.player1.score + "\nWynik Czarnego: " + this.AI1.score, Style);
                console.log("The winner is: " + this.CheckWhoHasMoreScore());
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
                    let oldScoreP = this.player1.score; //1
                    let oldScoreAI = this.AI1.score; //1

                    this.GoThroughBoardCountingScore();

                    let finalScore = this.AI1.score - oldScoreAI - (this.player1.score - oldScoreP);

                    this.player1.score = oldScoreP;
                    this.AI1.score = oldScoreAI;

                    //console.log("Player: " + this.player1.score);
                    //console.log("AI: " + this.AI1.score);

                    //console.log("Final Score: " + finalScore)
                    return finalScore;
                }
                else 
                {
                    return;
                }
        }

        saveCurrentScore()
        {
            this.GoThroughBoardCountingScore();
        }

        clearBoard()
        {
            for(let i = 0; i < 7; i++)
            {
                for(let j = 0; j < 7; j++)
                {
                    if(typeof this.boardArray[j][i].PawnBase !== "undefined" && typeof this.boardArray[j][i].PawnBase.sprite !== "undefined")
                    {
                        console.log("kordy: " + j + " " + i);
                        this.boardArray[j][i].PawnBase = null;
                        this.boardArrayp[j][i].bIsTaken = false;                   
                     }   
                }
            }
        }
    }


