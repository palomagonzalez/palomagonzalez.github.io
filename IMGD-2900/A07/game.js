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

// Constants
var WIDTH = 32; // width of grid
var HEIGHT = 32; // height of grid

// Global variables
var level = 1;
var firstTime = true;
var inventory = false;
var journal = false;
var objectX = false;
var hidingObjOpacity = 255;
var cooperSprite, harrySprite, lelandSprite, objectXSprite, hidingSprite;
var bubbleSprite = "", journalSprite = "", crossSprite = "", congratsSprite = "";
var journalBWSprite = "", objectXBWSprite = "", journalInvSprite = "", objectXInvSprite = "";
var xCoop = 1, yCoop = 18;     // Coop's position
var xobjX = 16, yobjX = 27;
var currentStatusText;
var notificationSprite = "";
var lelandOfferedJournal = false;
var gameDone = false;


var path = null; // path to follow, null if none
var step = 0; // current step on path

//Global functions

harryCongrats = function () {

    var myImage, mySprite;

    // load and draw bubble
    PS.imageLoad( "images/congrats.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 22, 13 );

        congratsSprite = mySprite;        // Save for using later
    } );


}

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

    if ( path ) { // path ready (not null)?
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


        step += 1; // point to next step

        // If no more steps, nuke path

        if ( step >= path.length ) {
            path = null;
        }
    }
}


loadBG = function ( imageData ) {         // 'MYLOADER' PARA LOS BACKGROUNDS (LOS CARGA Y LOS DIBUJA)

    // The image argument of loadBG() is passed
    // an image object representing *.bmp

    // Report imageData in debugger

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

    PS.gridRefresh();

}

loadScreentop = function ( imageData ) {         // 'MYLOADER' PARA FLECHAS Y MALETÍN (LOS CARGA Y LOS DIBUJA)

    // The image argument of loadScreentop() is passed
    // an image object representing *.bmp

    // Report imageData in debugger

    var imagen = imageData;


    var x, y, ptr, color; // *BM* These variables weren't declared anywhere

    ptr = 0; // init pointer into data array
    for ( y = 0; y < 7; y += 1 ) {
        for ( x = 0; x < 32; x += 1 ) {
            color = imagen.data[ ptr ]; // get color
            PS.color( x, y, color ); // assign to bead
            ptr += 1; // point to next value
        }
    }

    PS.gridRefresh();

}

//pintar flecha derecha
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

//pintar flecha izquierda
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

initInventory = function () {
    inventory = true;

    var myImage, mySprite;

    // load and draw bubble
    PS.imageLoad( "images/journal_inv_bw.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 3, 10 );

        journalBWSprite = mySprite;        // Save for using later
    } );

    var myImage, mySprite;

    // load and draw bubble
    PS.imageLoad( "images/objectX_bw.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 4 );
        PS.spriteMove( mySprite, 10, 10 );

        objectXBWSprite = mySprite;        // Save for using later
    } );

    var myImage, mySprite;

    // load and draw bubble
    PS.imageLoad( "images/journal_inv.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 3, 10 );

        journalInvSprite = mySprite;        // Save for using later

        if ( journal ) {
            PS.spriteShow( journalInvSprite, true );

        } else {
            PS.spriteShow( journalInvSprite, false );
        }
    } );

    var myImage, mySprite;

    // load and draw bubble
    PS.imageLoad( "images/objectX.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );

        PS.spritePlane( mySprite, 5 );
        PS.spriteMove( mySprite, 10, 10 );

        objectXInvSprite = mySprite;        // Save for using later

        if ( objectX ) {
            PS.spriteShow( objectXInvSprite, true );

        } else {
            PS.spriteShow( objectXInvSprite, false );
        }
    } );

    paintLeftArrow( false );
    paintRightArrow( false );
    PS.imageLoad( "images/inventory.png", loadBG, 1 );
    PS.statusText( "Welcome to your inventory!" );
};

initLevel1 = function () {

    currentStatusText = "Talk to Sheriff Truman";
    PS.statusText( currentStatusText );

    // CARGAR Y DIBUJAR LA STATION

    PS.imageLoad( "images/sheriffstation.png", loadBG, 1 );

    // CARGAR, CREAR Y DIBUJAR A COOPER

    var myImage, mySprite;

    PS.imageLoad( "images/cooper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );


        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 1, 18 );

        cooperSprite = mySprite;        // Save for using later

    } );

    //CARGAR, CREAR Y DIBUJAR A HARRY

    var myImage, mySprite;

    PS.imageLoad( "images/sherifftruman.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );



        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 26, 18 );

        harrySprite = mySprite;        // Save for using later

    } );

    // INICIALIZA VARIABLES DE CONTROL DEL NIVEL

    level = 1;
    firstTime = false;

    paintLeftArrow( false );
    paintRightArrow( true );

}

initLevel2 = function () {

    currentStatusText = "Talk to Leland Palmer";
    PS.statusText( currentStatusText );


    //CARGAR Y DIBUJAR LA CASA DE LAURA

    PS.imageLoad( "images/palmer_house.png", loadBG, 1 );

    // CARGAR, CREAR Y DIBUJAR A COOPER

    var myImage, mySprite;

    PS.imageLoad( "images/cooper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );




        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 1, 18 );

        cooperSprite = mySprite;        // Save for using later

    } );

    //CARGAR, CREAR Y DIBUJAR A LELAND

    var myImage, mySprite;

    PS.imageLoad( "images/leland.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );



        PS.spritePlane( mySprite, 1 );
        PS.spriteMove( mySprite, 26, 18 );

        lelandSprite = mySprite;        // Save for using later

    } );

    // INICIALIZA VARIABLES DE CONTROL DEL NIVEL

    level = 2;
    firstTime = false;

    paintLeftArrow( true );
    paintRightArrow( true );

}

initLevel3 = function () {

    currentStatusText = "Move around!";
    PS.statusText( currentStatusText );

    //CARGAR Y DIBUJAR OUTSIDE AREA
    //PS.spriteShow( lelandSprite, false );
    PS.imageLoad( "images/outside_area.png", loadBG, 1 );

    // CARGAR, CREAR Y DIBUJAR A COOPER

    var myImage, mySprite;

    PS.imageLoad( "images/cooper.png", function ( data ) {
        myImage = data; // save image ID

        // Create an image sprite from the loaded image
        // Save sprite ID for later reference

        mySprite = PS.spriteImage( myImage );




        PS.spritePlane( mySprite, 3 );

        PS.spriteMove( mySprite, xCoop, yCoop );

        cooperSprite = mySprite;        // Save for using later

    } );


    //CARGAR Y CREAR EL OBJETO X
    if ( !objectX ) {
        PS.imageLoad( "images/objectX.png", function ( data ) {
            myImage = data; // save image ID

            // Create an image sprite from the loaded image
            // Save sprite ID for later reference

            mySprite = PS.spriteImage( myImage );



            PS.spritePlane( mySprite, 1 );

            PS.spriteMove( mySprite, xobjX, yobjX );

            objectXSprite = mySprite;        // Save for using later

        } );

    }

    //OCULTAR EL OBJETO X CON UN SPRITE ENCIMA

    mySprite = PS.spriteSolid( 5, 5 );

    hidingSprite = mySprite;

    PS.spritePlane( hidingSprite, 2 );
    PS.spriteSolidColor( hidingSprite, 0x989898 );
    PS.spriteMove( hidingSprite, xobjX, yobjX );
    PS.spriteSolidAlpha( hidingSprite, hidingObjOpacity );

    // INICIALIZA VARIABLES DE CONTROL DEL NIVEL

    level = 3;
    firstTime = false;

    paintLeftArrow( true );
    paintRightArrow( false );
}

// INICIALIZACIÓN DEL JUEGO

PS.init = function ( system, options ) {

    //PINTA LA REJILLA Y EL BORDE DE SEPARACIÓN


    PS.gridSize( WIDTH, HEIGHT );
    PS.gridColor( PS.GRAY );  // HABRÁ QUE REVISARLO PORQUE NO SÉ MUY BIEN SI LO ESTÁ HACIENDO
    PS.border( PS.ALL, PS.ALL, 0 ); // no border...
    // ...except for the separation between screen areas
    PS.border( PS.ALL, 6, {
        top: 0,
        left: 0,
        bottom: 6,
        right: 0
    } );
    PS.borderColor( PS.ALL, 6, PS.COLOR_WHITE );

    // Start the timer function
    // Run at 10 frames/sec (every 6 ticks)

    //DB functions
    DB.active( true ); // change the call parameter to false to disable DB calls
    DB.init( "dbdemo" ); // Initialize the API

    PS.timerStart( 3, tick );  // the greater the parameter, the slower Cooper moves

    PS.audioLoad("fx_tada");



    // CARGA Y DIBUJA LA FLECHA Y EL MALETÍN

    PS.imageLoad( "images/flechas_y_maletin.png", loadScreentop, 1 );





    // INICIALIZA EL NIVEL 1   **** AQUÍ PROPONE TGG HACER UN 'NIVEL 0' QUE SOLO HAYA QUE HACER CLICK ****

    initLevel1();
};


// TRATAMIENTO DEL EVENTO CLICK EN LA CELDA X, Y (QUE TIENE DATOS = data)

PS.touch = function ( x, y, data, options ) {


    PS.audioPlay( "fx_click" ); // provides auditive feedback

    if ( ( x > 26 ) && ( y < 7 ) ) {            // TRATAMIENTO DE LOS CLICKS EN LA FLECHA DERECHA
        firstTime = false;

        // borra los sprites anteriores

        PS.spriteDelete( cooperSprite );

        switch ( level ) {
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

        level += 1;



        switch ( level ) {
            //case 1:               **** ESTE CASE SE PUEDE BORRAR PORQUE NUNCA LLEGARÁ AL NIVEL 1 CON LA FLECHA DERECHA
            //    initLevel1();
            //    break;
            case 2:

                initLevel2();
                break;
            case 3:
                initLevel3();
        }
    } else if ( ( x < 5 ) && ( y < 7 ) ) {     // TRATAMIENTO DE LOS CLICKS EN LA FLECHA IZQUIERDA
        firstTime = false;

        // borra los sprites anteriores

        PS.spriteDelete( cooperSprite );

        switch ( level ) {
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

        level -= 1;


        switch ( level ) {
            case 1:
                initLevel1();
                break;
            case 2:
                initLevel2();
            //    break;            **** ESTE CASE SE PUEDE BORRAR PORQUE NUNCA LLEGARÁ AL NIVEL 3 CON LA FLECHA IZQUIERDA
            //case 3:
            //    initLevel3();

        }

    } else if ( ( x > 11 && x < 20 ) && ( y < 7 ) ) {

        //FUNCIÓN DE INICIO DEL INVENTARIO
        var prevStatusText = currentStatusText;

        if ( inventory == false ) {
            switch ( level ) {
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


                    initInventory();
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


                    initInventory();
                    break;
                case 3:
                    PS.spriteShow( cooperSprite, false );
                    PS.spriteShow( hidingSprite, false );
                    if ( objectXSprite != "" ) {
                        PS.spriteShow( objectXSprite, false );
                    }


                    initInventory();
            }

            if ( notificationSprite != "" ) {
                PS.spriteDelete( notificationSprite );
                notificationSprite = "";
            }

        } else {
            switch ( level ) {
                case 1:
                    initLevel1();
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
                    if ( congratsSprite != "" ) {
                        PS.spriteShow( congratsSprite, true );
                    }
                    inventory = false;
                    //harryCongrats();
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
                    inventory = false;
                    //bocadilloDiarioLeland();
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
                    inventory = false;
                    break;
            }

            PS.statusText( prevStatusText );
            currentStatusText = prevStatusText;
        }

    } else {
        // TRATAMIENTO DE LOS CLICKS EN CUALQUIER OTRO SITIO




        switch ( level ) {
            case 1:
                if ( firstTime ) {
                    initLevel1();
                } else {
                    if ( ( ( x > 26 && x < 30 ) && ( y > 17 && y < 21 ) ) | ( ( x == 28 ) && ( y == 21 ) ) | ( ( x > 25 && x < 31 ) && ( y > 21 && y < 27 ) ) | ( ( x > 26 && x < 30 ) && y > 26 ) ) {


                        if ( journal ) {
                            // PINTA A HARRY FELIZ CON LINEAS ALREDEDOR
                            harryCongrats();
                            journal = false;

                            //change status text
                            currentStatusText = "Congrats!";
                            PS.statusText( currentStatusText );
                            //plays little congrats audio
                            PS.audioPlay("fx_tada");

                            paintRightArrow(false);
                            paintLeftArrow(false);

                            gameDone = true;

                            //PS.active(PS.ALL, PS.ALL, false);

                            DB.send();

                        } else if (gameDone){

                        }
                        else {
                            // PINTA BOCADILLO CON DIARIO
                            bocadilloDiarioHarry();


                            //CHANGE STATUS TEXT TO "FIND THE DIARY"
                            currentStatusText = "Find the diary!";
                            PS.statusText( currentStatusText );

                        }
                    }
                }
                break;
            case 2:
                if ( firstTime ) {
                    initLevel2()
                } else {


                    if ( !journal ) {
                        if ( lelandOfferedJournal ) {
                            //AQUI
                            if ( ( x > 19 && x < 25 ) && ( y > 18 && y < 24 ) ) {
                                journal = true;
                                PS.spriteDelete( journalSprite );
                                journalSprite = "";

                                var mySprite;
                                mySprite = PS.spriteSolid( 2, 2 );
                                PS.spriteSolidColor( mySprite, PS.COLOR_RED );
                                PS.spriteMove( mySprite, 20, 0 );
                                notificationSprite = mySprite;

                                currentStatusText = "You collected the diary!";
                                PS.statusText(currentStatusText);
                            }

                        }

                    }

                    if ( ( ( x > 26 && x < 30 ) && ( y > 17 && y < 21 ) ) | ( ( x == 28 ) && ( y == 21 ) ) | ( ( x > 25 && x < 31 ) && ( y > 21 && y < 27 ) ) | ( ( x > 26 && x < 30 ) && y > 26 ) ) {
                        if ( objectX ) {
                            //change status text
                            currentStatusText = "Look! It's the diary!";

                            objectX = false;

                            PS.statusText( currentStatusText );

                            //PINTA BOCADILLO CON DIARIO
                            bocadilloDiarioLeland();

                            //AÑADE EL DIARIO AL INVENTARIO


                        } else {
                            //change status text
                            currentStatusText = "Find Leland's wallet";
                            PS.statusText( currentStatusText );

                            // PINTA BOCADILLO CON CRUZ DE NO
                            bocadilloCruzLeland();

                        }
                    }
                }
                break;
            case 3:
                if ( firstTime ) {
                    initLevel3()
                } else {
                    if ( !objectX ) {

                        if ( hidingObjOpacity < 2 ) {
                            if ( ( x > ( xobjX - 1 ) && x < ( xobjX + 5 ) ) && ( y > ( yobjX - 1 ) && y < ( yobjX + 5 ) ) ) {

                                objectX = true;
                                PS.spriteDelete( objectXSprite );
                                objectXSprite = "";

                                var mySprite;
                                mySprite = PS.spriteSolid( 2, 2 );
                                PS.spriteSolidColor( mySprite, PS.COLOR_RED );
                                PS.spriteMove( mySprite, 20, 0 );
                                notificationSprite = mySprite;

                                currentStatusText = "Good job! You found Leland's wallet!"
                                PS.statusText(currentStatusText);

                            }
                        } else {


                            // move Cooper

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


                        // VA HACIENDO APARECER EL OBJETO X
                        /*
                        if ( EnElCaminoPasaPorElObjetoX ) {
                            objXOpacity += .25;
                        }
                        if ( objXOpacity == 1 ) {
                            objectX = true;
                        }
                         */

                    }
                }
        }
    }
}
;