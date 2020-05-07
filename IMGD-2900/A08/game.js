/*
      +++++  WRAPPED IN PLASTIC  +++++
      Prototype #2   -   Final version
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


// GLOBAL VARIABLES
var click_id = "";                  // saves channel ID
var level = 1;                      // level tracker
var inventory = false;              // in inventory?
var journal = false;                // Cooper has diary
var objectX = false;                // Cooper has Leland's wallet
var hidingObjOpacity = 255;         // opacity of the sprite hiding wallet
var lelandOfferedJournal = false;   // has Leland offered the diary to Harry?
var gameDone = false;               // end of game
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
var ach11b = false, ach13b = false;
var cherryState = 0;
var offeredWorms = false;
var offeredDisinf = false;
var pieFiles = [ "images/cherrypie1.png", "images/cherrypie2.png", "images/cherrypie3.png",
    "images/cherrypie4.png", "images/cherrypie5.png" ];
var rockState = 0;
var rockFiles = [ "images/rock.png", "images/rock2.png", "images/rock3.png", "images/rock4.png",
    "images/rock5.png", "images/rock6.png", "images/rock7.png", "images/rock8.png", "images/rock9.png" ]
var rockDone = false;
var readyForCode = false;

// sprite declarations
var bubbleSprite = "", crossSprite = "", congratsSprite = "";
var cherrypieSprite = "", hidingSprite = "", rockSprite = "", bigNoteSprite = "";
var notificationSprite = "";
var cooperSprite = "", harrySprite = "", lelandSprite = "", peteSprite = "", normaSprite = "", margaretSprite = "";
var objectXSprite = "", objectXInvSprite = "", objectXBWSprite = "";
var journalSprite = "", journalInvSprite = "", journalBWSprite = "";
var noteSprite = "", noteInvSprite = "", noteBWSprite = "";
var toiletpaperSprite = "", toiletPaperInvSprite = "", toiletpaperBWSprite = "";
var wormsSprite = "", wormsInvSprite = "", wormsBWSprite = "";
var disinfectantSprite = "", disinfectantInvSprite = "", disinfectantBWSprite = "";
var maskSprite = "", maskInvSprite = "", maskBWSprite = "";


var xCoop = 1, yCoop = 18;          // Coop's position
// wallet's random position
var xobjX, yobjX = 27, rdn;
rnd = PS.random( 11 );
xobjX = ( 9 + rnd );
var currentStatusText;              // text in the status box

// for timers' use
var path = null;                    // path to follow, null if none
var step = 0;                       // current step on path
var banner = [ null ];              // banner to display, null if none
var text = "";                      // intermediate text
var stepBanner = [ 0 ];             // current step on banner
var i = 0;
var delayBanner = [ 0 ];
var textEnd = true;

// character maps for the code
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
    0, 0, 0, 1 ];


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

// draw and activate/deactivate right arrow
var paintRightArrow = function ( activate ) {

    var x, y;

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

        for ( x = 27; x < 32; x++ ) {
            for ( y = 0; y < 7; y++ ) {
                PS.active( x, y, 0 );
            }
        }
    } else {
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

        for ( x = 0; x < 5; x++ ) {
            for ( y = 0; y < 7; y++ ) {
                PS.active( x, y, 0 );
            }
        }

    } else {
        // JGR
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
        PS.spriteMove( mySprite, 20, 19 );

        noteSprite = mySprite;        // Save for using later
        //lelandOfferedJournal = true;
    } );
};

// paint characters when revealing the code
var paintCode = function ( mapCode, colorCode ) {
    var x, y;

    PS.gridShadow( true, colorCode );

    for ( y = 0; y < 5; y++ ) {
        for ( x = 0; x < 4; x++ ) {
            if ( mapCode[ x + ( y * 4 ) ] == 1 )
                PS.color( x + 26, y + 12, colorCode );
            else
                PS.color( x + 26, y + 12, 0xFFF3D6 );
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

        if ( xCoop == 16 ) {
            hidingObjOpacity = hidingObjOpacity - 64;
            PS.spriteSolidAlpha( hidingSprite, hidingObjOpacity );
        }

        if ( hidingObjOpacity < 2 ) {
            setBanner( [ "Grab the creamed corn!" ] );
            achievement = 3;            // wallet revealed
        }
        step += 1;                      // point to next step

        // If no more steps, nuke path
        if ( step >= path.length ) {
            path = null;
        }
    }
};

// format text to progressively display it in the status box
var setBanner = function ( data ) {
    PS.statusText( "" );
    i = 0;
    text = "";
    stepBanner = [];
    delayBanner = [];
    var j;
    for ( j = 0; j < data.length; j += 1 ) {
        stepBanner[ j ] = 0;
        delayBanner[ j ] = 0;
    }
    banner = data;
    currentStatusText = data[ 0 ];
};

// timer function for banner display, called every ***** sec
var tickBanner = function () {

    var c = "";
    var bannerTemp;

    if ( banner[ i ] ) {                       // path ready (not null)?
        textEnd = false;
        bannerTemp = banner[ i ];

        if ( stepBanner[ i ] < bannerTemp.length ) {
            // Get next character in banner
            c = bannerTemp[ stepBanner[ i ] ];
            text = text + c;

            // display text
            PS.statusText( text );

            // el sonido del click estaba aquí...

            stepBanner[ i ] += 1;               // point to next step
        }

        // If no more steps, nuke banner and text
        else if ( delayBanner[ i ] >= 40 ) {
            PS.audioPlay( "fx_blip", {         // blip end-of-text audio feedback
                volume: 0.15
            } );
            banner[ i ] = null;
            text = "";
            //PS.statusText( "" );
            i += 1;
            textEnd = true;
        }

        // ... y lo pongo aquí

        /*
        if ( delayBanner[ i ] % 8 == 0 ) {
            PS.audioPlay( "fx_click", {          // click audio feedback
                volume: 0.15
            } );
        }
         */

        delayBanner[ i ] += 1;
    }
};

// deactivate the whole grid (kept for use in future versions)
var deactivateGrid = function () {

    var x, y;
    for ( y = 0; y < 32; y += 1 ) {
        for ( x = 0; x < 32; x += 1 ) {
            PS.active( x, y, 0 );
        }
    }
};

// hide inventory sprites when closing inventory
var hideInvSprites = function () {
    if ( journalBWSprite != "" ) {  // ...recover the corresponding
        // sprites...
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

        // only visible if Coop's got the wallet in his inventory
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
        if ( ( achievement > 11 ) && ( achievement < 17 ) ) {
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
        if ( achievement > 12 ) {
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

        //only visible if Coop's got the disinfectant in his inventory
        if ( achievement > 14 ) {
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

        //only visible if Coop's got the disinfectant in his inventory
        if ( achievement > 8 ) {
            PS.spriteShow( noteInvSprite, true );
        } else {
            PS.spriteShow( noteInvSprite, false );
        }
    } );

    // deactivate both arrows
    paintLeftArrow( false );
    paintRightArrow( false );

    // load and draw inventory background
    PS.imageLoad( "images/inventory.png", loadBG, 1 );

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
            setBanner( [ "Hi Coop. I see you got the diary, good work!",
                "Give me the book and",
                "let's see what's inside..." ] );
            break;
        case 7:
            setBanner( [ "I think it’s a map?",
                "And some sort of instructions I believe." ] );
            break;
        case 9:
            setBanner( [ "Here, agent, your next assignment.",
                "Figure out what is going on with this." ] );
            break;
        //case 13:
        //    setBanner(["Go find the Log Lady!"]);
        //    break;
        default:
            setBanner( [ "Talk to Sheriff Truman" ] );
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
    //if ( achievement == 12 ) {
    //    paintRightArrow( false );       // activate after speaking to Harry
    //}
    if ( achievement == 13 ) {
        if ( ach13b ) {
            paintRightArrow( true );
        } else {
            paintRightArrow( false );       // activate after speaking to Harry
        }
    }
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
            setBanner( [ "Talk to Leland Palmer" ] );
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

    //PS.debug( "Posición objectX = " + xobjX + " \n" );
    //PS.debug( "rnd = " + rnd + " \n" );

    // set status text
    switch ( achievement ) {
        case 0:
            setBanner( [ "Go talk to Sheriff Truman" ] );
            break;
        case 1:
            setBanner( [ "Go talk to Leland Palmer" ] );
            break;
        case 2:
            setBanner( [ "Move around!" ] );
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

    // load, create and draw Leland's wallet sprite

    if ( achievement < 4 ) {                    // Cooper hasn't got the wallet yet
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

    // load and draw Norma

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

    switch ( achievement ) {
        case 14:
            setBanner( [ "Collect the mask." ] );
            break;
        case 15:
            setBanner( [ "Click Margaret when you're ready." ] );
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
    paintLeftArrow( false );
    paintRightArrow( false );

};

// manage clicks on left arrow
var clickLeftArrow = function () {

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
    }

    // go to previous level
    if ( achievement < 9 ) {
        level -= 1;
    } else {
        level = 1;
    }
    switch ( level ) {
        case 1:
            initLevel1();
            break;
        case 2:                         // levels 3-6 unreachable from left arrow
            initLevel2();
    }
};

// manage clicks on right arrow
var clickRightArrow = function () {

    // nuke sprites from previous level
    PS.spriteDelete( cooperSprite );                // Cooper is always there
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
    }

    // go to next level

    if ( achievement < 9 ) level += 1;
    if ( achievement == 9 ) level = 4;
    if ( achievement == 11 ) level = 5;
    if ( achievement == 13 ) level = 6;

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
    }
};

// manage clicks on inventory (briefcase)
var clickInventory = function () {

    var prevStatusText = currentStatusText;     // save status text for later use

    if ( inventory == false ) {                 // when not on inventory screen...
        PS.spriteShow( cooperSprite, false );
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
        }
        if ( achievement != 8 ) {
            initInventory();                        // ...and present inventory

            if ( notificationSprite != "" ) {
                PS.spriteDelete( notificationSprite );
                notificationSprite = "";
            }
        }
    } else {                                    // when on inventory screen...
        if ( journalBWSprite != "" ) {  // ...recover the corresponding
            // sprites...
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

        switch ( level ) {
            case 1:
                initLevel1();                   // ...launch level...

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
                if ( achievement == 11 ) {              // ESTO SE DEBERÍA LLEVAR AL INIT???
                    paintLeftArrow( true );
                }
                if ( rockSprite != "" ) {
                    PS.spriteShow( rockSprite, true );
                }
                break;

            case 5:
                initLevel5();
                if ( achievement == 13 ) {              // ESTO SE DEBERÍA LLEVAR AL INIT???
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
        }
        PS.statusText( prevStatusText );        // ...and the status text
        currentStatusText = prevStatusText;

        inventory = false;                        // out of inventory screen
    }
};

// manage clicks on inventory main screen
var clickInventoryScreen = function ( x, y ) {

    if ( ( x > 2 && x < 7 ) && ( y > 9 && y < 14 ) && ( achievement == 4 ) && ( level == 2 ) )    // click on corn
    {
        hideInvSprites();
        initLevel2();
        objectX = false;            // Cooper delivers wallet
        setBanner( [ "Look! It's the diary! Take it." ] );


        bocadilloDiarioLeland();    // Leland speaks to Cooper
        achievement = 5;

        inventory = false;

    } else if ( ( x > 9 && x < 14 ) && ( y > 9 && y < 14 ) && ( achievement == 6 ) && ( level == 1 ) )     // click on diary
    {
        hideInvSprites();
        achievement = 7;
        initLevel1();
        drawBigNote();
        inventory = false;

    } else if ( ( x > 23 && x < 30 ) && ( y > 8 && y < 14 ) && ( achievement == 13 ) )     //click on toilet paper
    {
        hideInvSprites();
        initLevel6();
        achievement = 14;
        inventory = false;
    }
};

// manage clicks on level 1 (sheriff station)
var clickLevel1 = function ( x, y ) {

    if ( achievement == 8 ) {                   // click on big note
        PS.spriteDelete( bigNoteSprite );
        achievement = 9;

        // change status text
        setBanner( [ "Here, agent, your next assignment.",
            "Figure out what is going on with this." ] );

        paintRightArrow( true );

    } else {

        if ( ( ( x > 26 && x < 30 ) && ( y > 17 && y < 21 ) ) |     // click on Harry
            ( ( x == 28 ) && ( y == 21 ) ) |
            ( ( x > 25 && x < 31 ) && ( y > 21 && y < 27 ) )
            | ( ( x > 26 && x < 30 ) && y > 26 ) ) {

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
                    "Bring that back to me as soon as possible." ] );

            } else if ( achievement == 11 ) {
                // change status text
                setBanner( [ "You're telling me you made a rock",
                    "disappear? And you found what?",
                    "A roll of toilet paper... ",
                    "I think we're going to need some help.",
                    "Let me think about it. In the meantime,",
                    "why don't you take a break.",
                    "Go to the diner, eat some cherry pie,",
                    "and talk to the locals!" ] );
                ach11b = true;
                paintRightArrow( true );

            } else if ( achievement == 13 ) {
                // change status text
                setBanner( [ "Awesome pie, huh?",
                    "I finally figured out who to talk to.",
                    "Our close friend Margaret,",
                    "we call her the Log Lady.",
                    "You'll see why... Go check up on her.",
                    "She might be able to help out with the case." ] );
                ach13b = true;
                paintRightArrow( true );
            }
        } else if ( ( x > 19 && x < 25 ) && ( y > 18 && y < 24 ) && ( achievement == 7 ) ) { //click on the note

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

    if ( ( ( x > 26 && x < 30 ) && ( y > 17 && y < 21 ) ) |  // if click on Leland
        ( ( x == 28 ) && ( y == 21 ) ) |
        ( ( x > 25 && x < 31 ) && ( y > 21 && y < 27 ) ) |
        ( ( x > 26 && x < 30 ) && y > 26 ) ) {

        if ( achievement < 4 ) { // Coop didn't get the wallet yet

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
                "Then maybe we’ll talk." ] );

            bocadilloCruzLeland();      // Leland says no
            if ( achievement < 2 )
                achievement = 2;

        }
    }
};

// manage clicks on level 3 (outside of diner)
var clickLevel3 = function ( x, y ) {

    if ( achievement == 3 ) {           // if wallet fully visible
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
            setBanner( [ "Good job!",
                "You found Leland's creamed corn!" ] );

            achievement = 4;
        }
    }

    if ( achievement == 2 ) {           // if wallet not fully revealed

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
        if ( ( x > 14 ) && ( x < 21 ) && ( y > 25 ) ) {
            if ( !rockDone ) {
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

                } else if ( rockState > 7 ) {
                    rockDone = true;
                    achievement = 10;

                    // change status text
                    setBanner( [ "A roll of toilet paper? That's strange..." ] );

                    PS.spriteDelete( rockSprite );
                    rockSprite = "";
                }


            } else {

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

            } else if ( rockState > 7 ) {
                rockDone = true;

                // change status text
                setBanner( [ "A roll of toilet paper? That's strange..." ] );
            }

        }
    }

};

// manage clicks on level 5 (diner)
var clickLevel5 = function ( x, y ) {

    if ( ( ( x > 6 ) && ( x < 13 ) ) && ( ( y > 14 ) && ( y < 19 ) ) ) { // on cherry pie
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
    } else if ( ( ( ( x > 24 ) && ( x < 30 ) ) && ( ( y > 13 ) && ( y < 29 ) ) ) ) { // on character

        if ( ( achievement == 11 ) && ( !offeredWorms ) ) {             // on Pete

            // change status text
            setBanner( [ "Ah yes, you’re the FBI agent!",
                "So happy to meet you,",
                "my name’s Pete Martell.",
                "I head about the girl indeed,", "" +
                "I was the very one to find her!",
                " Oh I was so upset.",
                "I’d just caught a giant sturgeon too.",
                " Here, have some bait.",
                "In case you ever want to grab a rod",
                "and hop on out to the waters of Twin Peaks." ] );

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

        } else if ( ( achievement == 12 ) && ( !offeredDisinf ) ) {        // on Norma

            // change status text
            setBanner( [ "I heard on the news the other day there’s",
                "a really bizarre bug going around, and that",
                "it’s important to keep everything clean.",
                "Hey, that might’ve been fake, but take some",
                "disinfectant with you in case you ever need it." ] );

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
    } else if ( ( ( x > 15 ) && ( x < 21 ) ) && ( ( y > 14 ) && ( y < 20 ) ) ) { // on worms

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

    } else if ( ( ( x > 17 ) && ( x < 21 ) ) && ( ( y > 19 ) && ( y < 27 ) ) ) {  // on disinfectant
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
};

// manage clicks on level 6 (log lady's home)
var clickLevel6 = function ( x, y ) {
    var myImage, mySprite;

    if ( achievement == 16 ) {

        PS.audioFade( click_id, 0.04, 0 );

        paintLeftArrow( true );
        paintRightArrow( true );

        PS.border( PS.ALL, PS.ALL, 0 );
        PS.gridShadow( false );
        PS.gridColor( PS.COLOR_BLACK );

        // load the background music
        PS.audioPlay( "farewell_theme", {
            fileTypes: [ "mp3", "ogg" ],
            path: "./",
            volume: 0.08,
            loop: true
        } );

        // load and draw to be continued
        PS.imageLoad( "images/tobecontinued.png", function ( data ) {
            myImage = data; // save image ID

            // Create an image sprite from the loaded image
            // Save sprite ID for later reference

            mySprite = PS.spriteImage( myImage );

            PS.spritePlane( mySprite, 100 );
            PS.spriteMove( mySprite, 0, 0 );

        } );

    } else {

        if ( ( ( x > 26 && x < 30 ) && ( y > 17 && y < 21 ) ) |     // click on Margaret
            ( ( x == 28 ) && ( y == 21 ) ) |
            ( ( x > 25 && x < 31 ) && ( y > 21 && y < 27 ) )
            | ( ( x > 26 && x < 30 ) && y > 26 ) ) {

            if ( achievement == 14 ) {

                // change status text
                setBanner( [ "Thank you, I’ve been looking for that.",
                    "Here, take this.",
                    "It might serve you well later." ] );

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
            } else if ( achievement == 15 ) {
                if ( !readyForCode ) {

                    DB.send();

                    // change status text
                    setBanner( [ "Now, onto what I was saying…",
                        "you must remember the owls.",
                        "You must also remember the following...",
                        "Click Margaret when you're ready" ] );

                    readyForCode = true;

                } else {

                    textEnd = false;
                    paintCode( mapCodeN, PS.COLOR_RED );
                    setTimeout( paintCode, 2500, mapCodeC, PS.COLOR_BLUE );
                    setTimeout( paintCode, 5000, mapCode1, PS.COLOR_GREEN );
                    setTimeout( paintCode, 7500, mapCode9, PS.COLOR_VIOLET );
                    setTimeout( function () {
                        textEnd = true;
                    }, 10000 );

                    achievement = 16;
                }

            } else {
                // change status text
                setBanner( [ "Hi Cooper.",
                    "You might be wondering why you’re here.",
                    "Well my log tells me there are a few",
                    "very important things I need to tell you.",
                    "What? You have something for me?" ] );
            }
        }
        if ( ( x > 11 && x < 20 ) && ( y > 19 && y < 24 ) && ( inventory == false ) )     // click on mask
        {
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
                setBanner( [ "You collected the mask!" ] );

                achievement = 15; // picked up mask
            }
        }
    }
};

// what happens on shutdown
PS.shutdown = function ( options ) {
    DB.send();
};

// GAME INITIALIZATION
PS.init = function ( system, options ) {

    var complete = function ( user ) {
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
    };

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

    // present level 1
    initLevel1();

    //play-testing data base calls
    DB.active( true ); // change the parameter to false to disable DB calls
    DB.init( "wrappedinplastic", complete ); // Collect credentials, and THEN
    // call complete()
};


// POINT-AND-CLICK HANDLING
PS.touch = function ( x, y, data, options ) {

    /*
        PS.debug( "Click on x =" + x + ", y = " + y +
        "\nLevel = " + level +
        "\nAchievement = " + achievement +
        "\n rockstate = " + rockState +
        "\n\n" );
     */

    if ( textEnd ) {

        PS.audioPlay( "fx_click", {                     // click audio feedback
            volume: 0.15
        } );

        if ( ( x > 26 ) && ( y < 7 ) ) {                // CLICK ON RIGHT ARROW
            clickRightArrow();

        } else if ( ( x < 5 ) && ( y < 7 ) ) {          // CLICK ON LEFT ARROW
            clickLeftArrow();

        } else if ( ( x > 11 && x < 20 ) &&             // CLICK ON INVENTORY
            ( y < 7 ) ) {
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

                    case 5:                                 //when on level 5
                        clickLevel5( x, y );
                        break;

                    case 6:                                 // when on level 3
                        clickLevel6( x, y );
                }
            }
        }
    }
};