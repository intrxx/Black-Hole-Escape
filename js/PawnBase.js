export default class PawnBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, owner)
	{
		super(scene, x, y, sprite);

		this.scene = scene;
		this.owner = owner;
		

		scene.add.image(x, y, sprite).setScale(0.9);
	}

	
}