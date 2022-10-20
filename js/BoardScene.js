import Tile from "../js/Tile.js";
import PawnBase from "./PawnBase.js";
import Player from "../js/Player.js";
import AI from "../js/AI.js"

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


    }

    create() 
    {
        this.add.image(470, 422, 'Board').setScale(0.9);
    
        this.bGameHasStarted = false;

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
            this.startGame(2);
            this.destroyButtons();
        });
            
        this.numberOfGame = 0;
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
                this.AI1 = new AI(this, 'BlackPiece', 'AI1');
            }

            if(numberOfAI == 2)
            {
                this.AI1 = new AI(this, 'WhitePiece', 'AI1');
                this.AI2 = new AI(this, 'BlackPiece', 'AI2');
            }

            
        }

        destroyButtons()
        {
            this.PvP.destroy();
            this.AIvAI.destroy();
            this.PvAI.destroy();
        }

        gameOver()
        {
            console.log("Game over")
        }
    }


