
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
        this.load.image('WhiteBoard', '../assets/WhiteBoard.png');

        //Stones
        this.load.image('WhiteStone1', '../assets/WhiteStone1.png');
        this.load.image('WhiteStone2', '../assets/WhiteStone2.png');
        this.load.image('BlackStone1', '../assets/BlackStone1.png');
        this.load.image('BlackStone2', '../assets/BlackStone2.png');

        //Others
        this.load.image('Rope', '../assets/Rope.png');
    }

    create() 
    {
        //Boards
        this.add.image(300, 245, 'BlackBoard').setScale(0.9);
        this.add.image(900, 245, 'WhiteBoard').setScale(0.9);
        this.add.image(300, 770, 'BlackBoard').setScale(0.9);
        this.add.image(900, 770, 'WhiteBoard').setScale(0.9);

        //Others
        this.add.image(610,505, 'Rope');
        

    }

    
}
