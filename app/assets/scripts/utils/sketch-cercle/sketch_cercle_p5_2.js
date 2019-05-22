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

	radius = width * 2;

	for (var i = 0; i < newIris.length; i++) {
		newIris[i] = new Iris(); //création Iris
	}
}


function draw() {
	// Animate Iris
	for (var i = 0; i < newIris.length; i++) {
		newIris[i].drawIris(c1); //dessiner selon l'objet (qui est contenu dans le tableau) et la méthode drawIris (cf plus bas)
	}
	// reset parameters every time 'limit' is hit
	if (timer++ === 0)//transition entre deux formes
	{
		for (var j = 0; j < newIris.length; j++) {
			newIris[j].reDrawIt(); //pour redessiner une autre forme
		}
	}
}


///////////////////////



function rGen() {
	var r = random(0.65, 1.5) * rTemp;
	return r;
}
