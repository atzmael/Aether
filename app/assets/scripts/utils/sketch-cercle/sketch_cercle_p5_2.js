var iris = new Array(1000);
var newIris = new Array(1000);

// noise factors
var noiseScale = 500, noiseStrength = 50;

// noise display factors
var overlayAlpha = 0, irisAlpha = 255;

// main circle parameters
var radius; //taille du cercle de départ
var rTemp = radius;

// animation related variables
var limit = 100, timer = 0;

// colors
var c1 = '#ffffff';



function setup() {
  createCanvas(700, 700);

  smooth();
  background(21, 21, 21, 0);
  
  radius = width*2;

  for (var i = 0; i < newIris.length; i++) {
    newIris[i] = new Iris(); //création Iris
  } 
}


function draw() 
{
  // Animate Iris
  for (var i = 0; i < newIris.length; i++) 
  {
    newIris[i].drawIris(c1); //dessiner selon l'objet (qui est contenu dans le tableau) et la méthode drawIris (cf plus bas)
  }
    // reset parameters every time 'limit' is hit
  if (timer++ === 0 )//transition entre deux formes
  { 
    for (var j = 0; j < newIris.length; j++)
    {
      newIris[j].reDrawIt(); //pour redessiner une autre forme
    }
  }
}



///////////////////////

class Iris {
  // x,y    = the current position
  // ox,oy  = the position, but slightly back in time
  // sx,sy  = start positions

  constructor () {
    this.isOutside = false;
    
    this.step = 5; //distance entre les deux povars de la ligne
    this.NDo = Math.random() * 360;
    this.sx = width/2  + radius * cos(this.NDo); //center + taille du cercle * cos(random) pour avoir un cercle de povars en x
    this.sy = height/2 + radius * sin(this.NDo); //center + taille du cercle * sin(random) pour avoir un cercle de povars en y
    this.x = this.sx;
    this.y = this.sy;
  }

  drawIris(cF) {
    // calculate angle which is based on noise
    // and then use it for x and y positions
    var angle = noise(this.x / noiseScale, this.y / noiseScale) * noiseStrength; //noiseScale = taille des virages du dessin

    // write in the last value of x,y varo ox,oy >> old x, old y //on dit ici que la position actuelle devient l'ancienne pour calculer la prochaine
    this.ox = this.x; 
    this.oy = this.y;

    radius = width/4; //taille du cercle random avec rGen ou alors valeur fixe

    // calculate new x and y position
    this.x += cos(angle) * this.step;
    this.y += sin(angle) * this.step;

    // what happens when x and y hit the outside //si on touche les bord d'un cerlce dont le rayon fait 1/2 fenêtre x et y gardent leur ancienne position

    if (dist(width/2, height/2, this.x, this.y) > 300) {
      this.isOutside = true;
    }

    if (this.isOutside) { //donc les povars gardent leur position
      this.x = this.ox;
      this.y = this.oy;
    }

    // qu'est ce qu'on dessine

    noStroke();
    fill(cF);
    ellipse(this.x, this.y, 1, 1);

    // return var to false for next cycle
    this.isOutside = false;
  }

  reDrawIt() {

    // new noise
    noiseScale = random(400, 700);
    noiseStrength = random(10, 45); 
    noiseDetail(random(1, 10), 0.5);

    // parameters reset

    this.x = width/2  + radius * cos(this.NDo);
    this.y = height/2 + radius * sin(this.NDo);
  }
}

function rGen() {
  var r = random(0.65, 1.5) * rTemp;
  return r;
}