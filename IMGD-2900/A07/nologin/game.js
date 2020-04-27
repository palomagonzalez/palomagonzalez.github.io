/*
game.js for Perlenspiel 3.3.x
Last revision: 2020-03-24 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-20 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
By default, all event-handling function templates are COMMENTED OUT (using block-comment syntax), and are therefore INACTIVE.
Uncomment and add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

/*
game.js for Perlenspiel 3.3.x
Last revision: 2020-03-24 (BM)
*/

// CONSTANTS
var WIDTH = 32;                     // width of grid
var HEIGHT = 32;                    // height of grid


// GLOBAL VARIABLES
var level = 1;                      // level tracker
var firstTime = true;               // first time in level?
var inventory = false;              // in inventory?
var journal = false;                // Cooper has diary
var objectX = false;                // Cooper has Leland's wallet
var hidingObjOpacity = 255;         // opacity of the sprite hiding wallet
var lelandOfferedJournal = false;   // has Leland offered the diary to Harry?
var gameDone = false;               // end of game

// sprites declarations
var cooperSprite, harrySprite, lelandSprite, objectXSprite, hidingSprite;
var bubbleSprite = "", journalSprite = "", crossSprite = "", congratsSprite = "";
var journalBWSprite = "", objectXBWSprite = "", journalInvSprite = "", objectXInvSprite = "";
var notificationSprite = "";

var xCoop = 1, yCoop = 18;          // Coop's position
var xobjX = 16, yobjX = 27;         // wallet's position
var currentStatusText;              // text in the status box

// for timer's use
var path = null;                    // path to follow, null if none
var step = 0;                       // current step on path


// GLOBAL FUNCTIONS

// draw sprite when Harry congrats Cooper
harryCongrats = function () {

    var myImage, mySprite;

    // load and draw flying colors

    PS.imageLoad( "images/congrats.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 22, 13 );

        //change status text
        currentStatusText = "Congrats!";
        PS.statusText( currentStatusText );

        //plays little congrats audio
        PS.audioPlay( "fx_tada" );

        congratsSprite = mySprite;        // Save for using later
    } );
}

// draw bubble and sprite when Leland says no
bocadilloCruzLeland = function () {

    var myImage, mySprite;

    // load and draw bubble
    PS.imageLoad( "images/bubble.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 17, 12 );

        bubbleSprite = mySprite;        // Save for using later
    } );

    // load and draw cross
    PS.imageLoad( "images/cross.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 19, 13 );

        crossSprite = mySprite;        // Save for using later
    } );
}

// draw bubble and sprite when Leland offers diary
bocadilloDiarioLeland = function () {

    var myImage, mySprite;

    // load and draw journal
    PS.imageLoad( "images/journal_inv.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 20, 19 );

        journalSprite = mySprite;        // Save for using later
        lelandOfferedJournal = true;
    } );
}

// draw bubble and sprite when harry asks for the diary
bocadilloDiarioHarry = function () {

    var myImage, mySprite;

    // load and draw bubble
    PS.imageLoad( "images/bubble.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 18, 12 );

        bubbleSprite = mySprite;        // Save for using later
    } );

    // load and draw journal
    PS.imageLoad( "images/journal.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 20, 13 );

        journalSprite = mySprite;        // Save for using later
    } );
}

// Timer function, called every 1/10th sec
tick = function () {

    var p, nx, ny;

    if ( path ) {                       // path ready (not null)?

        // Get next point on path
        p = path[ step ];
        nx = p[ 0 ]; // next x-pos
        ny = p[ 1 ]; // next y-pos

        // If Cooper already at next pos,
        // path is exhausted, so nuke it
        if ( ( xCoop === nx ) && ( yCoop === ny ) ) {
            path = null;
            return;
        }

        // Move sprite to next position
        PS.spriteMove( cooperSprite, nx, ny );
        xCoop = nx; // update xCoop
        yCoop = ny; // and yCoop

        if ( xCoop == 16 ) {
            hidingObjOpacity = hidingObjOpacity - 64;
            PS.spriteSolidAlpha( hidingSprite, hidingObjOpacity );
        }

        if ( hidingObjOpacity < 2 ) {
            currentStatusText = "Collect the wallet!"
            PS.statusText( currentStatusText );

        }

        step += 1;                      // point to next step

        // If no more steps, nuke path
        if ( step >= path.length ) {
            path = null;
        }
    }
}

// load and draw main screen backgrounds
loadBG = function ( imageData ) {

    // The image argument of loadBG() is passed
    // an image object representing *.bmp

    var imagen = imageData;
    var x, y, ptr, color;

    ptr = 0; // init pointer into data array
    for ( y = 7; y < 32; y += 1 ) {
        for ( x = 0; x < 32; x += 1 ) {
            color = imagen.data[ ptr ]; // get color
            PS.color( x, y, color ); // assign to bead
            ptr += 1; // point to next value
        }
    }

    PS.gridRefresh();                   // required to show effect of bead coloring
}

// load and draw screen top background
loadScreentop = function ( imageData ) {

    // The image argument of loadScreentop() is passed
    // an image object representing *.bmp

    var imagen = imageData;
    var x, y, ptr, color;

    ptr = 0; // init pointer into data array
    for ( y = 0; y < 7; y += 1 ) {
        for ( x = 0; x < 32; x += 1 ) {
            color = imagen.data[ ptr ]; // get color
            PS.color( x, y, color ); // assign to bead
            ptr += 1; // point to next value
        }
    }

    PS.gridRefresh();                   // required to show effect of bead coloring
}

// draw and activate/deactivate right arrow
paintRightArrow = function ( activate ) {

    if ( !activate ) {
        PS.color( 28, 1, 0xc7c7c7 );
        PS.color( 28, 2, 0xc7c7c7 );
        PS.color( 28, 3, 0xc7c7c7 );
        PS.color( 28, 4, 0xc7c7c7 );
        PS.color( 28, 5, 0xc7c7c7 );
        PS.color( 29, 2, 0xc7c7c7 );
        PS.color( 29, 3, 0xc7c7c7 );
        PS.color( 29, 4, 0xc7c7c7 );
        PS.color( 30, 3, 0xc7c7c7 );

        PS.active( 28, 1, 0 );
        PS.active( 28, 2, 0 );
        PS.active( 28, 3, 0 );
        PS.active( 28, 4, 0 );
        PS.active( 28, 5, 0 );
        PS.active( 29, 2, 0 );
        PS.active( 29, 3, 0 );
        PS.active( 29, 4, 0 );
        PS.active( 30, 3, 0 );
    } else {
        PS.active( 28, 1, 1 );
        PS.active( 28, 2, 1 );
        PS.active( 28, 3, 1 );
        PS.active( 28, 4, 1 );
        PS.active( 28, 5, 1 );
        PS.active( 29, 2, 1 );
        PS.active( 29, 3, 1 );
        PS.active( 29, 4, 1 );
        PS.active( 30, 3, 1 );

        PS.color( 28, 1, PS.COLOR_YELLOW );
        PS.color( 28, 2, PS.COLOR_YELLOW );
        PS.color( 28, 3, PS.COLOR_YELLOW );
        PS.color( 28, 4, PS.COLOR_YELLOW );
        PS.color( 28, 5, PS.COLOR_YELLOW );
        PS.color( 29, 2, PS.COLOR_YELLOW );
        PS.color( 29, 3, PS.COLOR_YELLOW );
        PS.color( 29, 4, PS.COLOR_YELLOW );
        PS.color( 30, 3, PS.COLOR_YELLOW );
    }
};

// draw and activate/deactivate left arrow
paintLeftArrow = function ( activate ) {

    if ( !activate ) {
        PS.color( 3, 1, 0xc7c7c7 );
        PS.color( 3, 2, 0xc7c7c7 );
        PS.color( 3, 3, 0xc7c7c7 );
        PS.color( 3, 4, 0xc7c7c7 );
        PS.color( 3, 5, 0xc7c7c7 );
        PS.color( 2, 2, 0xc7c7c7 );
        PS.color( 2, 3, 0xc7c7c7 );
        PS.color( 2, 4, 0xc7c7c7 );
        PS.color( 1, 3, 0xc7c7c7 );

        PS.active( 3, 1, 0 );
        PS.active( 3, 2, 0 );
        PS.active( 3, 3, 0 );
        PS.active( 3, 4, 0 );
        PS.active( 3, 5, 0 );
        PS.active( 2, 2, 0 );
        PS.active( 2, 3, 0 );
        PS.active( 2, 4, 0 );
        PS.active( 1, 3, 0 );
    } else {
        PS.active( 3, 1, 1 );
        PS.active( 3, 2, 1 );
        PS.active( 3, 3, 1 );
        PS.active( 3, 4, 1 );
        PS.active( 3, 5, 1 );
        PS.active( 2, 2, 1 );
        PS.active( 2, 3, 1 );
        PS.active( 2, 4, 1 );
        PS.active( 1, 3, 1 );

        PS.color( 3, 1, PS.COLOR_YELLOW );
        PS.color( 3, 2, PS.COLOR_YELLOW );
        PS.color( 3, 3, PS.COLOR_YELLOW );
        PS.color( 3, 4, PS.COLOR_YELLOW );
        PS.color( 3, 5, PS.COLOR_YELLOW );
        PS.color( 2, 2, PS.COLOR_YELLOW );
        PS.color( 2, 3, PS.COLOR_YELLOW );
        PS.color( 2, 4, PS.COLOR_YELLOW );
        PS.color( 1, 3, PS.COLOR_YELLOW );
    }
};

// present the inventory screen
initInventory = function () {

    inventory = true;                           // entered inventory

    var myImage, mySprite;

    // load and draw BW (inactive) diary inventory sprite
    PS.imageLoad( "images/journal_inv_bw.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 3, 10 );

        journalBWSprite = mySprite;             // Save for using later
    } );

    // load and draw BW (inactive) wallet inventory sprite
    PS.imageLoad( "images/objectX_bw.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 10, 10 );

        objectXBWSprite = mySprite;             // Save for using later
    } );

    // load and draw colored (active) diary inventory sprite
    PS.imageLoad( "images/journal_inv.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 3, 10 );

        journalInvSprite = mySprite;                // Save for using later

        // only visible if Coop's got the diary in his inventory
        if ( journal ) {
            PS.spriteShow( journalInvSprite, true );

        } else {
            PS.spriteShow( journalInvSprite, false );
        }
    } );

    // load and draw colored (active) wallet inventory sprite
    PS.imageLoad( "images/objectX.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 10, 10 );

        objectXInvSprite = mySprite;                // Save for using later

        // only visible if Coop's got the wallet in his inventory
        if ( objectX ) {
            PS.spriteShow( objectXInvSprite, true );

        } else {
            PS.spriteShow( objectXInvSprite, false );
        }
    } );

    // deactivate both arrows
    paintLeftArrow( false );
    paintRightArrow( false );

    // load and draw inventory background
    PS.imageLoad( "images/inventory.png", loadBG, 1 );
    PS.statusText( "Welcome to your inventory!" );
};

// present level 1
initLevel1 = function () {

    // set status text
    currentStatusText = "Talk to Sheriff Truman";
    PS.statusText( currentStatusText );

    // load and draw station background
    PS.imageLoad( "images/sheriffstation.png", loadBG, 1 );

    // load, create and draw Special Agent Dale Cooper

    var myImage, mySprite;

    PS.imageLoad( "images/cooper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 1, 18 );

        cooperSprite = mySprite;                // Save for using later
    } );

    // load, create and draw Sheriff Harry S. Truman

    PS.imageLoad( "images/sherifftruman.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 26, 18 );

        harrySprite = mySprite;                 // Save for using later
    } );

    // set level control variables
    level = 1;
    firstTime = false;

    // activate the corresponding arrows
    paintLeftArrow( false );
    paintRightArrow( true );
}

// present level 2
initLevel2 = function () {

    // set status text
    currentStatusText = "Talk to Leland Palmer";
    PS.statusText( currentStatusText );

    // load and draw Laura Palmer's home
    PS.imageLoad( "images/palmer_house.png", loadBG, 1 );

    // load, create and draw Special Agent Dale Cooper

    var myImage, mySprite;

    PS.imageLoad( "images/cooper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );


        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 1, 18 );

        cooperSprite = mySprite;                // Save for using later
    } );

    // load, create and draw Mr. Leland Palmer

    PS.imageLoad( "images/leland.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 26, 18 );

        lelandSprite = mySprite;                // Save for using later
    } );

    // set level control variables
    level = 2;
    firstTime = false;

    // activate the corresponding arrows
    paintLeftArrow( true );
    paintRightArrow( true );
}

// present level 3
initLevel3 = function () {

    // set status text
    currentStatusText = "Move around!";
    PS.statusText( currentStatusText );

    // load and draw area outside Double R diner
    PS.imageLoad( "images/outside_area.png", loadBG, 1 );

    // load, create and draw Special Agent Dale Cooper

    var myImage, mySprite;

    PS.imageLoad( "images/cooper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 3 );              // Cooper is on top
        PS.spriteMove( mySprite, xCoop, yCoop );

        cooperSprite = mySprite;                    // Save for using later
    } );


    // load, create and draw Leland's wallet sprite

    if ( !objectX ) {                               // Cooper hasn't got the wallet yet
        PS.imageLoad( "images/objectX.png", function ( data ) {
            myImage = data; // save image ID

            // Create an image sprite from the loaded image
            // Save sprite ID for later reference

            mySprite = PS.spriteImage( myImage );   // wallet is on bottom

            PS.spritePlane( mySprite, 1 );
            PS.spriteMove( mySprite, xobjX, yobjX );

            objectXSprite = mySprite;               // Save for using later
        } );
    }

    // create and draw a sprite hiding Leland's wallet

    mySprite = PS.spriteSolid( 5, 5 );
    hidingSprite = mySprite;

    PS.spritePlane( hidingSprite, 2 );              // between Coop and the wallet
    PS.spriteSolidColor( hidingSprite, 0x989898 );  // same color as background
    PS.spriteMove( hidingSprite, xobjX, yobjX );
    PS.spriteSolidAlpha( hidingSprite, hidingObjOpacity );  // fully opaque at first

    // set level control variables
    level = 3;
    firstTime = false;

    // activate the corresponding arrows
    paintLeftArrow( true );
    paintRightArrow( false );
}


// GAME INITIALIZATION
PS.init = function ( system, options ) {

    var complete = function ( user ) {
        currentStatusText = "Talk to Sheriff Truman";
        PS.statusText( currentStatusText );
    };

    // set the grid and draw separator between top and main screen zones
    PS.gridSize( WIDTH, HEIGHT );
    PS.border( PS.ALL, PS.ALL, 0 );                 // no border...
    PS.border( PS.ALL, 6, {                         // ...except for the separation
        top: 0,                                     //    between screen areas
        left: 0,
        bottom: 6,
        right: 0
    } );
    PS.borderColor( PS.ALL, 6, PS.COLOR_WHITE );



    // load the background music
    PS.audioPlay( "twin_peaks_8_bit", {
        fileTypes: [ "mp3", "ogg" ],
        path: "./",
        volume: 0.08,
        loop: true
    } );

    // Start the timer function
    // Run at 20 frames/sec (every 3 ticks)
    PS.timerStart( 3, tick );

    PS.audioLoad( "fx_tada" );                      // preload end of game sound

    // load and draw the screen top background
    PS.imageLoad( "images/flechas_y_maletin.png", loadScreentop, 1 );



    // present level 1
    initLevel1();

    DB.active( false ); // change the parameter to false to disable DB calls
    DB.init( "wrappedinplastic", complete ); // Collect credentials, and THEN call complete()
};


// POINT-AND-CLICK HANDLING
PS.touch = function ( x, y, data, options ) {

    PS.audioPlay( "fx_click" );                     // provides click audio feedback

    if ( ( x > 26 ) && ( y < 7 ) ) {                // CLICK ON RIGHT ARROW
        firstTime = false;

        // nuke sprites from previous level
        PS.spriteDelete( cooperSprite );            // Cooper is always there
        switch ( level ) {                          // rest of sprites
            case 1:
                PS.spriteDelete( harrySprite );
                if ( bubbleSprite != "" ) {
                    PS.spriteDelete( bubbleSprite );
                    bubbleSprite = "";
                }
                if ( journalSprite != "" ) {
                    PS.spriteDelete( journalSprite );
                    journalSprite = "";
                }
                if ( congratsSprite != "" ) {
                    PS.spriteDelete( congratsSprite );
                    congratsSprite = "";
                }
                break;
            case 2:
                PS.spriteDelete( lelandSprite );
                if ( bubbleSprite != "" ) {
                    PS.spriteDelete( bubbleSprite );
                    bubbleSprite = "";
                }
                if ( journalSprite != "" ) {
                    PS.spriteDelete( journalSprite );
                    journalSprite = "";
                }
                if ( crossSprite != "" ) {
                    PS.spriteDelete( crossSprite );
                    crossSprite = "";
                }
        }

        // go to next level
        level += 1;
        switch ( level ) {
            case 2:                                 // level 1 is unreachable from right arrow
                initLevel2();
                break;
            case 3:
                initLevel3();
        }


    } else if ( ( x < 5 ) && ( y < 7 ) ) {          // CLICK ON LEFT ARROW
        firstTime = false;

        // nuke sprites from previous levelS
        PS.spriteDelete( cooperSprite );            // Cooper is always there
        switch ( level ) {                          // rest of sprites
            case 1:
                PS.spriteDelete( harrySprite );
                if ( bubbleSprite != "" ) {
                    PS.spriteDelete( bubbleSprite );
                    bubbleSprite = "";
                }
                if ( journalSprite != "" ) {
                    PS.spriteDelete( journalSprite );
                    journalSprite = "";
                }
                if ( congratsSprite != "" ) {
                    PS.spriteDelete( congratsSprite );
                    congratsSprite = "";
                }
                break;
            case 2:
                PS.spriteDelete( lelandSprite );
                if ( bubbleSprite != "" ) {
                    PS.spriteDelete( bubbleSprite );
                    bubbleSprite = "";
                }
                if ( journalSprite != "" ) {
                    PS.spriteDelete( journalSprite );
                    journalSprite = "";
                }
                if ( crossSprite != "" ) {
                    PS.spriteDelete( crossSprite );
                    crossSprite = "";
                }
                break;
            case 3:
                if ( !objectX ) {
                    PS.spriteDelete( objectXSprite );
                    PS.spriteDelete( hidingSprite );
                }
        }

        // go to previous level
        level -= 1;
        switch ( level ) {
            case 1:
                initLevel1();
                break;
            case 2:                                 // level 3 is unreachable from left arrow
                initLevel2();
        }

    } else if ( ( x > 11 && x < 20 ) &&             // CLICK ON INVENTORY
        ( y < 7 ) ) {

        var prevStatusText = currentStatusText;     // save status text for later use
        if( gameDone ){

        }
        else if ( inventory == false ) {                 // when not on inventory screen...
            switch ( level ) {                      // ...hide current sprites...
                case 1:
                    PS.spriteShow( harrySprite, false );
                    PS.spriteShow( cooperSprite, false );
                    if ( bubbleSprite != "" ) {
                        PS.spriteShow( bubbleSprite, false );
                    }
                    if ( journalSprite != "" ) {
                        PS.spriteShow( journalSprite, false );
                    }
                    if ( congratsSprite != "" ) {
                        PS.spriteShow( congratsSprite, false );
                    }
                    break;
                case 2:
                    PS.spriteShow( lelandSprite, false );
                    PS.spriteShow( cooperSprite, false );
                    if ( bubbleSprite != "" ) {
                        PS.spriteShow( bubbleSprite, false );
                    }
                    if ( journalSprite != "" ) {
                        PS.spriteShow( journalSprite, false );
                    }
                    if ( crossSprite != "" ) {
                        PS.spriteShow( crossSprite, false );
                    }
                    break;
                case 3:
                    PS.spriteShow( cooperSprite, false );
                    PS.spriteShow( hidingSprite, false );
                    if ( objectXSprite != "" ) {
                        PS.spriteShow( objectXSprite, false );
                    }
            }
            initInventory();                        // ...and present inventory

            if ( notificationSprite != "" ) {
                PS.spriteDelete( notificationSprite );
                notificationSprite = "";
            }

        } else {                                    // when on inventory screen...
            switch ( level ) {
                case 1:
                    initLevel1();                   // ...launch level...
                    if ( journalBWSprite != "" ) {  // ...recover the corresponding sprites...
                        PS.spriteShow( journalBWSprite, false );
                    }
                    if ( objectXBWSprite != "" ) {
                        PS.spriteShow( objectXBWSprite, false );
                    }
                    if ( journalInvSprite != "" ) {
                        PS.spriteShow( journalInvSprite, false );
                    }
                    if ( objectXInvSprite != "" ) {
                        PS.spriteShow( objectXInvSprite, false );
                    }
                    if ( bubbleSprite != "" ) {
                        PS.spriteShow( bubbleSprite, true );
                    }
                    if ( journalSprite != "" ) {
                        PS.spriteShow( journalSprite, true );
                    }
                    if ( congratsSprite != "" ) {
                        PS.spriteShow( congratsSprite, true );
                    }
                    break;
                case 2:
                    initLevel2();
                    if ( journalBWSprite != "" ) {
                        PS.spriteShow( journalBWSprite, false );
                    }
                    if ( objectXBWSprite != "" ) {
                        PS.spriteShow( objectXBWSprite, false );
                    }
                    if ( journalInvSprite != "" ) {
                        PS.spriteShow( journalInvSprite, false );
                    }
                    if ( objectXInvSprite != "" ) {
                        PS.spriteShow( objectXInvSprite, false );
                    }

                    if ( bubbleSprite != "" ) {
                        PS.spriteShow( bubbleSprite, true );
                    }
                    if ( journalSprite != "" ) {
                        PS.spriteShow( journalSprite, true );
                    }
                    if ( crossSprite != "" ) {
                        PS.spriteShow( crossSprite, true );
                    }
                    break;
                case 3:
                    initLevel3();
                    if ( journalBWSprite != "" ) {
                        PS.spriteShow( journalBWSprite, false );
                    }
                    if ( objectXBWSprite != "" ) {
                        PS.spriteShow( objectXBWSprite, false );
                    }
                    if ( journalInvSprite != "" ) {
                        PS.spriteShow( journalInvSprite, false );
                    }
                    if ( objectXInvSprite != "" ) {
                        PS.spriteShow( objectXInvSprite, false );
                    }
                    break;
            }
            PS.statusText( prevStatusText );        // ...and the status text
            currentStatusText = prevStatusText;

            inventory = false;                        // out of inventory screen

        }

    } else {                                        // CLICK ON MAIN SCREEN

        switch ( level ) {
            case 1:                                 // when on level 1
                if ( firstTime ) {                  // if first time on level 1
                    initLevel1();                   // initialize and present level 1

                } else {                            // if not first time

                    if ( ( ( x > 26 && x < 30 ) && ( y > 17 && y < 21 ) ) |     // click on Harry
                        ( ( x == 28 ) && ( y == 21 ) ) |
                        ( ( x > 25 && x < 31 ) && ( y > 21 && y < 27 ) )
                        | ( ( x > 26 && x < 30 ) && y > 26 ) ) {

                        if ( journal ) {            // if Cooper has diary
                            harryCongrats();        // Harry congratulates Coop
                            journal = false;        // Cooper delivers diary

                            // deactivate arrows
                            paintRightArrow( false );
                            paintLeftArrow( false );

                            // end of game, stop showing notification sprite once you give journal to harry
                            if(notificationSprite != ""){
                                PS.spriteShow(notificationSprite, false);
                            }
                            gameDone = true;
                            DB.send();

                        } else if ( !gameDone ) {       // if game not done yet
                            bocadilloDiarioHarry();     // Harry speaks to Cooper

                            //change status text
                            currentStatusText = "Find the diary!";
                            PS.statusText( currentStatusText );
                        }
                    }
                }
                break;
            case 2:                                 // when on level 2
                if ( firstTime ) {                  // if first time on level
                    initLevel2()                    // initialize and present level 2

                } else {                            // if not first time

                    if ( !journal ) {               // if Coop has not the diary yet
                        if ( lelandOfferedJournal ) {   // but Leland offered it
                            if ( ( x > 19 && x < 25 ) &&   // if click on diary
                                ( y > 18 && y < 24 ) ) {

                                // move diary to inventory
                                journal = true;     // got diary
                                PS.spriteDelete( journalSprite );
                                journalSprite = "";

                                // notify new item in inventory
                                var mySprite;
                                mySprite = PS.spriteSolid( 2, 2 );
                                PS.spriteSolidColor( mySprite, PS.COLOR_RED );
                                PS.spriteMove( mySprite, 20, 0 );
                                notificationSprite = mySprite;

                                // change status text
                                currentStatusText = "You collected the diary!";
                                PS.statusText( currentStatusText );
                            }
                        }
                    }

                    if ( ( ( x > 26 && x < 30 ) && ( y > 17 && y < 21 ) ) |  // if click on Leland
                        ( ( x == 28 ) && ( y == 21 ) ) |
                        ( ( x > 25 && x < 31 ) && ( y > 21 && y < 27 ) ) |
                        ( ( x > 26 && x < 30 ) && y > 26 ) ) {

                        if ( objectX ) {            // and Cooper got the wallet

                            objectX = false;        // Cooper delivers wallet

                            // change status text
                            currentStatusText = "Look! It's the diary!";
                            PS.statusText( currentStatusText );

                            bocadilloDiarioLeland(); // Leland speaks to Cooper

                        } else {                    // Coop didn't get the wallet yet

                            //change status text
                            currentStatusText = "Find Leland's wallet";
                            PS.statusText( currentStatusText );

                            bocadilloCruzLeland();  // Leland says no
                        }
                    }
                }
                break;

            case 3:                                 // when on level 3

                if ( firstTime ) {                  // if first time on level
                    initLevel3()                    // initialize and present level 3

                } else {                            // if not first time

                    if ( !objectX ) {               // if Coop didn't get the wallet yet

                        if ( hidingObjOpacity < 2 ) {       // if wallet fully visible
                            if ( ( x > ( xobjX - 1 ) &&     // if click on wallet
                                x < ( xobjX + 5 ) ) &&
                                ( y > ( yobjX - 1 ) &&
                                    y < ( yobjX + 5 ) ) ) {

                                // move wallet to inventory
                                objectX = true;
                                PS.spriteDelete( objectXSprite );
                                objectXSprite = "";

                                // notify new item in inventory
                                var mySprite;
                                mySprite = PS.spriteSolid( 2, 2 );
                                PS.spriteSolidColor( mySprite, PS.COLOR_RED );
                                PS.spriteMove( mySprite, 20, 0 );
                                notificationSprite = mySprite;

                                // change status text
                                currentStatusText = "Good job! You found Leland's wallet!"
                                PS.statusText( currentStatusText );
                            }

                        } else {                    // if wallet not fully revealed

                            // move Cooper = create new path to (x, yCoop)
                            var line;

                            // Calc a line from current position
                            // to touched position
                            line = PS.line( xCoop, yCoop, ( x - 2 ), yCoop );

                            // If line is not empty,
                            // make it the new path
                            if ( line.length > 0 ) {
                                path = line;
                                step = 0; // start at beginning
                            }
                        }
                    }
                }
        }
    }
};