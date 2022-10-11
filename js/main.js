import Phaser from 'phaser'
import PreloadGame from 'PreloadGame'


const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            garvity: {y: 150}
        }
    },

    scene: [
        PreloadGame
    ]
}

export default new Phaser.Game(config)