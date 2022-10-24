export default class Player
{
	constructor(scene, name)
	{
		this.scene = scene;

        this.score = 0;

		this.name = name;

		this.bIsFirstTilePlaced = false;

		this.numberOfMoves = 2;
	}

}