import BoardScene from './BoardScene.js'

export default class PawnBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, owner)
	{
		super(scene, x, y, sprite);

		this.scene = scene;
		this.owner = owner;

		this.TempScore = 1;
		
		this.sprite = scene.add.image(x, y, sprite).setScale(0.9);
		
	}
	
	/* Problem jest taki że jeśli idziemy kolejno po tailach sprawdzając punktacje  sprawdzimy kilka razy ten sam kształt. 
	Możliwym rozwiązaniem jesli nie chcemy wywoływać kilka razy tego samego jest opcją zwracania już sprawdzonych taili.
	*/
	//Funkcje zwiazane z zliaczaniem punktow START-----------------------------------------------------------------------------------------------------------------------
	CheckOwner(tile)
	{
		return tile.PawnBase.owner;
	}
	
	//CheckScoreSetup(tile,TempScore)
	CheckScoreSetup(tile,TempScore,TempboardArray)
	{
	
		//var TempboardArray = Array.from(Array(7), () => new Array(7));
		//console.log("Y" + tile.indexX +   " X" + tile.indexY);
		TempboardArray[tile.indexX][tile.indexY] = 1;
		this.CheckScore(tile,this.TempScore,TempboardArray)
	}
	
	CheckScore(tile,TempScore,TempboardArray)
	{
		this.CheckScoreLeft(tile.indexX, tile.indexY, this.CheckOwner(tile),this.TempScore,TempboardArray);
		this.CheckScoreRight(tile.indexX, tile.indexY, this.CheckOwner(tile),this.TempScore,TempboardArray);
		this.CheckScoreUp(tile.indexX, tile.indexY, this.CheckOwner(tile),this.TempScore,TempboardArray);
		this.CheckScoreDown(tile.indexX, tile.indexY, this.CheckOwner(tile),this.TempScore,TempboardArray);
		this.SumScore(this.CheckOwner(tile),this.TempScore);
	}	
	
	//Tak na prawde w dol
	CheckScoreLeft(indexX, indexY, owner,TempScore,TempboardArray)
	{
		if(indexX > 0)
		{ 
			if(this.scene.boardArray[indexX - 1][indexY].PawnBase != null && this.scene.boardArray[indexX - 1][indexY].PawnBase.owner.name == owner.name && TempboardArray[indexX - 1][indexY] != 1)
			{
				TempboardArray[indexX - 1][indexY] = 1;
				this.TempScore++;
				//console.log("TempScore "+ this.TempScore + " y " + (indexX - 1) + "x "+indexY);
				this.CheckScore(this.scene.boardArray[indexX - 1][indexY],this.TempScore,TempboardArray);
			}
		}
	}
	
	//Tak na prawde w gore
	CheckScoreRight(indexX, indexY, owner,TempScore,TempboardArray)
	{
		if(indexX < 6)
		{ 
			if(this.scene.boardArray[indexX + 1][indexY].PawnBase != null && this.scene.boardArray[indexX + 1][indexY].PawnBase.owner.name == owner.name && TempboardArray[indexX + 1][indexY] != 1)
			{
				TempboardArray[indexX + 1][indexY] = 1;
				this.TempScore++;
				//console.log("TempScore "+ this.TempScore + " y " + (indexX + 1) + "x "+indexY);
				this.CheckScore(this.scene.boardArray[indexX + 1][indexY],this.TempScore,TempboardArray);
			}
		}
	}
	
	//Tak na prawde w prawo
	CheckScoreUp(indexX, indexY, owner,TempScore,TempboardArray)
	{
		if(indexY < 6)
		{ 
			if(this.scene.boardArray[indexX][indexY+ 1].PawnBase != null && this.scene.boardArray[indexX][indexY+ 1].PawnBase.owner.name == owner.name && TempboardArray[indexX][indexY+ 1] != 1)
			{
				TempboardArray[indexX][indexY+1] = 1;
				this.TempScore++;
				//console.log("TempScore "+ this.TempScore + " y " + indexX + "x "+(indexY+ 1));
				this.CheckScore(this.scene.boardArray[indexX][indexY+ 1],this.TempScore,TempboardArray);
			}
		}
	}
	
	//Tak na prawde w lewo
	CheckScoreDown(indexX, indexY, owner,TempScore,TempboardArray)
	{
		if(indexY > 0)
		{ 
			if(this.scene.boardArray[indexX][indexY- 1].PawnBase != null && this.scene.boardArray[indexX][indexY- 1].PawnBase.owner.name == owner.name && TempboardArray[indexX][indexY- 1] != 1)
			{
				TempboardArray[indexX][indexY-1] = 1;
				this.TempScore++;
				//console.log("TempScore "+ this.TempScore + " y " + indexX + "x "+(indexY- 1));
				this.CheckScore(this.scene.boardArray[indexX][indexY- 1],this.TempScore,TempboardArray);
			}
		}
	}
	
	//sumowanie scora
	SumScore(owner,TempScore)
	{
		if(this.TempScore > owner.score)
		{
			owner.score = this.TempScore;
		}
		//console.log("TempScore Koncowy "+ this.TempScore);
		//console.log("Punkty "+ owner.score);
	}
	//Funkcje zwiazane z zliaczaniem punktow KONIEC -----------------------------------------------------------------------------------------------------------------------
}