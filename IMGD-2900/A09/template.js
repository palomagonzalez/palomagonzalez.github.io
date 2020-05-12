

// present level NN (EL ESCENARIO QUE CORRESPONDA)
var initLevelNN = function () {

    // set status text according to the progress
    switch ( achievement ) {
        case NN:
            setBanner( [ "TEXTO 1" ] );
            break;
        case NN:
            setBanner( [ "TEXTO 2" ] );
            break;
        case NN:
            setBanner( [ "TEXTO 3" ] );
            break;
        default:
            setBanner( [ "TEXTO POR DEFECTO" ] );
    }

    // load and draw [ESCENARIO] background
    PS.imageLoad( "images/[NOMBRE DEL FICHERO].png", loadBG, 1 );

    // load, create and draw Special Agent Dale Cooper [OJO, SALVO EN EL CASO DEL NIVEL 9 QUE NO HAY COOPER]

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

    // load, create and draw [LOS OTROS PERSONAJES Y SPRITES 'FIJOS' EN EL NIVEL]

            // COPIAR EL CÓDIGO DE COOPER

    // set level control variables
    level = n;

    // activate the corresponding arrows

            // paintLeftArrow Y paintRightArrow true O false COMO CORRESPONDA, BIEN EN
            // TODOS LOS CASOS O DEPENDIENDO DEL ACHIEVEMENT O VARIABLES DE CONTROL
    
};

// manage clicks on level NN
var clickLevelNN = function(x, y){
  
    // AQUÍ TODA LA LÓGICA 'INTERNA' DEL NIVEL, EN FUNCIÓN DE DONDE SE PINCHE (x, y), O DEL
    // ACHIEVEMENT Y/U OTRAS VARIABLES DE CONTROL
    
};

