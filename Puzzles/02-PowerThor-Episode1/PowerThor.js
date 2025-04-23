/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 * ---
 * Hint: You can use the debug stream to print initialTX and initialTY, if Thor seems not follow your orders.
 **/
// variables que dan
var inputs = readline().split(' ');
const lightX = parseInt(inputs[0]); // the X position of the light of power
const lightY = parseInt(inputs[1]); // the Y position of the light of power
const initialTx = parseInt(inputs[2]); // Thor's starting X position
const initialTy = parseInt(inputs[3]); // Thor's starting Y position

// Mis variables
let move = "";
let currentX = initialTx;
let currentY = initialTy;
// game loop
while (true) {
    const remainingTurns = parseInt(readline()); // The remaining amount of turns Thor can move. Do not remove this line.

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    if(currentX == lightX && currentY > lightY){
        move = "N";
        currentY--;
    }
    else if(currentX < lightX && currentY > lightY){
        move = "NE";
        currentX++;
        currentY--;
    }
    else if(currentX < lightX && currentY == lightY){
        move = "E";
        currentX++;
    }  
    else if(currentX < lightX && currentY < lightY){
        move = "SE";
        currentX++;
        currentY++;
    }   
    else if(currentX == lightX && currentY < lightY){
        move = "S";
        currentY++;
    } 
    else if(currentX > lightX && currentY < lightY){
        move = "SW";
        currentX--;
        currentY++;
    } 
    else if(currentX > lightX && currentY == lightY){
        move = "W";
        currentX--;
    }  
    else if(currentX > lightX && currentY > lightY){
        move = "Nw";
        currentX--;
        currentY++;
    }

    // A single line providing the move to be made: N NE E SE S SW W or NW
    console.log(move);
}
