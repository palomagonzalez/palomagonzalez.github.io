/*
      +++++  WRAPPED IN PLASTIC  +++++
      Final take ------- Final version
 */

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
var RED = PS.COLOR_RED;
var GREEN = PS.COLOR_GREEN;
var BLUE = PS.COLOR_BLUE;
var VIOLET = 0xff91f2;
var GRAY = PS.COLOR_GRAY_LIGHT;
var BLACK = PS.COLOR_BLACK;


// GLOBAL VARIABLES

// control variables
var click_id = "";                  // saves channel ID
var level = 1;                      // level tracker
var inventory = false;              // in inventory?
var journal = false;                // Cooper has diary
var objectX = false;                // Cooper has Leland's wallet
var hidingObjOpacity = 255;         // opacity of the sprite hiding wallet
var lelandOfferedJournal = false;   // has Leland offered the diary to Harry?
var mask = false;                   // has Cooper retrieved the mask?
var disinfectant = false;           // has Cooper retrieved the disinfectant?
var gameDone = false;               // end of game
var ach11b = false, ach13b = false;
var cherryState = 0;
var offeredWorms = false;
var offeredDisinf = false;
var offeredMask = false;
var rockState = 0;
var rockDone = false;
var readyForCode = false;
var achievement = 0;                // 0 - no progress yet
                                    // 1 - spoke to Harry (first time)
                                    // 2 - spoke to Leland (first time)
                                    // 3 - wallet revealed
                                    // 4 - picked up wallet
                                    // 5 - spoke to Leland (second time)
                                    // 6 - picked up diary
                                    // 7 - spoke to Harry (second time)
                                    // 8 - note revealed
                                    // 9 - picked up note
                                    // 10 - rock destroyed
                                    // 11 - picked up toilet paper
                                    // 12 - picked up worms
                                    // 13 - picked up disinfectant
                                    // 14 - toilet paper delivered
                                    // 15 - picked up mask
                                    // 16 - code revealed
                                    // 17 - talk to Harry after receiving the code
                                    // 18 - give worms to the owl
                                    // 19 - keypad incorrect
                                    // 20 - keypad correct
                                    // 21 - after talking to the giant
                                    // 22 - talk to the MfAP
                                    // 23 - play until 30% health
                                    // 24 - grab mask and disinfectant
                                    // 25 - finish the game!

// file paths
var pieFiles = [ "images/cherrypie1.png", "images/cherrypie2.png",
    "images/cherrypie3.png", "images/cherrypie4.png", "images/cherrypie5.png" ];
var rockFiles = [ "images/rock.png", "images/rock2.png", "images/rock3.png",
    "images/rock4.png", "images/rock5.png", "images/rock6.png", "images/rock7.png",
    "images/rock8.png", "images/rock9.png" ]

// sprite declarations
var bubbleSprite = "", crossSprite = "", congratsSprite = "";
var cherrypieSprite = "", hidingSprite = "", rockSprite = "", bigNoteSprite = "";
var notificationSprite = "";
var cooperSprite = "", harrySprite = "", lelandSprite = "", peteSprite = "",
    normaSprite = "", margaretSprite = "", enanoSprite = "";
var cooperGun = "", cooperMask = "", cooperDisinfectant = "", cooperBoth = "";
var objectXSprite = "", objectXInvSprite = "", objectXBWSprite = "";
var journalSprite = "", journalInvSprite = "", journalBWSprite = "";
var noteSprite = "", noteInvSprite = "", noteBWSprite = "";
var toiletpaperSprite = "", toiletPaperInvSprite = "", toiletpaperBWSprite = "";
var wormsSprite = "", wormsInvSprite = "", wormsBWSprite = "";
var disinfectantSprite = "", disinfectantInvSprite = "", disinfectantBWSprite = "";
var maskSprite = "", maskInvSprite = "", maskBWSprite = "";
var owlAsleepSprite = "", owlAwakeSprite = "", openDoorSprite = "", healthSprite = "",
    inventoryLevel11 = "", grandFinaleSprite = "";

var xCoop = 1, yCoop = 18;          // Coop's position
var xobjX = 13, yobjX = 27;         // creamed corn position

var currentStatusText;              // text in the status box

// for timers' use
var path = null;                    // path to follow, null if none
var step = 0;                       // current step on path
var banner = [ null ];              // banner to display, null if none
var text = "";                      // intermediate text
var stepBanner = [ 0 ];             // current step on banner
var idxBanner = 0;
var delayBanner = [ 0 ];
var textTime = 40;                  // text displaying 'time'
var textEnd = true;                 // pause interaction until text displayed

// for keypad game
var attempt = 0;
var keyColor = [ VIOLET, RED, GREEN, BLUE, GRAY ];
var keyData = [ 0, 1, 2, 3 ];
var code = [ 0, 0, 0, 0 ];
var rightCode = [ 1, 3, 2, 0 ];
var posKey = [ [ 11, 20 ], [ 16, 20 ], [ 11, 24 ], [ 16, 24 ] ];
var posLetter = [ [ 11, 10 ], [ 16, 10 ], [ 11, 15 ], [ 16, 15 ] ];
var letterIdx;


//for coronavirus game
var zonasMuertas = 0;
var falseTries = 0;
var zone01 = true;
var zone02 = true;
var zone03 = true;
var zone04 = true;
var zone05 = true;
var zone06 = true;
var zone07 = true;
var zone08 = true;
var zone09 = true;
var zone10 = true;
var zone11 = true;
var zone12 = true;
var zone13 = true;
var zone14 = true;

// character maps for the code (as revealed by Margaret)
var mapCodeN = [
    0, 0, 0, 0,
    1, 1, 1, 0,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1 ];
var mapCodeC = [
    1, 1, 1, 1,
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 1, 1, 1 ];
var mapCode1 = [
    0, 0, 1, 0,
    0, 1, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 1, 1, 1 ];
var mapCode9 = [
    1, 1, 1, 1,
    1, 0, 0, 1,
    1, 1, 1, 1,
    0, 0, 0, 1,
    0, 0, 0, 1 ]

// character maps for the code (as in the keypad)
var mapLetter = [
    [
        0, 0, 0,
        1, 1, 1,
        1, 0, 1,
        1, 0, 1 ],
    [
        1, 1, 1,
        1, 0, 0,
        1, 0, 0,
        1, 1, 1 ],
    [
        0, 1, 0,
        1, 1, 0,
        0, 1, 0,
        1, 1, 1 ],
    [
        1, 1, 1,
        1, 0, 1,
        1, 1, 1,
        0, 0, 1 ] ];


// GLOBAL FUNCTIONS

// load and draw main screen backgrounds
var loadBG = function ( imageData ) {

    // The image argument of loadBG() is passed
    // an image object representing *.bmp

    var imagen = imageData;
    var x, y, ptr, color;

    ptr = 0;                            // init pointer into data array
    for ( y = 7; y < 32; y += 1 ) {
        for ( x = 0; x < 32; x += 1 ) {
            color = imagen.data[ ptr ]; // get color
            PS.color( x, y, color );    // assign to bead
            ptr += 1;                   // point to next value
        }
    }
    PS.gridRefresh();                   // required to show effect of bead coloring

};

// load and draw screen top background
var loadScreentop = function ( imageData ) {

    // The image argument of loadScreentop() is passed
    // an image object representing *.bmp

    var imagen = imageData;
    var x, y, ptr, color;

    ptr = 0; // init pointer into data array
    for ( y = 0; y < 7; y += 1 ) {
        for ( x = 0; x < 32; x += 1 ) {
            color = imagen.data[ ptr ]; // get color
            PS.color( x, y, color );    // assign to bead
            ptr += 1;                   // point to next value
        }
    }
    PS.gridRefresh();                   // required to show effect of bead coloring
};

// load and draw coronavirus
var loadCovid = function ( imageData ) {

    PS.gridPlane( 1 );                  // put coronavirus over Red Room

    // The image argument of loadCovid() is passed
    // an image object representing *.bmp

    var imagen = imageData;
    var x, y, ptr, color, transp;
    for ( i = 0; i < 156; i++ )
        ptr = 0; // init pointer into data array
    for ( y = 0; y < 12; y += 1 ) {
        for ( x = 0; x < 13; x += 1 ) {
            color = imagen.data[ ptr ];             // get color
            transp = imagen.data[ ptr + 1 ];        // get transparency
            PS.alpha( x + 15, y + 11, transp );
            PS.color( x + 15, y + 11, color );      // assign to bead
            ptr += 2;                               // point to next pixel
        }
    }
    PS.gridRefresh();                   // required to show effect of bead coloring
};

// draw and activate/deactivate right arrow
var paintRightArrow = function ( activate ) {

    var x, y;

    if ( !activate ) {                  // first color, then deactivate
        PS.color( 28, 1, 0xc7c7c7 );
        PS.color( 28, 2, 0xc7c7c7 );
        PS.color( 28, 3, 0xc7c7c7 );
        PS.color( 28, 4, 0xc7c7c7 );
        PS.color( 28, 5, 0xc7c7c7 );
        PS.color( 29, 2, 0xc7c7c7 );
        PS.color( 29, 3, 0xc7c7c7 );
        PS.color( 29, 4, 0xc7c7c7 );
        PS.color( 30, 3, 0xc7c7c7 );

        for ( x = 27; x < 32; x++ ) {
            for ( y = 0; y < 7; y++ ) {
                PS.active( x, y, 0 );
            }
        }
    } else {                            // first reactivate, then color
        for ( x = 27; x < 32; x++ ) {
            for ( y = 0; y < 7; y++ ) {
                PS.active( x, y, 1 );
            }
        }
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
var paintLeftArrow = function ( activate ) {

    if ( !activate ) {                  // first color, then deactivate
        PS.color( 3, 1, 0xc7c7c7 );
        PS.color( 3, 2, 0xc7c7c7 );
        PS.color( 3, 3, 0xc7c7c7 );
        PS.color( 3, 4, 0xc7c7c7 );
        PS.color( 3, 5, 0xc7c7c7 );
        PS.color( 2, 2, 0xc7c7c7 );
        PS.color( 2, 3, 0xc7c7c7 );
        PS.color( 2, 4, 0xc7c7c7 );
        PS.color( 1, 3, 0xc7c7c7 );

        for ( x = 0; x < 5; x++ ) {
            for ( y = 0; y < 7; y++ ) {
                PS.active( x, y, 0 );
            }
        }

    } else {                            // first reactivate, then color
        for ( x = 0; x < 5; x++ ) {
            for ( y = 0; y < 7; y++ ) {
                PS.active( x, y, 1 );
            }
        }
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

// draw bubble and sprite when Leland says no
var bocadilloCruzLeland = function () {

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
};

// draw bubble and sprite when Leland offers diary
var bocadilloDiarioLeland = function () {

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
};

// draw bubble and sprite when harry asks for the diary
var bocadilloDiarioHarry = function () {

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
};

// expand note when clicked
var drawBigNote = function () {

    var myImage, mySprite;

    // load and draw note
    PS.imageLoad( "images/note.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 21, 22 );

        noteSprite = mySprite;        // Save for using later
        //lelandOfferedJournal = true;
    } );
};

// paint characters when revealing the code
var paintCode = function ( mapCode, colorCode ) {
    var x, y;

    PS.gridShadow( true, colorCode );           // same color than the character

    for ( y = 0; y < 5; y++ ) {
        for ( x = 0; x < 4; x++ ) {
            if ( mapCode[ x + ( y * 4 ) ] == 1 )
                PS.color( x + 26, y + 12, colorCode );      // character color
            else
                PS.color( x + 26, y + 12, 0xFFF3D6 );       // background color
        }
    }
};

// initialize keys in the keypad
var initKeys = function () {
    var x, y, i;
    for ( i = 0; i < 4; i++ ) {
        for ( ( x = posKey[ i ][ 0 ] ); ( x < ( posKey[ i ][ 0 ] + 3 ) ); x++ ) {
            for ( ( y = posKey[ i ][ 1 ] ); ( y < ( posKey[ i ][ 1 ] + 3 ) ); y++ ) {
                PS.active( x, y, true );                    // activate keys
                PS.color( x, y, keyColor[ i ] );            // color keys
                keyData[ i ] = i;                           // data is color
                PS.data( x, y, keyData[ i ] );              // assign data to beads
            }
        }
    }
};

// recolor keys during keypad minigame
var redrawKeys = function () {
    var x, y, i;
    for ( i = 0; i < 4; i++ ) {
        for ( ( x = posKey[ i ][ 0 ] ); ( x < ( posKey[ i ][ 0 ] + 3 ) ); x++ ) {
            for ( ( y = posKey[ i ][ 1 ] ); ( y < ( posKey[ i ][ 1 ] + 3 ) ); y++ ) {
                PS.data( x, y, keyData[ i ] );
                PS.color( x, y, keyColor[ keyData[ i ] ] );
                if ( keyData[ i ] == 4 ) {                  // color gray...
                    PS.active( x, y, false );               // ...and inactive
                }
            }
        }
    }
};

// recolor letters during keypad minigame
var redrawLetter = function ( nas, color ) {

    var x, y;
    for ( x = 0; x < 3; x++ ) {
        for ( y = 0; y < 4; y++ ) {
            if ( mapLetter[ nas ][ ( x + ( 3 * y ) ) ] == 1 ) {
                PS.color( ( x + posLetter[ nas ][ 0 ] ), ( y + posLetter[ nas ][ 1 ] ), color );
            }
        }
    }
};

// Timer function for Cooper movement, called every 1/10th sec
var tick = function () {

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

        // creamed corn is gradually revealed
        if ( xCoop == 16 ) {
            hidingObjOpacity = hidingObjOpacity - 64;
            PS.spriteSolidAlpha( hidingSprite, hidingObjOpacity );
        }

        if ( hidingObjOpacity < 2 ) {
            setBanner( [ "Grab the creamed corn!" ] );
            achievement = 3;            // corn revealed
        }
        step += 1;                      // point to next step

        // If no more steps, nuke path
        if ( step >= path.length ) {
            path = null;
        }
    }
};

// format text to progressively display it in the status box
var setBanner = function ( data, time ) {
    PS.statusText( "" );
    idxBanner = 0;
    text = "";
    stepBanner = [];
    delayBanner = [];
    var j;
    for ( j = 0; j < data.length; j += 1 ) {
        stepBanner[ j ] = 0;
        delayBanner[ j ] = 0;
    }
    banner = data;
    if ( time == undefined ) {                      // if time is not informed...
        textTime = 40;                              // ...use 40
    } else {
        textTime = time;
    }
    currentStatusText = data[ 0 ];
};

// timer function for banner display, called every 0.05 sec
var tickBanner = function () {

    var c = "";
    var bannerTemp;

    if ( banner[ idxBanner ] ) {                       // path ready (not null)?
        textEnd = false;
        bannerTemp = banner[ idxBanner ];

        if ( stepBanner[ idxBanner ] < bannerTemp.length ) {
            // Get next character in banner
            c = bannerTemp[ stepBanner[ idxBanner ] ];
            text = text + c;

            // display text
            PS.statusText( text );

            stepBanner[ idxBanner ] += 1;               // point to next step
        }

        // If no more steps, nuke banner and text
        else if ( delayBanner[ idxBanner ] >= textTime ) {  // minimun display time
            PS.audioPlay( "fx_blip", {         // blip end-of-text audio feedback
                volume: 0.15
            } );
            banner[ idxBanner ] = null;
            text = "";
            //PS.statusText( "" );
            idxBanner += 1;
            textEnd = true;
        }

        delayBanner[ idxBanner ] += 1;
    }
};

// hide inventory sprites when closing inventory
var hideInvSprites = function () {

    if ( journalBWSprite != "" ) {
        PS.spriteShow( journalBWSprite, false );
    }
    if ( journalInvSprite != "" ) {
        PS.spriteShow( journalInvSprite, false );
    }
    if ( objectXBWSprite != "" ) {
        PS.spriteShow( objectXBWSprite, false );
    }
    if ( objectXInvSprite != "" ) {
        PS.spriteShow( objectXInvSprite, false );
    }
    if ( noteBWSprite != "" ) {
        PS.spriteShow( noteBWSprite, false );
    }
    if ( noteInvSprite != "" ) {
        PS.spriteShow( noteInvSprite, false );
    }
    if ( toiletpaperBWSprite != "" ) {
        PS.spriteShow( toiletpaperBWSprite, false );
    }
    if ( toiletpaperInvSprite != "" ) {
        PS.spriteShow( toiletpaperInvSprite, false );
    }
    if ( wormsBWSprite != "" ) {
        PS.spriteShow( wormsBWSprite, false );
    }
    if ( wormsInvSprite != "" ) {
        PS.spriteShow( wormsInvSprite, false );
    }
    if ( disinfectantBWSprite != "" ) {
        PS.spriteShow( disinfectantBWSprite, false );
    }
    if ( disinfectantInvSprite != "" ) {
        PS.spriteShow( disinfectantInvSprite, false );
    }
    if ( maskBWSprite != "" ) {
        PS.spriteShow( maskBWSprite, false );
    }
    if ( maskInvSprite != "" ) {
        PS.spriteShow( maskInvSprite, false );
    }
    if ( inventoryLevel11 != "" ) {
        PS.spriteDelete( inventoryLevel11 );
        inventoryLevel11 = "";
    }
};

// present the inventory screen
var initInventory = function () {

    inventory = true;                           // entered inventory

    var myImage, mySprite;

    // load and draw BW (inactive) diary inventory sprite
    PS.imageLoad( "images/journal_inv_bw.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 10, 10 );

        journalBWSprite = mySprite;             // Save for using later
    } );

    // load and draw BW (inactive) wallet inventory sprite
    PS.imageLoad( "images/objectX_bw.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 3, 10 );

        objectXBWSprite = mySprite;             // Save for using later
    } );

    // load and draw BW (inactive) note inventory sprite
    PS.imageLoad( "images/note_INV.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 17, 10 );

        noteBWSprite = mySprite;             // Save for using later
    } );

    // load and draw BW (inactive) toilet paper inventory sprite
    PS.imageLoad( "images/toilet_paper_INV.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 24, 9 );

        toiletpaperBWSprite = mySprite;             // Save for using later
    } );

    // load and draw BW (inactive) worms inventory sprite
    PS.imageLoad( "images/worms_INV.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 3, 18 );

        wormsBWSprite = mySprite;             // Save for using later
    } );

    // load and draw BW (inactive) disinfectant inventory sprite
    PS.imageLoad( "images/disinfectant_INV.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 11, 16 );

        disinfectantBWSprite = mySprite;             // Save for using later
    } );

    // load and draw BW (inactive) mask inventory sprite
    PS.imageLoad( "images/mask_INV.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 17, 19 );

        maskBWSprite = mySprite;             // Save for using later
    } );

    // load and draw colored (active) diary inventory sprite
    PS.imageLoad( "images/journal_inv.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 10, 10 );

        journalInvSprite = mySprite;            // Save for using later

        // only visible if Coop's got the diary in his inventory
        if ( achievement == 6 ) {
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
        PS.spriteMove( mySprite, 3, 10 );

        objectXInvSprite = mySprite;            // Save for using later

        // only visible if Coop's got the corn in his inventory
        if ( achievement == 4 ) {
            PS.spriteShow( objectXInvSprite, true );
        } else {
            PS.spriteShow( objectXInvSprite, false );
        }
    } );

    // load and draw colored (active) toilet paper inventory sprite
    PS.imageLoad( "images/toilet_paper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 24, 9 );

        toiletpaperInvSprite = mySprite;            // Save for using later

        // only visible if Coop's got the toilet paper in his inventory
        if ( ( achievement == 11 ) || ( achievement == 12 ) || ( achievement == 13 ) ) {
            PS.spriteShow( toiletpaperInvSprite, true );
        } else {
            PS.spriteShow( toiletpaperInvSprite, false );
        }
    } );

    // load and draw colored (active) worms inventory sprite
    PS.imageLoad( "images/worms.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 3, 18 );

        wormsInvSprite = mySprite;            // Save for using later

        // only visible if Coop's got the worms in his inventory
        if ( ( achievement > 11 ) && ( achievement < 18 ) ) {
            PS.spriteShow( wormsInvSprite, true );
        } else {
            PS.spriteShow( wormsInvSprite, false );
        }
    } );

    // load and draw colored (active) disinfectant inventory sprite
    PS.imageLoad( "images/disinfectant.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 11, 16 );

        disinfectantInvSprite = mySprite;             // Save for using later

        //only visible if Coop's got the disinfectant in his inventory
        if ( achievement > 12 && ( !disinfectant ) ) {
            PS.spriteShow( disinfectantInvSprite, true );
        } else {
            PS.spriteShow( disinfectantInvSprite, false );
        }
    } );

    // load and draw colored (active) mask inventory sprite
    PS.imageLoad( "images/mask.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 17, 19 );

        maskInvSprite = mySprite;             // Save for using later

        //only visible if Coop's got the mask in his inventory
        if ( achievement > 14 && ( !mask ) ) {
            PS.spriteShow( maskInvSprite, true );
        } else {
            PS.spriteShow( maskInvSprite, false );
        }
    } );

    // load and draw colored (active) note inventory sprite
    PS.imageLoad( "images/note.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 17, 10 );

        noteInvSprite = mySprite;             // Save for using later

        //only visible if Coop's got the note in his inventory
        if ( achievement > 8 && achievement < 11 ) {
            PS.spriteShow( noteInvSprite, true );
        } else {
            PS.spriteShow( noteInvSprite, false );
        }
    } );


    //paint background sprite
    PS.imageLoad( "images/inventory.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 3 );
        PS.spriteMove( mySprite, 0, 7 );

        inventoryLevel11 = mySprite;             // Save for using later
    } );

    // deactivate both arrows
    paintLeftArrow( false );
    paintRightArrow( false );

    // load and draw inventory background
    //PS.gridPlane( 2 );
    //PS.imageLoad( "images/inventory.png", loadBG, 1 );

    PS.statusText( "Welcome to your inventory!" );
};

// present level 1 (sheriff station)
var initLevel1 = function () {

    // set status text according to the progress
    switch ( achievement ) {
        case 1:
            setBanner( [ "Go talk to Leland Palmer" ] );
            break;
        case 2:
            setBanner( [ "Go find the diary, Agent Cooper" ] );
            break;
        case 3:
            setBanner( [ "Get me the diary, Agent Cooper" ] );
            break;
        case 4:
            setBanner( [ "Get me the diary, Agent Cooper" ] );
            break;
        case 6:
            setBanner( [ "Hi Coop. I see you got the diary.",
                "Good work! Give me the book and",
                "let's see what's inside..." ] );
            break;
        case 7:
            setBanner( [ "I think it’s a map?",
                "And some sort of instructions I believe." ] );
            break;
        case 9:
            setBanner( [ "Here, agent, your next assignment.",
                "Figure out what is going on with this." ], 50 );
            break;
        default:
            setBanner( [ "Talk to Sheriff Truman" ], 30 );
    }

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

    // activate the corresponding arrows

    paintLeftArrow( false );            // always inactive on level 1

    if ( achievement < 6 ) {
        paintRightArrow( true );
    }
    if ( achievement == 6 ) {
        paintRightArrow( false );
    }
    if ( achievement == 9 ) {
        paintRightArrow( true );
    }
    if ( achievement == 11 ) {
        if ( ach11b ) {
            paintRightArrow( true );
        } else {
            paintRightArrow( false );       // activate after speaking to Harry
        }
    }
    if ( achievement == 13 ) {
        if ( ach13b ) {
            paintRightArrow( true );
        } else {
            paintRightArrow( false );       // activate after speaking to Harry
        }
    }
    if ( achievement == 17 )
        paintRightArrow( true );
};

// present level 2 (palmers' home)
var initLevel2 = function () {

    // set status text
    switch ( achievement ) {
        case 2:
            setBanner( [ "Go find my creamed corn." ] );
            break;
        case 3:
            setBanner( [ "Go find my creamed corn." ] );
            break;
        case 4:
            setBanner( [ "Give Leland his creamed corn." ] );
            break;
        case 5:
            setBanner( [ "Look, it's the diary!" ] );
            break;
        case 6:
            setBanner( [ "You collected the diary!" ] );
            break;
        default:
            setBanner( [ "Talk to Leland Palmer." ] );
    }

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

    if ( achievement == 5 )                     // if the diary was offered
        bocadilloDiarioLeland();

    // set level control variables
    level = 2;

    // activate the corresponding arrows
    paintLeftArrow( true );
    paintRightArrow( true );
};

// present level 3 (outside of diner)
var initLevel3 = function () {

    // set status text
    switch ( achievement ) {
        case 0:
            setBanner( [ "Go talk to Sheriff Truman." ] );
            break;
        case 1:
            setBanner( [ "Go talk to Leland Palmer." ] );
            break;
        case 2:
            setBanner( [ "Move around!" ], 30 );
            break;
        case 3:
            setBanner( [ "Grab the creamed corn!" ] );
            break;
        default:
            setBanner( [ "You found Leland's creamed corn!" ] );
    }

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

    // load, create and draw Leland's corn sprite

    if ( achievement < 4 ) {                    // Cooper hasn't got the corn yet
        PS.imageLoad( "images/objectX.png", function ( data ) {
            myImage = data; // save image ID

            // Create an image sprite from the loaded image
            // Save sprite ID for later reference

            mySprite = PS.spriteImage( myImage );   // corn is on bottom

            PS.spritePlane( mySprite, 1 );
            PS.spriteMove( mySprite, xobjX, yobjX );

            objectXSprite = mySprite;               // Save for using later
        } );
    }

    // create and draw a sprite hiding Leland's corn

    mySprite = PS.spriteSolid( 5, 5 );
    hidingSprite = mySprite;

    PS.spritePlane( hidingSprite, 2 );              // between Coop and the corn
    PS.spriteSolidColor( hidingSprite, 0x989898 );  // same color as background
    PS.spriteMove( hidingSprite, xobjX, yobjX );
    PS.spriteSolidAlpha( hidingSprite, hidingObjOpacity );  // fully opaque at first

    // set level control variables
    level = 3;

    // activate the corresponding arrows
    paintLeftArrow( true );
    paintRightArrow( false );
};

// present level 4 (outdoor rock area)
var initLevel4 = function () {

    // set status text
    switch ( achievement ) {
        case 9:
            setBanner( [ "What's under this rock?" ] );
            break;
        case 10:
            setBanner( [ "A roll of toilet paper? That's strange..." ] );
            break;
        case 11:
            setBanner( [ "You've collected the toilet paper!" ] );
    }

    // load and draw station background
    PS.imageLoad( "images/outside_rock_puzzle.png", loadBG, 1 );

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

    // load, create and draw the rock

    if ( rockState < 8 ) {
        PS.imageLoad( rockFiles[ rockState ], function ( data ) {
            myImage = data; // save image ID

            // Create an image sprite from the loaded image
            // Save sprite ID for later reference

            mySprite = PS.spriteImage( myImage );

            PS.spritePlane( mySprite, 4 );
            PS.spriteMove( mySprite, 9, 15 );

            rockSprite = mySprite;                 // Save for using later

        } );
    }

    //load, create and draw the toilet paper sprite

    PS.imageLoad( "images/toilet_paper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 2 );
        PS.spriteMove( mySprite, 15, 26 );

        toiletpaperSprite = mySprite;                 // Save for using later

        if ( achievement == 11 ) {
            PS.spriteShow( toiletpaperSprite, false );
        } else {
            PS.spriteShow( toiletpaperSprite, true );
        }
    } );


    level = 4;
    paintRightArrow( false );
    paintLeftArrow( false );
};

// present level 5 (diner)
var initLevel5 = function () {

    // set status text
    switch ( achievement ) {
        case 11:
            if ( offeredWorms ) {
                setBanner( [ "Grab the worms from Pete." ] );
            } else {
                setBanner( [ "Talk to the locals and eat pie!" ] );
            }
            break;
        case 12:
            if ( offeredDisinf ) {
                setBanner( [ "Grab the disinfectant from Norma." ] );
            } else {
                setBanner( [ "Talk to Norma." ] );
            }
            break;
        case 13 :
            setBanner( [ "You got some disinfectant and worms." ] );
            break;
        default:
            setBanner( [ "Talk to the locals and eat pie!" ] );
    }

    // load and draw diner background
    PS.imageLoad( "images/double_r.png", loadBG, 1 );

    // load, create and draw Special Agent Dale Cooper

    var myImage, mySprite;

    PS.imageLoad( "images/cooper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 1, 15 );

        cooperSprite = mySprite;                // Save for using later
    } );

    // load, create and draw Pete Martell

    if ( achievement < 12 ) {
        PS.imageLoad( "images/pete.png", function ( data ) {
            myImage = data; // save image ID

            // Create an image sprite from the loaded image
            // Save sprite ID for later reference

            mySprite = PS.spriteImage( myImage );

            PS.spritePlane( mySprite, 2 );
            PS.spriteMove( mySprite, 25, 14 );

            peteSprite = mySprite;                 // Save for using later
        } );
    }

    // load, create and draw Norma

    PS.imageLoad( "images/norma.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 25, 15 );

        normaSprite = mySprite;                 // Save for using later
    } );

    // load, create and draw the plate of cherry pie

    PS.imageLoad( pieFiles[ cherryState ], function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 7, 15 );

        cherrypieSprite = mySprite;                 // Save for using later
    } );

    // set level control variables
    level = 5;

    // activate the corresponding arrows
    paintLeftArrow( false );
    paintRightArrow( false );
};

// present level 6 (log lady's home)
var initLevel6 = function () {

    // set status text
    switch ( achievement ) {
        case 14:
            if ( offeredMask ) {
                setBanner( [ "Collect the mask." ] );
            } else {
                setBanner( [ "Talk to Margaret" ] );
            }
            break;
        case 15:
            if ( readyForCode ) {
                setBanner( [ "Click Margaret when you're ready." ] );
            } else {
                setBanner( [ "Talk to Margaret." ] );
            }
            break;
        case 16:
            setBanner( [ "Click Margaret to see this again,",
                "or go back to the Sheriff station." ] );
            break;
        default:
            setBanner( [ "Talk to Margaret" ] );
    }

    // load and draw log lady's house
    PS.imageLoad( "images/logladyhouse.png", loadBG, 1 );

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

    // load, create and draw Log Lady

    PS.imageLoad( "images/MARGARET.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 24, 17 );

        margaretSprite = mySprite;                 // Save for using later
    } );

    // set level control variables
    level = 6;

    // activate the corresponding arrows
    if ( achievement == 16 ) {
        paintLeftArrow( true );
    } else {
        paintLeftArrow( false );
    }
    paintRightArrow( false );

};

// present level 7 (owl level)
var initLevel7 = function () {

    // set status text
    switch ( achievement ) {
        case 17:
            setBanner( [ "This is a strange looking owl...",
                "Is nothing normal in this town?",
                "He seems to be asleep.",
                "What if I give him some food?" ] );
            break;
        case 18:
            setBanner( [ "Welcome, special agent.",
                "Let me give you a piece of advice...",
                "The generosity of the townsfolk",
                "may prove useful in the future.",
                "You may now proceed." ] );
            break;
    }

    // load and draw outside owl level
    PS.imageLoad( "images/outside_owl.png", loadBG, 1 );

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

    if ( achievement == 17 ) {
        // load, create and draw the big sleeping owl
        PS.imageLoad( "images/owl_asleep.png", function ( data ) {
            myImage = data; // save image ID

            // Create an image sprite from the loaded image
            // Save sprite ID for later reference

            mySprite = PS.spriteImage( myImage );

            PS.spritePlane( mySprite, 1 );
            PS.spriteMove( mySprite, 14, 9 );

            owlAsleepSprite = mySprite;                 // Save for using later
        } );
    } else if ( achievement == 18 ) {
        // load, create and draw the big owl awake
        PS.imageLoad( "images/owl_awake.png", function ( data ) {
            myImage = data; // save image ID

            // Create an image sprite from the loaded image
            // Save sprite ID for later reference

            mySprite = PS.spriteImage( myImage );

            PS.spritePlane( mySprite, 1 );
            PS.spriteMove( mySprite, 14, 9 );

            owlAwakeSprite = mySprite;                 // Save for using later
        } );
    }

    // set level control variables
    level = 7;

    // activate the corresponding arrows

    paintLeftArrow( false );

    if ( achievement == 18 ) {
        paintRightArrow( true );
    } else {
        paintRightArrow( false );
    }

};

// initialize keypad
var initCode = function () {

    var i;
    // initialize keypad letters
    for ( i = 0; i < 4; i++ ) {
        letterIdx = i;
        redrawLetter( letterIdx, BLACK );
    }
    initKeys();                 // initialize keypad keys
    attempt = 0;                // initialize attempts
    code = [ 0, 0, 0, 0 ];      // initialize code
};

// present level 8 (keypad puzzle)
var initLevel8 = function () {

    // load and draw keypad puzzle level
    PS.imageLoad( "images/keypad_puzzle.png", loadBG, 1 );

    // inilialize keypad
    initCode();

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

    // change status text
    setBanner( [ "Looks like you need a special password..." ] );

    // set level control variables
    level = 8;

    // manage arrows
    paintLeftArrow( false );
    paintRightArrow( false );
};

// present level 9 (giant abyss)
var initLevel9 = function () {

// load and draw abyss level
    PS.imageLoad( "images/giant_abyss.png", loadBG, 1 );

// change status text
    setBanner( [ "We meet again, Dale.",
        "I am here to tell you about the future.",
        "In 30 years the people of",
        "Twin Peaks will be quarantined",
        "in their homes for months.",
        "That is, unless you stop the threat",
        "that was brought upon the Earth",
        "from the Black Lodge.",
        "You must stop the virus! For Laura!" ], 50 );

    // set level control variables
    achievement = 21;
    level = 9;

    // manage arrows
    paintLeftArrow( false );
    paintRightArrow( true );
};

// present level 10 (red room, man from another place)
var initLevel10 = function () {

    //change status text
    if ( achievement == 22 ) {
        setBanner( [ "toohs ot ymene eht no kcilC" ], 45 );
    } else {
        setBanner( [ "Maybe this man knows what's going on..." ] );
    }


    // load and draw red room level
    PS.imageLoad( "images/RedRoom.png", loadBG, 1 );

    PS.audioFade( click_id, 0.04, 0 );

    PS.audioPlay( "redRoom", {
        fileTypes: [ "mp3", "ogg" ],
        path: "./",
        volume: 0.08,
        loop: true
    } );

    // load, create and draw Special Agent Dale Cooper

    var myImage, mySprite;

    PS.imageLoad( "images/cooper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 1, 16 );

        cooperSprite = mySprite;                // Save for using later
    } );

    // load, create and draw the man from another place

    PS.imageLoad( "images/enano.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 25, 20 );

        enanoSprite = mySprite;                // Save for using later
    } );

    // set level control arrows
    level = 10;

    // manage arrows
    paintLeftArrow( false );            // no way back!

    if ( achievement == 22 ) {
        paintRightArrow( true );
    } else {
        paintRightArrow( false );
    }
};

// present level 11 (red room, covid 19)
var initLevel11 = function () {
    //change status text
    PS.statusColor( PS.COLOR_WHITE );
    setBanner( [ "You must defeat the virus!" ] );

    if ( achievement > 22 ) {
        PS.statusColor( PS.COLOR_WHITE );
        setBanner( [ "You must defeat the virus!" ] );
    }

    // load, create and draw Special Agent Dale Cooper
    var myImage, mySprite;

    PS.imageLoad( "images/cooper_gun.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 1, 14 );

        cooperGun = mySprite;                // Save for using later
    } );

    // load, create and draw the virus (coloring beads)

    PS.imageLoad( "images/coronavirus_no_hat.png", loadCovid, 2 );

    // load, create and draw the top with health bars

    PS.imageLoad( "images/health_bars.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 100 );
        PS.spriteMove( mySprite, 0, 0 );

        healthSprite = mySprite;                // Save for using later
    } );

    paintLeftArrow( true );         // activate before recoloring
    paintRightArrow( true );

    // change look
    PS.border( PS.ALL, PS.ALL, 0 );         // remove borders
    PS.gridColor( BLACK );                  // change bg to black
    PS.gridShadow( false );                 // no shadow

    // set level control variables
    level = 11;

};

// manage clicks on left arrow
var clickLeftArrow = function () {

    // nuke sprites from previous levels
    if ( level != 9 && level != 11 ) {           // except on levels 9 and 11...
        PS.spriteDelete( cooperSprite );        // ...Cooper is always there
    }

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
            if ( achievement < 4 ) {     // aquí
                PS.spriteDelete( objectXSprite );
                PS.spriteDelete( hidingSprite );
            }
            break;
        case 4:
            if ( rockSprite != "" ) {
                PS.spriteDelete( rockSprite );
            }
            if ( toiletpaperSprite != "" ) {
                PS.spriteDelete( toiletpaperSprite );
            }
            break;
        case 5:
            PS.spriteDelete( normaSprite );
            PS.spriteDelete( cherrypieSprite );
            if ( peteSprite != "" ) {
                PS.spriteDelete( peteSprite );
            }
            if ( wormsSprite != "" ) {
                PS.spriteDelete( wormsSprite );
            }
            if ( disinfectantSprite != "" ) {
                PS.spriteDelete( disinfectantSprite );
            }
            break;
        case 6:
            PS.spriteDelete( margaretSprite );
            if ( maskSprite != "" ) {
                PS.spriteDelete( maskSprite );
                maskSprite = "";
            }
    }

    // go to previous level
    if ( level != 11 ) {
        if ( achievement < 9 ) {
            level -= 1;
        } else {
            level = 1;
        }
        switch ( level ) {
            case 1:
                initLevel1();
                break;
            case 2:                         // rest of levels unreachable from left arrow
                initLevel2();
        }
    }
};

// manage clicks on right arrow
var clickRightArrow = function () {

    // nuke sprites from previous level
    if ( level != 9 && level != 11 ) {                              // except for level 9...
        PS.spriteDelete( cooperSprite );            // ...Cooper is always there
    }
    switch ( level ) {                              // rest of sprites
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
        case 8:
            if ( openDoorSprite != "" ) {
                PS.spriteDelete( openDoorSprite );
                openDoorSprite = "";
            }
        case 10:
            if ( enanoSprite != "" ) {
                PS.spriteDelete( enanoSprite );
                enanoSprite = "";
            }
    }

// go to next level

    if ( achievement < 9 ) level += 1;
    if ( achievement == 9 ) level = 4;
    if ( achievement == 11 ) level = 5;
    if ( achievement == 13 ) level = 6;
    if ( achievement == 17 ) level = 7;
    if ( achievement == 18 ) level = 8;
    if ( achievement == 20 ) level = 9;
    if ( achievement == 21 ) level = 10;
    if ( achievement == 22 ) level = 11;


    switch ( level ) {
        case 2:                         // level 1 is unreachable from right arrow
            initLevel2();
            break;
        case 3:
            initLevel3();
            break;
        case 4:
            initLevel4();
            break;
        case 5:
            initLevel5();
            break;
        case 6:
            initLevel6();
            break;
        case 7:
            initLevel7();
            break;
        case 8:
            PS.spriteShow( owlAwakeSprite, false );
            initLevel8();
            break;
        case 9:
            initLevel9();
            break;
        case 10:
            initLevel10();
            break;
        case 11:
            initLevel11();
            break;

    }
};

// manage clicks on inventory (briefcase)
var clickInventory = function () {

    var prevStatusText = currentStatusText;     // save status text for later use

    if ( inventory == false ) {                 // when not on inventory screen...

        if ( level != 9 && level != 11 ) {      //Cooper doesn't appear on level 9
            PS.spriteShow( cooperSprite, false );
        }
        switch ( level ) {                      // ...hide current sprites...
            case 1:
                if ( achievement != 8 ) {
                    PS.spriteShow( harrySprite, false );
                    if ( bubbleSprite != "" ) {
                        PS.spriteShow( bubbleSprite, false );
                    }
                    if ( journalSprite != "" ) {
                        PS.spriteShow( journalSprite, false );
                    }
                    if ( congratsSprite != "" ) {
                        PS.spriteShow( congratsSprite, false );
                    }
                    if ( noteSprite != "" ) {
                        PS.spriteShow( noteSprite, false );
                    }
                }
                break;

            case 2:
                PS.spriteShow( lelandSprite, false );
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
                PS.spriteShow( hidingSprite, false );
                if ( objectXSprite != "" ) {
                    PS.spriteShow( objectXSprite, false );
                }
                break;

            case 4:
                if ( rockSprite != "" ) {
                    PS.spriteShow( rockSprite, false );
                }
                PS.spriteShow( toiletpaperSprite, false );
                break;

            case 5:
                PS.spriteShow( normaSprite, false );
                PS.spriteShow( cherrypieSprite, false );
                if ( peteSprite != "" ) {
                    PS.spriteShow( peteSprite, false );
                }
                if ( wormsSprite != "" ) {
                    PS.spriteShow( wormsSprite, false );
                }
                if ( disinfectantSprite != "" ) {
                    PS.spriteShow( disinfectantSprite, false );
                }
                break;

            case 6:
                PS.spriteShow( margaretSprite, false );
                if ( maskSprite != "" ) {
                    PS.spriteShow( maskSprite, false );
                }
                break;

            case 7:
                PS.spriteShow( owlAsleepSprite, false );
                if ( owlAsleepSprite != "" ) {
                    PS.spriteShow( owlAsleepSprite, false );
                }
                if ( owlAwakeSprite != "" ) {
                    PS.spriteShow( owlAwakeSprite, false );
                }
                break;
            case 8:
                //NUEVO
                initCode();
            // no additional sprites in rest of levels
        }
        if ( achievement != 8 ) {
            initInventory();                    // ...and present inventory

            if ( notificationSprite != "" ) {   // remove notification
                PS.spriteDelete( notificationSprite );
                notificationSprite = "";
            }
        }
    } else {                                    // when on inventory screen...

        hideInvSprites();

        switch ( level ) {
            case 1:
                initLevel1();                   // ...launch level...
                // ...and recover sprites
                if ( bubbleSprite != "" ) {
                    PS.spriteShow( bubbleSprite, true );
                }
                if ( journalSprite != "" ) {
                    PS.spriteShow( journalSprite, true );
                }
                if ( congratsSprite != "" ) {
                    PS.spriteShow( congratsSprite, true );
                }
                if ( noteSprite != "" ) {
                    PS.spriteShow( noteSprite, true );
                }
                break;

            case 2:
                initLevel2();

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
                break;

            case 4:
                initLevel4();
                if ( achievement == 11 ) {
                    paintLeftArrow( true );
                }
                if ( rockSprite != "" ) {
                    PS.spriteShow( rockSprite, true );
                }
                break;

            case 5:
                initLevel5();
                if ( achievement == 13 ) {
                    paintLeftArrow( true );
                }
                if ( wormsSprite != "" ) {
                    PS.spriteShow( wormsSprite, true );
                }
                if ( disinfectantSprite != "" ) {
                    PS.spriteShow( disinfectantSprite, true );
                }
                break;

            case 6:
                initLevel6();
                if ( maskSprite != "" ) {
                    PS.spriteShow( maskSprite, true );
                }
                break;

            case 7:
                initLevel7();
                if ( wormsSprite != "" ) {
                    PS.spriteShow( wormsSprite, true );
                }
                break;
            case 8:
                PS.spriteShow( cooperSprite, true );
                if ( achievement == 20 ) {
                    paintRightArrow( true );
                }
            case 10:
                PS.spriteShow( cooperSprite, true );
                if ( achievement == 22 ) {
                    paintRightArrow( true );
                }
        }

        PS.statusText( prevStatusText );        // ...and the status text
        currentStatusText = prevStatusText;

        inventory = false;                        // out of inventory screen
    }
};

// manage clicks on inventory main screen
var clickInventoryScreen = function ( x, y ) {

    if ( ( x > 2 && x < 8 ) && ( y > 9 && y < 15 ) && ( achievement == 4 )
        && ( level == 2 ) ) {                           // click on corn
        hideInvSprites();
        initLevel2();
        objectX = false;                                // Cooper delivers corn
        setBanner( [ "Look! It's the diary! Take it." ] );

        bocadilloDiarioLeland();                        // Leland speaks to Cooper
        achievement = 5;

        inventory = false;

    } else if ( ( x > 9 && x < 15 ) && ( y > 9 && y < 15 ) &&
        ( achievement == 6 ) && ( level == 1 ) ) {      // click on diary
        hideInvSprites();
        achievement = 7;
        initLevel1();
        drawBigNote();
        journal = false;
        inventory = false;

    } else if ( ( x > 23 && x < 30 ) && ( y > 8 && y < 15 )
        && ( achievement == 13 && level == 6 ) ) {                    //click on toilet paper
        hideInvSprites();
        initLevel6();
        achievement = 14;
        inventory = false;
    } else if ( ( x > 2 && x < 8 ) && ( y > 17 && y < 23 )
        && ( achievement == 17 ) ) {                    //click on worms
        hideInvSprites();
        achievement = 18;
        initLevel7();
        paintRightArrow( true );
        inventory = false;
    } else if ( ( x > 10 && x < 14 ) && ( y > 15 && y < 23 ) &&
        ( achievement == 23 ) ) {                       //click on disinfectant
        hideInvSprites();
        inventory = false;
        disinfectant = true;
        if ( mask == true ) {
            achievement = 24;

            if ( cooperDisinfectant != "" ) {
                PS.spriteDelete( cooperDisinfectant );
                cooperDisinfectant = "";
            }

            // draw Cooper with both things

            var myImage, mySprite;

            PS.imageLoad( "images/cooper_both.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 1 );
                PS.spriteMove( mySprite, 1, 14 );

                cooperBoth = mySprite;                  // Save for using later
            } );


            PS.statusColor( PS.COLOR_WHITE );
            setBanner( [ "You must defeat the virus!" ] );

        } else {
            if ( cooperGun != "" ) {
                PS.spriteDelete( cooperGun );
                cooperGun = "";
            }

            // draw Cooper with disinfectant
            var myImage, mySprite;

            PS.imageLoad( "images/cooper_disinfectant.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 1 );
                PS.spriteMove( mySprite, 1, 14 );

                cooperDisinfectant = mySprite;          // Save for using later
            } );

            PS.statusColor( PS.COLOR_WHITE );
            setBanner( [ "You must defeat the virus!" ] );
        }
    } else if ( ( x > 16 && x < 26 ) && ( y > 18 && y < 23 ) &&
        ( achievement == 23 ) ) {                       // click on mask
        hideInvSprites();
        inventory = false;
        mask = true;
        if ( disinfectant == true ) {
            achievement = 24;

            if ( cooperMask != "" ) {
                PS.spriteDelete( cooperMask );
                cooperMask = "";
            }

            // draw Cooper with both things
            var myImage, mySprite;

            PS.imageLoad( "images/cooper_both.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 1 );
                PS.spriteMove( mySprite, 1, 14 );

                cooperBoth = mySprite;                // Save for using later
            } );

            PS.statusColor( PS.COLOR_WHITE );
            setBanner( [ "You must defeat the virus!" ] );
        } else {

            if ( cooperGun != "" ) {
                PS.spriteDelete( cooperGun );
                cooperGun = "";
            }

            // draw Cooper with mask
            var myImage, mySprite;

            PS.imageLoad( "images/cooper_mask.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 1 );
                PS.spriteMove( mySprite, 1, 14 );

                cooperMask = mySprite;                // Save for using later
            } );
            PS.statusColor( PS.COLOR_WHITE );
            setBanner( [ "You must defeat the virus!" ] );
        }

    }
}

// manage clicks on keypad
var clickKeypad = function ( x, y, data ) {
    var x, y, i;

    redrawLetter( attempt, keyColor[ data ] );          // draw letter in key color
    keyData[ data ] = 4;
    redrawKeys();                                       // draw key in gray
    code[ attempt ] = data;
    if ( attempt == 3 ) {
        if ( code[ 0 ] != rightCode[ 0 ] ||
            code[ 1 ] != rightCode[ 1 ] ||
            code[ 2 ] != rightCode[ 2 ] ||
            code[ 3 ] != rightCode[ 3 ] ) {             // if code is not right
            initCode()
            achievement = 19;
            PS.audioPlay( "fx_squawk", {                // click audio feedback
                volume: 0.15
            } );
        } else {                                        // if code is right
            achievement = 20;

            // reactivate all beads
            for ( i = 0; i < 4; i++ ) {
                for ( ( x = posKey[ i ][ 0 ] ); ( x < ( posKey[ i ][ 0 ] + 3 ) ); x++ ) {
                    for ( ( y = posKey[ i ][ 1 ] ); ( y < ( posKey[ i ][ 1 ] + 3 ) ); y++ ) {
                        PS.active( x, y, true );
                    }
                }
            }
            PS.audioPlay( "fx_tada", {                     // tada audio feedback
                volume: 0.15
            } );

            setBanner( [ "You guessed the password!",
                "The door just opened..." ] );

            // load, create and draw open door

            var myImage, mySprite;

            PS.imageLoad( "images/door_open.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 1 );
                PS.spriteMove( mySprite, 21, 11 );


                openDoorSprite = mySprite;                // Save for using later
            } );


            paintRightArrow( true );                // go ahead
        }
    } else {
        attempt = attempt + 1;                              // new attempt
    }
};

// manage clicks on level 1 (sheriff station)
var clickLevel1 = function ( x, y ) {

    if ( ( achievement == 8 ) && ( y > 6 ) ) {                   // click on big note

        var xIn, yIn;                  // re-active inventory after Big Note
        for ( xIn = 0; xIn < 27; xIn++ ) {
            for ( yIn = 0; yIn < 7; yIn++ ) {
                PS.active( xIn, yIn, 1 );
            }
        }

        PS.spriteDelete( bigNoteSprite );
        achievement = 9;

        // change status text
        setBanner( [ "Here, agent, your next assignment.",
            "Figure out what is going on with this." ] );

        paintRightArrow( true );

    } else {
        if ( ( x > 25 && x < 31 ) && ( y > 17 && y < 31 ) )    // click on Harry
        {

            if ( achievement < 6 ) {            // not get diary yet
                bocadilloDiarioHarry();         // Harry speaks to Cooper
                if ( achievement == 0 ) {
                    achievement = 1;
                }

                // change status text
                setBanner( [ "You’re finally here, Agent Cooper.",
                    "We’ve been expecting you.",
                    "As you know, our dear town sweetheart",
                    "Laura Palmer sadly passed away at 16.",
                    "Tragic, I know. No one has any clue",
                    " as to why, or how this happened.",
                    "I guess it’s up to us to find out.",
                    "Say, why don’t you try to talk",
                    "to the girl’s parents.",
                    "Apparently, the girl kept a diary.",
                    "Bring that back to me as soon as possible." ], 50 );

            } else if ( achievement == 11 ) {
                // change status text
                setBanner( [ "You're telling me you made a rock",
                    "disappear? And you found what?",
                    "A roll of toilet paper... ",
                    "I think we're going to need some help.",
                    "Let me think about it. In the meantime,",
                    "why don't you take a break.",
                    "Go to the diner, eat some cherry pie,",
                    "and talk to the locals!" ], 50 );
                ach11b = true;
                paintRightArrow( true );

            } else if ( achievement == 13 ) {
                // change status text
                setBanner( [ "Awesome pie, huh?",
                    "I finally figured out who to talk to.",
                    "Our close friend Margaret,",
                    "we call her the Log Lady.",
                    "You'll see why... Go check up on her.",
                    "She might be able to help out with the case." ], 50 );
                ach13b = true;
                paintRightArrow( true );

            } else if ( achievement == 16 ) {

                // change status text
                setBanner( [ "Yes, Coop, I know she’s odd, but trust me,",
                    "she’s helped us solve many cases before.",
                    "She said something about owls?",
                    "Why don’t you go on up to the forest",
                    "and see if you can find any?" ], 50 );
                paintRightArrow( true );
                achievement = 17;
            }
        } else if ( ( x > 20 && x < 26 ) && ( y > 21 && y < 27 )
            && ( achievement == 7 ) ) { //click on the note

            // move note to inventory
            PS.spriteDelete( noteSprite );
            noteSprite = "";

            // notify new item in inventory
            var mySprite;
            mySprite = PS.spriteSolid( 2, 2 );
            PS.spriteSolidColor( mySprite, PS.COLOR_RED );
            PS.spriteMove( mySprite, 20, 0 );
            notificationSprite = mySprite;

            // change status text
            setBanner( [ "You collected the note!" ] );

            // load, create and draw big note

            var myImage, mySprite;

            PS.imageLoad( "images/notebig.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 7 );
                PS.spriteMove( mySprite, 0, 7 );

                bigNoteSprite = mySprite;                // Save for using later
            } );
            achievement = 8;

            var xIn, yIn;                  // inventory inactive when Big Note on screen
            for ( xIn = 0; xIn < 27; xIn++ ) {
                for ( yIn = 0; yIn < 7; yIn++ ) {
                    PS.active( xIn, yIn, 0 );
                }
            }

        }
    }
};

// manage clicks on level 2 (palmers' home)
var clickLevel2 = function ( x, y ) {

    if ( ( x > 19 && x < 25 ) &&        // if click on diary...
        ( y > 18 && y < 24 ) &&
        ( achievement == 5 ) ) {        //...and Leland offered diary

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
        setBanner( [ "You collected the diary!" ] );

        achievement = 6                 // picked up diary
    }

    if ( ( x > 25 && x < 31 ) && ( y > 17 && y < 31 ) )     // if click on Leland
    {

        if ( achievement < 4 ) { // Coop didn't get the corn yet

            // change status text
            setBanner( [ "Ah… Are you that FBI agent?",
                "Yeah, Harry told me to expect a visit.",
                "I’m Leland Palmer. Laura’s father, yes.",
                "The diary? I’ve heard of it.",
                "I might be able to find it.",
                "Now that I think about it,",
                "why would I just give it to you",
                "for nothing in exchange…",
                "How ‘bout you try and find me",
                "a can of creamed corn",
                "I lost on the street the other day?",
                "Then maybe we’ll talk." ], 50 );

            bocadilloCruzLeland();      // Leland says no
            if ( achievement < 2 )
                achievement = 2;

        }
    }
};

// manage clicks on level 3 (outside of diner)
var clickLevel3 = function ( x, y ) {

    if ( achievement == 3 ) {           // if corn fully visible
        if ( ( x > ( xobjX - 1 ) &&     // if click on corn
            x < ( xobjX + 5 ) ) &&
            ( y > ( yobjX - 1 ) &&
                y < ( yobjX + 5 ) ) ) {

            // move corn to inventory
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
            setBanner( [ "Good job!",
                "You found Leland's creamed corn!" ] );

            achievement = 4;
        }
    }

    if ( achievement == 2 ) {           // if corn not fully revealed

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
};

// manage clicks on level 4 (outdoor rock area)
var clickLevel4 = function ( x, y ) {

    // implement the rock clicking mechanic

    if ( ( x > 8 ) && ( x < 29 ) && ( y > 13 ) ) {
        if ( ( x > 14 ) && ( x < 21 ) && ( y > 25 ) ) {  // click on rock
            if ( !rockDone ) {
                if ( rockState < 8 ) {
                    rockState = rockState + 1;
                    PS.spriteDelete( rockSprite );
                    PS.imageLoad( rockFiles[ rockState ], function ( data ) {

                        textEnd = false;                  // avoid uncontroled clicks

                        myImage = data; // save image ID

                        // Create an image sprite from the loaded image
                        // Save sprite ID for later reference

                        mySprite = PS.spriteImage( myImage );

                        PS.spritePlane( mySprite, 5 );
                        PS.spriteMove( mySprite, 9, 15 );

                        rockSprite = mySprite;      // Save for using later

                        textEnd = true;
                    } );

                } else if ( rockState > 7 ) {       // toilet paper revealed
                    rockDone = true;
                    achievement = 10;

                    // change status text
                    setBanner( [ "A roll of toilet paper? That's strange..." ] );

                    PS.spriteDelete( rockSprite );
                    rockSprite = "";
                }

            } else {                                 // if toilet paper collected

                achievement = 11;
                PS.spriteShow( toiletpaperSprite, false );

                // change status text
                setBanner( [ "You've collected the toilet paper!" ] );

                // notify new item in inventory
                var mySprite;
                mySprite = PS.spriteSolid( 2, 2 );
                PS.spriteSolidColor( mySprite, PS.COLOR_RED );
                PS.spriteMove( mySprite, 20, 0 );
                notificationSprite = mySprite;

                paintLeftArrow( true );

            }
        } else if ( !rockDone ) {
            if ( rockState < 8 ) {
                rockState = rockState + 1;
                PS.spriteDelete( rockSprite );
                PS.imageLoad( rockFiles[ rockState ], function ( data ) {
                    myImage = data; // save image ID

                    // Create an image sprite from the loaded image
                    // Save sprite ID for later reference

                    mySprite = PS.spriteImage( myImage );

                    PS.spritePlane( mySprite, 5 );
                    PS.spriteMove( mySprite, 9, 15 );

                    rockSprite = mySprite;                 // Save for using later
                } );

            } else if ( rockState > 7 ) {           // toilet paper revealed
                rockDone = true;

                // change status text
                setBanner( [ "A roll of toilet paper? That's strange..." ] );
            }
        }
    }
};

// manage clicks on level 5 (diner)
var clickLevel5 = function ( x, y ) {

    if ( ( ( x > 6 ) && ( x < 13 ) ) && ( ( y > 14 ) &&
        ( y < 19 ) ) ) {                                    // on cherry pie
        // implement the eating cherry pie mechanic
        if ( cherryState < 4 ) {
            PS.spriteDelete( cherrypieSprite );
            cherryState = cherryState + 1;
            PS.imageLoad( pieFiles[ cherryState ], function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 1 );
                PS.spriteMove( mySprite, 7, 15 );

                cherrypieSprite = mySprite;                 // Save for using later
            } );
        }
    } else if ( ( ( ( x > 24 ) && ( x < 30 ) ) && ( ( y > 13 ) &&
        ( y < 29 ) ) ) ) {                                      // on character

        if ( ( achievement == 11 ) && ( !offeredWorms ) ) {     // on Pete

            // change status text
            setBanner( [ "Ah yes, you’re the FBI agent!",
                "So happy to meet you,",
                "my name’s Pete Martell.",
                "I heard about the girl indeed,",
                "I was the very one to find her!",
                " Oh I was so upset.",
                "I’d just caught a giant sturgeon too.",
                " Here, have some bait.",
                "In case you ever want to grab a rod",
                "and hop on out to the waters of Twin Peaks." ], 50 );

            offeredWorms = true;
            // load and draws worms sprite
            PS.imageLoad( "images/worms.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 1 );
                PS.spriteMove( mySprite, 16, 15 );

                wormsSprite = mySprite;                 // Save for using later
            } );

        } else if ( ( achievement == 12 ) && ( !offeredDisinf ) ) {  // on Norma

            // change status text
            setBanner( [ "I heard on the news the other day there’s",
                "a really bizarre bug going around, and that",
                "it’s important to keep everything clean.",
                "Hey, that might’ve been fake, but take some",
                "disinfectant with you in case you ever need it." ], 50 );

            offeredDisinf = true;
            // load and draw disinfectant sprite
            PS.imageLoad( "images/disinfectant.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 1 );
                PS.spriteMove( mySprite, 18, 20 );

                disinfectantSprite = mySprite;                 // Save for using later
            } );
        }
    } else if ( ( ( x > 15 ) && ( x < 21 ) ) && ( ( y > 14 ) &&
        ( y < 20 ) ) ) {                                        // on worms
        if ( ( achievement == 11 ) && ( offeredWorms ) ) {
            // change status text
            setBanner( [ "Hi, Agent Cooper.",
                "I’m Norma, I own the Double R.",
                "Yes, the passing of Laura has ",
                "been so tragic. Such a sweet girl.",
                "Used to help me with Meals on Wheels too!" ] );

            achievement = 12;
            PS.spriteDelete( wormsSprite );
            wormsSprite = "";
            PS.spriteDelete( peteSprite );
            peteSprite = "";

            // notify new item in inventory
            var mySprite;
            mySprite = PS.spriteSolid( 2, 2 );
            PS.spriteSolidColor( mySprite, PS.COLOR_RED );
            PS.spriteMove( mySprite, 20, 0 );
            notificationSprite = mySprite;
        }
        ;
    } else if ( ( ( x > 17 ) && ( x < 21 ) ) && ( ( y > 19 )
        && ( y < 27 ) ) ) {                                     // on disinfectant
        if ( ( achievement == 12 ) && ( offeredDisinf ) ) {
            achievement = 13;
            PS.spriteDelete( disinfectantSprite );
            disinfectantSprite = "";

            // notify new item in inventory
            var mySprite;
            mySprite = PS.spriteSolid( 2, 2 );
            PS.spriteSolidColor( mySprite, PS.COLOR_RED );
            PS.spriteMove( mySprite, 20, 0 );
            notificationSprite = mySprite;

            // change status text
            setBanner( [ "You got some disinfectant and worms!" ] );

            //activate exit arrow
            paintLeftArrow( true );
        }
    }
};

// manage clicks on level 6 (log lady's home)
var clickLevel6 = function ( x, y ) {

    var myImage, mySprite;

    if ( ( x > 23 && x < 31 ) && ( y > 16 && y < 32 ) ) {  // on Margaret

        if ( achievement == 14 ) {

            // change status text
            setBanner( [ "Thank you, I’ve been looking for that.",
                "Here, take this.",
                "It might serve you well later." ] );
            offeredMask = true;

            // load and draw mask
            PS.imageLoad( "images/mask.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 5 );
                PS.spriteMove( mySprite, 12, 20 );

                maskSprite = mySprite;        // Save for using later
            } );
        } else if ( achievement == 15 || achievement == 16 ) {
            if ( !readyForCode ) {

                // change status text
                setBanner( [ "Now, onto what I was saying…",
                    "you must remember the owls.",
                    "You must also remember the following...",
                    "Click Margaret when you're ready" ], 50 );
                readyForCode = true;

            } else {                    // display code

                textEnd = false;
                paintCode( mapCodeN, RED );
                setTimeout( paintCode, 2500, mapCodeC, BLUE );
                setTimeout( paintCode, 5000, mapCode1, GREEN );
                setTimeout( paintCode, 7500, mapCode9, VIOLET );
                setTimeout( function () {
                    paintCode( mapCode9, 0xFFF3D6 );
                    paintLeftArrow( true );
                    PS.gridShadow( true, PS.COLOR_WHITE );
                    achievement = 16;
                    setBanner( [ "Click Margaret to see this again,",
                        "or go back to the Sheriff station." ] );
                }, 10000 );
                setTimeout( function () {
                    textEnd = true;
                }, 12500 );
            }

        } else {                            // first time on level
            // change status text
            setBanner( [ "Hi Cooper.",
                "You might be wondering why you’re here.",
                "Well my log tells me there are a few",
                "very important things I need to tell you.",
                "What? You have something for me?" ], 45 );
        }
    }
    if ( ( x > 11 && x < 20 ) && ( y > 19 && y < 24 ) &&
        ( inventory == false ) ) {                  // click on mask
        if ( maskSprite != "" ) {
            // move mask to inventory
            PS.spriteDelete( maskSprite );
            maskSprite = "";

            // notify new item in inventory
            var mySprite;
            mySprite = PS.spriteSolid( 2, 2 );
            PS.spriteSolidColor( mySprite, PS.COLOR_RED );
            PS.spriteMove( mySprite, 20, 0 );
            notificationSprite = mySprite;

            // change status text
            setBanner( [ "You collected the mask!",
                "Talk to Margaret again" ] );

            achievement = 15; // picked up mask
        }
    }
};

//manage clicks on level 8 (keypad puzzle)
var clickLevel8 = function ( x, y ) {
    // clicks on level 8 are managed by data

    //    if ( ( x > 21 ) && ( x < 29 ) && ( y > 11 ) && ( y < 28 )) {  // click on door
    //    }
};

//manage clicks on level 10 (red room, man from another place)
var clickLevel10 = function ( x, y ) {

    if ( ( x > 24 ) && ( x < 31 ) && ( y > 16 ) && ( y < 27 ) ) {
        setBanner( [ "repooC olleH",
            "toohs ot ymene eht no kcilC" ], 45 );
        achievement = 22;
        paintRightArrow( true );
    }
};

// manage clicks on level 11 (fighting the coronavirus)
var clickLevel11 = function ( x, y ) {

    //textEnd = false;                              // avoid uncontrolled clicks

    if ( achievement != 23 ) {
        //zone 1
        if ( ( ( x == 18 && y == 11 ) | ( x == 16 && y == 13 ) | ( x == 19 &&
            ( y == 12 | y == 13 ) ) | ( x == 18 && y == 13 ) ) && zone01 ) {
            PS.alpha( 18, 11, 0 );              // zone 1 disappears
            PS.alpha( 16, 13, 0 );
            PS.alpha( 19, 12, 0 );
            PS.alpha( 19, 13, 0 );
            PS.alpha( 18, 13, 0 );

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.05
            } );

            zonasMuertas++;                     // one more dead zone
            zone01 = false;                     // zone 01 no longer active
        }

        //zone 2
        if ( ( ( x == 20 | x == 21 | x == 22 ) &&
            ( y == 12 | y == 13 | y == 14 ) ) && zone02 ) {
            var i;
            var j;
            for ( i = 20; i < 23; i++ ) {
                for ( j = 12; j < 15; j++ ) {
                    PS.alpha( i, j, 0 );
                }
            }

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone02 = false;
        }

        //zone 3
        if ( ( ( x == 24 && y == 11 ) | ( x == 23 && ( y == 12 | y == 13 ) ) |
            ( x == 24 && y == 13 ) | ( x == 26 & y == 13 ) ) && zone03 ) {
            PS.alpha( 24, 11, 0 );
            PS.alpha( 23, 12, 0 );
            PS.alpha( 23, 13, 0 );
            PS.alpha( 24, 13, 0 );
            PS.alpha( 26, 13, 0 );

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone03 = false;
        }

        //zone 4
        if ( ( ( x == 17 | x == 18 | x == 19 ) &&
            ( y == 14 | y == 15 | y == 16 ) ) && zone04 ) {
            var i;
            var j;
            for ( i = 17; i < 20; i++ ) {
                for ( j = 14; j < 17; j++ ) {
                    PS.alpha( i, j, 0 );
                }
            }

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone04 = false;
        }

        //zone 5
        if ( ( ( x == 20 | x == 21 | x == 22 ) &&
            ( y == 15 | y == 16 ) ) && zone05 ) {
            var i;
            var j;
            for ( i = 20; i < 23; i++ ) {
                for ( j = 15; j < 17; j++ ) {
                    PS.alpha( i, j, 0 );
                }
            }

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone05 = false;
        }

        //zone 6
        if ( ( ( x == 20 | x == 21 | x == 22 ) &&
            ( y == 17 | y == 18 ) ) && zone06 ) {
            var i;
            var j;
            for ( i = 20; i < 23; i++ ) {
                for ( j = 17; j < 19; j++ ) {
                    PS.alpha( i, j, 0 );
                }
            }

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone06 = false;
        }

        //zone 7
        if ( ( ( x == 23 | x == 24 | x == 25 ) &&
            ( y == 14 | y == 15 | y == 16 ) ) && zone07 ) {
            var i;
            var j;
            for ( i = 23; i < 26; i++ ) {
                for ( j = 14; j < 17; j++ ) {
                    PS.alpha( i, j, 0 );
                }
            }

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone07 = false;
        }

        //zone 8
        if ( ( ( x == 15 && y == 15 ) | ( x == 16 && y == 16 ) |
            ( x == 16 && y == 17 ) | ( x == 15 && y == 18 ) ) && zone08 ) {
            PS.alpha( 15, 15, 0 );
            PS.alpha( 16, 16, 0 );
            PS.alpha( 16, 17, 0 );
            PS.alpha( 15, 18, 0 );

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone08 = false;
        }

        //zone 9
        if ( ( ( x == 17 | x == 18 | x == 19 ) &&
            ( y == 17 | y == 18 | y == 19 ) ) && zone09 ) {
            var i;
            var j;
            for ( i = 17; i < 20; i++ ) {
                for ( j = 17; j < 20; j++ ) {
                    PS.alpha( i, j, 0 );
                }
            }

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone09 = false;
        }

        // zone 10
        if ( ( ( x == 23 | x == 24 | x == 25 ) &&
            ( y == 17 | y == 18 | y == 19 ) ) && zone10 ) {
            var i;
            var j;
            for ( i = 23; i < 26; i++ ) {
                for ( j = 17; j < 20; j++ ) {
                    PS.alpha( i, j, 0 );
                }
            }

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone10 = false;
        }

        //zone 11
        if ( ( ( x == 26 && ( y == 16 | y == 17 ) ) |
            ( x == 27 && ( y == 15 | y == 18 ) ) ) && zone11 ) {
            PS.alpha( 26, 16, 0 );
            PS.alpha( 26, 17, 0 );
            PS.alpha( 27, 15, 0 );
            PS.alpha( 27, 18, 0 );

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone11 = false;
        }

        //zone 12
        if ( ( ( y == 20 && ( x == 16 | x == 18 | x == 19 ) ) |
            ( x == 19 && y == 21 ) | ( x == 18 && y == 22 ) ) && zone12 ) {
            PS.alpha( 16, 20, 0 );
            PS.alpha( 18, 20, 0 );
            PS.alpha( 19, 20, 0 );
            PS.alpha( 19, 21, 0 );
            PS.alpha( 18, 22, 0 );

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone12 = false;
        }

        //zone 13
        if ( ( ( x == 20 | x == 21 | x == 22 ) &&
            ( y == 19 | y == 20 | y == 21 ) ) && zone13 ) {
            var i;
            var j;
            for ( i = 20; i < 23; i++ ) {
                for ( j = 19; j < 22; j++ ) {
                    PS.alpha( i, j, 0 );
                }
            }

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone13 = false;
        }

        //zone 14
        if ( ( ( y == 20 && ( x == 23 | x == 24 | x == 26 ) ) |
            ( x == 23 && y == 21 ) | ( x == 24 && y == 22 ) ) && zone14 ) {
            PS.alpha( 23, 20, 0 );
            PS.alpha( 24, 20, 0 );
            PS.alpha( 26, 20, 0 );
            PS.alpha( 23, 21, 0 );
            PS.alpha( 24, 22, 0 );

            //play shooting sound
            PS.audioPlay( "fx_shoot4", {
                volume: 0.15
            } );

            zonasMuertas++;
            zone14 = false;
        }

        // health bar management
        if ( zonasMuertas > 4 ) {
            var i;
            for ( i = 14; i < 27; i++ ) {
                var mySprite;
                mySprite = PS.spriteSolid( 1, 1 );
                PS.spriteSolidColor( mySprite, PS.COLOR_ORANGE );
                PS.spriteMove( mySprite, i, 3 );
                PS.spritePlane( mySprite, 200 );
            }
        }

        if ( zonasMuertas > 9 ) {
            var i;
            for ( i = 14; i < 27; i++ ) {
                var mySprite;
                mySprite = PS.spriteSolid( 1, 1 );
                PS.spriteSolidColor( mySprite, PS.COLOR_RED );
                PS.spriteMove( mySprite, i, 3 );
                PS.spritePlane( mySprite, 200 );
            }
        }

        if ( zonasMuertas < 15 ) {
            var i;
            for ( i = 0; i < zonasMuertas; i++ ) {
                var mySprite;
                mySprite = PS.spriteSolid( 1, 1 );
                PS.spriteSolidColor( mySprite, PS.COLOR_YELLOW );
                PS.spriteMove( mySprite, ( 27 - i ), 3 );
                PS.spritePlane( mySprite, 300 );
            }
        }

        if ( zonasMuertas == 10 && achievement != 24 ) {             // half way thru
            achievement = 23;
        } else if ( zonasMuertas == 14 ) {      // covid killed
            achievement == 25;
            // activate beads to recolor
            paintRightArrow( true );
            paintLeftArrow( true );
            PS.spriteShow( healthSprite, false );
            var myImage, mySprite;

            PS.imageLoad( "images/grand_finale.png", function ( data ) {
                myImage = data; // save image ID

                // Create an image sprite from the loaded image
                // Save sprite ID for later reference

                mySprite = PS.spriteImage( myImage );

                PS.spritePlane( mySprite, 400 );
                PS.spriteMove( mySprite, 0, 0 );

                grandFinaleSprite = mySprite;
            } );

            PS.statusColor( PS.COLOR_WHITE );
            setBanner( [ "You did it, Agent Cooper!",
                "You saved the town of Twin Peaks",
                "from the threat of the coronavirus.",
                "Good job!" ], 50 );
        }
    } else if ( achievement == 23 ) {           // need something else...
        falseTries++;

        if ( falseTries > 4 ) {
            PS.statusColor( PS.COLOR_WHITE );
            setBanner( [ "Remember the owl's advice..." ] );
        }
    }

    /*
        setTimeout( function () {
        textEnd = true;
    }, 2000 );
     */


};

// SHUTDOWN MANAGEMENT
PS.shutdown = function ( options ) {
    //DB.send();            // inactive while on dev
};

// GAME INITIALIZATION
PS.init = function ( system, options ) {

    // set text status
    setBanner( [ "Talk to Sheriff Truman" ] );

    var loader = function ( data ) {
        click_id = data.channel;
    }

    // load the background music
    PS.audioLoad( "twin_peaks_8_bit", {
        fileTypes: [ "mp3", "ogg" ],
        path: "./",
        volume: 0.04,
        loop: true,
        onLoad: loader,
        autoplay: true
    } );

    // load the red room music
    PS.audioLoad( "redRoom", {
        fileTypes: [ "mp3", "ogg" ],
        path: "./",
        volume: 0.04,
        loop: true,
        // onLoad: loader
    } );

    // Start the timers function for Coopers movement
    // Run at 20 frames/sec (every 3 ticks)
    PS.timerStart( 3, tick );

    // Start the timers function for banner display
    // Run twice every tenth second (every 3 ticks)
    PS.timerStart( 3, tickBanner );

    PS.audioLoad( "fx_tada" );          // preload end of game sound
    //JGR
    PS.audioLoad( "fx_click" );           // preload click audio feedback
    PS.audioLoad( "fx_ding" );            // preload ding sound
    PS.audioLoad( "farewell_theme", {
        path: "./",
        fileTypes: [ "ogg", "mp3" ]
    } );                                    //preload end music

    // load and draw the screen top background
    PS.imageLoad( "images/flechas_y_maletin.png", loadScreentop, 1 );
    //};                  // close 'complete' - inactive while on dev

    // set the grid and draw separator between top and main screen zones
    PS.gridSize( WIDTH, HEIGHT );
    PS.border( PS.ALL, PS.ALL, 0 );     // no border...
    PS.border( PS.ALL, 6, {             // ...except for the separation
        top: 0,                         //    between screen areas
        left: 0,
        bottom: 6,
        right: 0
    } );
    PS.borderColor( PS.ALL, 6, PS.COLOR_WHITE );

    // set all beads data to 999
    var x, y;
    for ( x = 0; x < 32; x++ ) {
        for ( y = 0; y < 32; y++ ) {
            PS.data( x, y, 999 );
        }
    }

    // present level 1
    initLevel1();
};

// POINT-AND-CLICK HANDLING
PS.touch = function ( x, y, data, options ) {

    /*
    PS.debug( "\nClick on x =" + x + ", y = " + y +
        "\nData = " + data +
        "\nLevel = " + level +
        "\nAchievement = " + achievement +
        "\n\n" );
    */

    if ( textEnd ) {

        PS.audioPlay( "fx_click", {                     // click audio feedback
            volume: 0.15
        } );

        if ( level == 11 && achievement == 23 &&
            ( ( x < 12 && x > 4 ) && y < 7 ) ) {                     // CLICK ON INV (LEVEL 11)
            clickInventory();
        }

        if ( data == 0 || data == 1 || data == 2 || data == 3 ) {  // CLICK ON KEYPAD
            clickKeypad( x, y, data );
        }

        if ( ( x > 26 ) && ( y < 7 ) && ( level != 11 ) ) {                // CLICK ON RIGHT ARROW
            clickRightArrow();

        } else if ( ( x < 5 ) && ( y < 7 ) && ( level != 11 ) ) {          // CLICK ON LEFT ARROW
            clickLeftArrow();

        } else if ( ( x > 11 && x < 20 ) &&             // CLICK ON INVENTORY
            ( y < 7 ) && !( level == 9 ) && !( level == 11 ) ) {
            clickInventory();

        } else {                                        // CLICK ON MAIN SCREEN
            if ( inventory ) {
                clickInventoryScreen( x, y );
            } else {

                switch ( level ) {
                    case 1:                                 // when on level 1
                        clickLevel1( x, y );
                        break;

                    case 2:                                 // when on level 2
                        clickLevel2( x, y );
                        break;

                    case 3:                                 // when on level 3
                        clickLevel3( x, y );
                        break;

                    case 4:
                        clickLevel4( x, y );                // when on level 4
                        break;

                    case 5:                                 // when on level 5
                        clickLevel5( x, y );
                        break;

                    case 6:                                 // when on level 3
                        clickLevel6( x, y );
                        break;

                    case 8:                                 // when on level 8
                        clickLevel8( x, y );
                        break;

                    case 10 :                               // when on level 10
                        clickLevel10( x, y );
                        break;

                    case 11:
                        clickLevel11( x, y );
                }
            }
        }
    }
};

// HOVERING OVER ITEMS HANDLING
PS.enter = function ( x, y ) {
    if ( inventory ) {
        if ( ( x > 9 && x < 15 ) && ( y > 9 && y < 15 ) ) {
            if ( journal ) {
                PS.statusText( "Diary" );
            } else {
                PS.statusText( "???" );
            }

        } else if ( ( x > 2 && x < 8 ) && ( y > 9 && y < 15 ) ) {
            if ( achievement == 4 ) {
                PS.statusText( "Creamed corn" );
            } else {
                PS.statusText( "???" );
            }
        } else if ( ( x > 23 && x < 30 ) && ( y > 8 && y < 15 ) ) {
            if ( achievement > 10 && achievement < 14 ) {
                PS.statusText( "Toilet paper" );
            } else {
                PS.statusText( "???" );
            }
        } else if ( ( x > 2 && x < 8 ) && ( y > 17 && y < 23 ) ) {
            if ( achievement > 11 && achievement < 18 ) {
                PS.statusText( "Worms" );
            } else {
                PS.statusText( "???" );
            }
        } else if ( ( x > 10 && x < 14 ) && ( y > 15 && y < 23 ) ) {
            if ( achievement > 12 ) {
                PS.statusText( "Disinfectant" );
            } else {
                PS.statusText( "???" );
            }
        } else if ( ( x > 16 && x < 26 ) && ( y > 18 && y < 23 ) ) {
            if ( achievement > 14 ) {
                PS.statusText( "Mask" );
            } else {
                PS.statusText( "???" );
            }
        } else if ( ( x > 16 && x < 22 ) && ( y > 9 && y < 15 ) ) {
            if ( achievement > 8 && achievement < 11 ) {
                PS.statusText( "Note" );
            } else {
                PS.statusText( "???" );
            }
        }
    }
};

PS.exit = function ( x, y ) {
    if ( inventory ) {
        PS.statusText( "Welcome to your inventory!" );
    }
};