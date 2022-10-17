import PawnBase from "../js/PawnBase.js";

export default class Tile extends Phaser.Physics.Arcade.Sprite 
{
    constructor(scene, x, y, sprite)
	{
		super(scene, x, y, sprite);

		this.scene = scene;

		this.PawnBase = null;

		this.indexX = 0;
		this.indexY = 0;

		this.XOffset = 0;
		this.YOffset = 0;

		this.sprite = scene.add.image(x, y, sprite).setScale(0.85);

        this.sprite.on('pointerdown', () => {
		    if(this.scene.bGameHasStarted == false) { return;}
			if(this.PawnBase == null && this.scene.player1.numberOfMoves > 0)
			{
                if(this.scene.player1.bIsFirstTilePlaced == false) 
                {
                    this.PawnBase1 = new PawnBase(this.scene, this.XOffset, this.YOffset, 'WhiteStone', this.scene.player1);
                    console.log(this.XOffset, this.YOffset)
                    this.scene.player1.bIsFirstTilePlaced = true;
                } 
                else if((this.scene.player1.bIsFirstTilePlaced = true))
                {
                
                    this.PawnBase = new PawnBase(this.scene, this.XOffset, this.YOffset, 'BlackStone', this.scene.player2);
                    console.log(this.XOffset, this.YOffset)
                    
                }
				
				this.scene.player1.numberOfMoves--; 

                if(this.scene.player1.numberOfMoves == 0) 
                {
                    this.scene.player2.numberOfMoves = 2;
                    this.scene.player1.bIsFirstTilePlaced = false;
                }
                
            } 
            else if(this.PawnBase == null && this.scene.player2.numberOfMoves > 0) 
            {
                if(this.scene.player1.bIsFirstTilePlaced == false) 
                {
                    this.PawnBase = new PawnBase(this.scene, this.XOffset, this.YOffset, 'WhiteStone', this.scene.player2);
                    this.scene.player1.bIsFirstTilePlaced = true;
                } 
                else
                {
                    this.PawnBase = new PawnBase(this.scene, this.XOffset, this.YOffset, 'BlackStone', this.scene.player1);
                    
                }
                
                this.scene.player2.numberOfMoves--;

                if(this.scene.player2.numberOfMoves == 0) 
                {
                    this.scene.player1.numberOfMoves = 2;
                    this.scene.player1.bIsFirstTilePlaced = false;
                }
            }

    });
    }
}