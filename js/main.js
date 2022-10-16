import BoardScene from './BoardScene.js'

const config = 
    {
    type: Phaser.AUTO,
    width: 1200,
    height: 620,
    backgroundColor: '#333333',
    scene:  [BoardScene]
    };

export default new Phaser.Game(config)