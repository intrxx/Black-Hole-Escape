export default class RockBase extends Phaser.GameObjects.Container {
    constructor(data) {
        let {scene ,x, y, name, image, depth} = data;
        let spriteRock = new Phaser.GameObjects.Sprite(scene, 0, 0, image).setScale(0.8);
        super(scene, x, y, [spriteRock])
        this.scene = scene;
        this.depth = depth;
        this.name = name;
        this.spriteRock = spriteRock;
        this.scene.add.existing(this);
    }
}