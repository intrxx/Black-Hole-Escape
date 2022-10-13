import RockDraggable from "../js/RockDraggable.js";

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
    
        //Dropzones
            var offsetx = 0;
            var offsety = 0;
    
            for (var i = 0; i < 4; i++)
                {
                    for (var y = 0; y < 4; y++) 
                        {
                            var zone = this.add.zone(125 + offsetx, 74 + offsety, 50, 50).setRectangleDropZone(100, 100);  
                            offsety += 115;
                            
    
                            var graphics = this.add.graphics();
                            graphics.lineStyle(2, 0xffff00);
                            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
    
                    }
                    offsetx += 115;
                    offsety = 0;
                }

                offsetx = 0;
                offsety = 0;

                for (var i = 0; i < 4; i++)
                {
                    for (var y = 0; y < 4; y++) 
                        {
                            var zone = this.add.zone(730 + offsetx, 74 + offsety, 50, 50).setRectangleDropZone(100, 100);  
                            offsety += 115;
                            
    
                            var graphics = this.add.graphics();
                            graphics.lineStyle(2, 0xffff00);
                            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
    
                    }
                    offsetx += 115;
                    offsety = 0;
                }

                offsetx = 0;
                offsety = 0;

                for (var i = 0; i < 4; i++)
                {
                    for (var y = 0; y < 4; y++) 
                        {
                            var zone = this.add.zone(125 + offsetx, 598 + offsety, 50, 50).setRectangleDropZone(100, 100);  
                            offsety += 115;
                            
    
                            var graphics = this.add.graphics();
                            graphics.lineStyle(2, 0xffff00);
                            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
    
                    }
                    offsetx += 115;
                    offsety = 0;
                }

                offsetx = 0;
                offsety = 0;

                for (var i = 0; i < 4; i++)
                {
                    for (var y = 0; y < 4; y++) 
                        {
                            var zone = this.add.zone(730 + offsetx, 598 + offsety, 50, 50).setRectangleDropZone(100, 100);  
                            offsety += 115;
                            
    
                            var graphics = this.add.graphics();
                            graphics.lineStyle(2, 0xffff00);
                            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
    
                    }
                    offsetx += 115;
                    offsety = 0;
                }


            //Rocks
            var LocationX = 125;
            for (let i = 0; i < 4; i++) {
        
                
                var rock = this.add.image(LocationX, 72, 'WhiteStone1').setInteractive().setScale(0.8);
                        
                this.input.setDraggable(rock);

                LocationX += 115;
            }

            for (let i = 0; i < 4; i++) {
        
                
                var rock = this.add.image(145 + LocationX, 72, 'WhiteStone1').setInteractive().setScale(0.8);
                        
                this.input.setDraggable(rock);

                LocationX += 115;
            }

            LocationX = 0;
            for (let i = 0; i < 4; i++) {
        
                
                var rock = this.add.image(125 + LocationX, 600, 'WhiteStone1').setInteractive().setScale(0.8);
                        
                this.input.setDraggable(rock);

                LocationX += 115;
            }

            for (let i = 0; i < 4; i++) {
        
                
                var rock = this.add.image(270 + LocationX, 600, 'WhiteStone1').setInteractive().setScale(0.8);
                        
                this.input.setDraggable(rock);

                LocationX += 115;
            }

            LocationX = 0;
            for (let i = 0; i < 4; i++) {
        
                
                var rock = this.add.image(125 + LocationX, 420, 'BlackStone1').setInteractive().setScale(0.8);
                        
                this.input.setDraggable(rock);

                LocationX += 115;
            }

            for (let i = 0; i < 4; i++) {
        
                
                var rock = this.add.image(270 + LocationX, 420, 'BlackStone1').setInteractive().setScale(0.8);
                        
                this.input.setDraggable(rock);

                LocationX += 115;
            }

            LocationX = 0;
            for (let i = 0; i < 4; i++) {
        
                
                var rock = this.add.image(125 + LocationX, 940, 'BlackStone1').setInteractive().setScale(0.8);
                        
                this.input.setDraggable(rock);

                LocationX += 115;
            }

            for (let i = 0; i < 4; i++) {
        
                
                var rock = this.add.image(270 + LocationX, 940, 'BlackStone1').setInteractive().setScale(0.8);
                        
                this.input.setDraggable(rock);

                LocationX += 115;
            }

        this.input.on('dragstart',function(pointer, gameObject) {
            this.children.bringToTop(gameObject);
            }, this);
        
        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            });

        this.input.on('dragenter', function (pointer, gameObject, dropZone) {
            graphics.clear();
            graphics.lineStyle(2, 0x00ffff);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
            });
        
        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
            });
        
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            });
        
        this.input.on('dragend', function (pointer, gameObject, dropped) {
        
            if (!dropped)
            {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }  
            graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
            });

    }

    
}
