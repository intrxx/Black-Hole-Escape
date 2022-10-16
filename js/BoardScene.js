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
        this.load.image('BlackBoard', '../assets/BlackBoard.png');

        //Stones
        this.load.image('WhiteStone', '../assets/WhiteStone1.png');
        this.load.image('BlackStone', '../assets/BlackStone1.png');

        //Others
        this.load.image('Tile', '../assets/TestTile.png');

        //Buttons
        this.load.image('PvP', '../assets/PvP.png');
        this.load.image('PvAI', '../assets/PvAI.png');
        this.load.image('AIvAI', '../assets/AIvAI.png');


    }

    create() 
    {
        this.add.image(300, 245, 'BlackBoard').setScale(0.9);
    
        this.bGameHasStarted = false;

        this.PvP = this.add.image(800, 100, 'PvP').setInteractive();
        this.PvP.on('pointerdown', () => {
            this.bGameHasStarted = true;

            this.numberofAI = 0;
            this.startGame(0);

            
        });

        this.PvP = this.add.image(800, 200, 'PvAI').setInteractive();
        this.PvP.on('pointerdown', () => {
            this.bGameHasStarted = true;

            this.numberofAI = 1;
            this.startGame(1);
        });

        this.PvP = this.add.image(800, 300, 'AIvAI').setInteractive();
        this.PvP.on('pointerdown', () => {
            this.bGameHasStarted = true;

            this.numberofAI = 2;
            this.startGame(2);
        });
            
        this.numberOfGame = 0;
    }

    createBoard(numberOfColumns) 
    {
        let offSetX = 0;
		let offSetY = 0;

		this.boardArray = Array.from(Array(5), () => new Array(5));

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
                this.boardArray[j][i] = this.tile;

                offSetY += 115;
				this.arrayXIndex++;
            }
                offSetY = 0;
                offSetX += 115;
			    this.arrayYIndex++;
			}

            this.boardArray[0][0].PawnBase = new PawnBase(this, this.boardArray[0][0].XOffset, this.boardArray[0][0].YOffset, 'WhiteStone', this.scene.player1);
            this.boardArray[1][1].PawnBase = new PawnBase(this, this.boardArray[1][1].XOffset, this.boardArray[1][1].YOffset, 'WhiteStone', this.scene.player1);
            this.boardArray[0][4].PawnBase = new PawnBase(this, this.boardArray[0][4].XOffset, this.boardArray[0][4].YOffset, 'WhiteStone', this.scene.player1);
            this.boardArray[1][3].PawnBase = new PawnBase(this, this.boardArray[1][3].XOffset, this.boardArray[1][3].YOffset, 'WhiteStone', this.scene.player1);

            this.boardArray[4][0].PawnBase = new PawnBase(this, this.boardArray[4][0].XOffset, this.boardArray[4][0].YOffset, 'BlackStone', this.scene.player2);
            this.boardArray[3][1].PawnBase = new PawnBase(this, this.boardArray[3][1].XOffset, this.boardArray[3][1].YOffset, 'BlackStone', this.scene.player2);
            this.boardArray[3][3].PawnBase = new PawnBase(this, this.boardArray[3][3].XOffset, this.boardArray[3][3].YOffset, 'BlackStone', this.scene.player2);
            this.boardArray[4][4].PawnBase = new PawnBase(this, this.boardArray[4][4].XOffset, this.boardArray[4][4].YOffset, 'BlackStone', this.scene.player2);
        
        }

        startGame(numberOfAI)
        {
            this.numberOfGames++;
               
            this.createBoard(5);
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
                this.AI1 = new AI(this, 'BlackStone', 'AI1');
            }

            if(numberOfAI == 2)
            {
                this.AI1 = new AI(this, 'WhiteStone', 'AI1');
                this.AI2 = new AI(this, 'BlackStone', 'AI2');
            }

            
        }
    }


