
// We create our only state 
var mainState = {
    
// Here we add all the functions we need for our state 
// For this project we will just have 3 functions
    
preload: function() { 
    // Load the image 
    game.load.spritesheet('player', 'assets/player.png',24 ,24);
    
    game.load.tilemap('map', 'assets/map01.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', 'assets/test_tile.png'); 
    game.load.image('pixel', 'assets/pixel.png');




},
    
    
create: function() { 
    // Display the image on the screen 
    game.stage.backgroundColor = '#3498db';
    game.physics.startSystem(Phaser.Physics.ARCADE);
   
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.gridPosition = new Phaser.Point(game.world.centerX, game.world.centerY);
    this.player.facing = [0,0];
    this.player.tempo = 0;
    // Tell Phaser that the player will use the Arcade physics engine
    game.physics.arcade.enable(this.player);
    
   // Create the tilemap 
    map = game.add.tilemap('map');
// Add the tileset to the map 
    map.addTilesetImage('tileset');
// Create the layer, by specifying the name of the Tiled layer 
    this.layer = map.createLayer('Tile Layer 1');
    
    this.scoreLabel = game.add.text(10, 10, 'score: 0', { font: '12px Arial', fill: '#ffffff' });
    this.score = 0;
    
// Set the world size to match the size of the layer 
    this.layer.resizeWorld();
    // Enable collisions for the first element of our tileset (the blue wall) 
   
    //map.setTileIndexCallback( 1, this.dig, this);
     map.setCollision(1);
    
    
    this.cursor = game.input.keyboard.createCursorKeys();
    
    //this.createWorld();
    
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);
    


    this.wasd = { 
        up: game.input.keyboard.addKey(Phaser.Keyboard.W), 
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S), 
        right: game.input.keyboard.addKey(Phaser.Keyboard.D), 
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };
    
// Create the 'right' animation by looping the frames 1 and 2 
    this.player.animations.add('right', [1, 2], 6, true);
    
// Create the 'left' animation by looping the frames 3 and 4 
    this.player.animations.add('left', [7, 8], 6, true);
    
// Create the 'up' animation by looping the frames 3 and 4 
    this.player.animations.add('up', [10, 11], 6, true);   
    
// Create the 'down' animation by looping the frames 3 and 4 
    this.player.animations.add('down', [4, 5], 6, true);
    
     // Create the emitter with 15 particles. We don't need to set the x and y 
    // Since we don't know where to do the explosion yet 
    this.emitter = game.add.emitter(0, 0, 15);
    
    // Set the 'pixel' image for the particles 
    this.emitter.makeParticles('pixel');
    
    // Set the y speed of the particles between -150 and 150 
    // The speed will be randomly picked between -150 and 150 for each particle 
    this.emitter.setYSpeed(-150, 150);
    
    // Do the same for the x speed 
    this.emitter.setXSpeed(-150, 150);
    
    // Use no gravity for the particles 
    this.emitter.gravity = 100;

    //  Create our Timer
    timer = game.time.create(false);

    //  Set a TimerEvent to occur after 2 seconds
    timer.loop(1000, this.updateCounter, this);

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    timer.start();
    
},
    

    
update: function() { 
    // This function is called 60 times per second 
    // It contains the game's logic 
    
    // Tell Phaser that the player and the walls should collide 
    //game.physics.arcade.collide(this.player, this.walls);
    
    game.physics.arcade.collide(this.player, this.layer, this.dig, null, this); 

    this.scoreLabel.text = 'score: ' + this.score;
    
    this.movePlayer();
    
    console.log(this.player.tempo);


},

updateCounter: function(){
    console.log(this.player.tempo);
    this.player.tempo ++;
    if (this.player.tempo == 3){
        this.player.tempo =0;      
    }
    
},

    
dig: function (){

    console.log ("digging");
    this.emitter.x = this.player.x + this.player.facing[0] * 13; // cambiare con mezzo player widht +1 
        this.emitter.y = this.player.y + this.player.facing[1] * 13; //cambiare con mezzo player height +1 
        this.emitter.start(true, 100, null, 5); 
    if (this.player.tempo ==1){
        map.replace(1,2, this.layer.getTileX(this.emitter.x), this.layer.getTileY(this.emitter.y),this.layer);
    }
    if (this.player.tempo == 2){
        map.removeTile(this.layer.getTileX(this.emitter.x), this.layer.getTileY(this.emitter.y));
        this.player.tempo =0;
    }
       //map.removeTile(this.layer.getTileX(this.player.x + this.player.facing_x), this.layer.getTileY(this.player.y + this.player.facing_y));
    //this.player.x =this.emitter.x;
    //this.player.y = this.emitter.y;
        //console.log(this.layer.getTileX,this.layer.getTileY);
    //this.score += 10;

},  
    



    
movePlayer: function() { 
// If the left arrow key is pressed
    if ((this.cursor.left.isDown || this.wasd.left.isDown)) { 
        if (this.player.facing[0] != -1 || this.player.facing[1] != 0){ //TODO: non va
            this.player.facing = [-1,0];
            this.playerSnapToGrid();
        }
        // Move the player to the left 
        this.player.body.velocity.x = -200; 
        this.player.body.velocity.y = 0; 
        //this.placePlayer(1,0);
        this.player.animations.play('left'); // Start the left animation
        
        //this.player.facing_x = - ((this.player.width / 2) +1); //migliorare con array e 0 e 1
        //this.player.facing_y = 0;
    }
    
    // If the right arrow key is pressed 
    else if (this.cursor.right.isDown || this.wasd.right.isDown) { 
        if (this.player.facing[0] != 1 || this.player.facing[1] != 0){
            this.player.facing = [1,0];
            this.playerSnapToGrid();
        }
        // Move the player to the right 
        this.player.body.velocity.x = 200;
        this.player.body.velocity.y = 0;
        this.player.animations.play('right'); // Start the right animation
        
        //this.player.facing_x = (this.player.height / 2) +1;
        //this.player.facing_y = 0;

    }
    
        // If the up arrow key is pressed 
    else if (this.cursor.up.isDown || this.wasd.up.isDown) { 
        if (this.player.facing[0] != 0 || this.player.facing[1] != -1){
            this.player.facing = [0,-1];
            this.playerSnapToGrid();
        }
        // Move the player to the right 
        this.player.body.velocity.y = -200; 
        this.player.body.velocity.x = 0;
        this.player.animations.play('up'); // Start the right animation
        
        //this.player.facing_x = 0;
        //this.player.facing_y = - ((this.player.height / 2)+1);

    }
    
            // If the down arrow key is pressed 
    else if (this.cursor.down.isDown || this.wasd.down.isDown) { 
        if (this.player.facing[0] != 0 || this.player.facing[1] != 1){ 
            this.player.facing =[0,1];
            this.playerSnapToGrid();
        }
        // Move the player to the right 
        this.player.body.velocity.y = 200; 
        this.player.body.velocity.x = 0;
        this.player.animations.play('down'); // Start the right animation
        
        //this.player.facing_x = 0;
        //this.player.facing_y = (this.player.height / 2) + 1;
        
    }
    
                // If the space key is pressed 
    else if (this.wasd.space.isDown) { 
        
        this.player.body.velocity.y = 0; 
        this.player.body.velocity.x = 0;
        this.emitter.x = this.player.x+13; 
        this.emitter.y = this.player.y; 
        this.emitter.start(true, 100, null, 5); 
        
    }
    
    // If neither the right or left arrow key is pressed 
    else { 
        // Stop the player 
        this.player.body.velocity.x = 0; 
        this.player.body.velocity.y = 0; 
        this.player.animations.stop(); // Stop the animation 
        console.log(this.layer.getTileX(this.player.x), this.layer.getTileY(this.player.y));
        this.playerSnapToGrid();
        //this.player.frame = 3; 
    }
    

    
},
  
playerSnapToGrid: function (){
    this.player.x = this.layer.getTileX(this.player.x) *24 +12; //TODO: sostituire con valori non fissi dim casella e mezzo dim player
    this.player.y = this.layer.getTileX(this.player.y) *24 +12; //TODO: sostituire con valori non fissi dim casella e mezzo dim player
      
},

createWorld: function() { 

},

playerDie: function() { 
    game.state.start('main'); 
}
    


};


    
    







// We initialising Phaser 
var game = new Phaser.Game(504, 504, Phaser.AUTO, 'gameDiv');


// And finally we tell Phaser to add and start our 'main' state 
game.state.add('main', mainState); 
game.state.start('main');