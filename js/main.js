import PreloadGame from './PreloadGame.js'
import BoardScene from './BoardScene.js'


const config = 
    {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#333333',
    }

    scene: 
    [
        PreloadGame,
        BoardScene
    ]


export default new Phaser.Game(config)