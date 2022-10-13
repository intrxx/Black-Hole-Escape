import BoardScene from './BoardScene.js'

const config = 
    {
    type: Phaser.AUTO,
    width: 1280,
    height: 1080,
    backgroundColor: '#333333',
    scene:  [BoardScene]
    };

    


export default new Phaser.Game(config)