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
    
    // Tell Phaser that the player will use the Arcade physics engine
    game.physics.arcade.enable(this.player);
    
   // Create the tilemap 
    map = game.add.tilemap('map');
// Add the tileset to the map 
    map.addTilesetImage('tileset');
// Create the layer, by specifying the name of the Tiled layer 
    this.layer = map.createLayer('Tile Layer 1');
// Set the world size to match the size of the layer 
    this.layer.resizeWorld();
    // Enable collisions for the first element of our tileset (the blue wall) 
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


},
update: function() { 
    // This function is called 60 times per second 
    // It contains the game's logic 
    
    // Tell Phaser that the player and the walls should collide 
    //game.physics.arcade.collide(this.player, this.walls);
    game.physics.arcade.collide(this.player, this.layer, this.dig(this.player.x, this.player.y)); 

 
    
    this.movePlayer();
   
    
   // if (!this.player.inWorld) { this.playerDie(); }
    
    //game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    
    // Make the enemies and walls collide 
    //game.physics.arcade.collide(this.enemies, this.walls);
    
    // Call the 'playerDie' function when the player and an enemy overlap 
    //game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);


},
    
movePlayer: function() { 
// If the left arrow key is pressed
    if ((this.cursor.left.isDown || this.wasd.left.isDown)) { 
        // Move the player to the left 
        this.player.body.velocity.x = -200; 
        this.player.body.velocity.y = 0; 
        this.player.animations.play('left'); // Start the left animation

    }
    
    // If the right arrow key is pressed 
    else if (this.cursor.right.isDown || this.wasd.right.isDown) { 
        // Move the player to the right 
        this.player.body.velocity.x = 200;
        this.player.body.velocity.y = 0;
        this.player.animations.play('right'); // Start the right animation

    }
    
        // If the up arrow key is pressed 
    else if (this.cursor.up.isDown || this.wasd.up.isDown) { 
        // Move the player to the right 
        this.player.body.velocity.y = -200; 
        this.player.body.velocity.x = 0;
        this.player.animations.play('up'); // Start the right animation

    }
    
            // If the down arrow key is pressed 
    else if (this.cursor.down.isDown || this.wasd.down.isDown) { 
        // Move the player to the right 
        this.player.body.velocity.y = 200; 
        this.player.body.velocity.x = 0;
        this.player.animations.play('down'); // Start the right animation

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
        //this.player.frame = 3; 
    }
    

    
},

createWorld: function() { 

},

playerDie: function() { 
    game.state.start('main'); 
},
    
dig: function (x, y){
    console.log ("digging");
    console.log(x, y);
    map.swap(1, 3, x, y, 24, 24);

}

};


    
    







// We initialising Phaser 
var game = new Phaser.Game(480, 480, Phaser.AUTO, 'gameDiv');


// And finally we tell Phaser to add and start our 'main' state 
game.state.add('main', mainState); 
game.state.start('main');