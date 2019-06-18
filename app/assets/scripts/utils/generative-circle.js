import storage from './storage';

const generativeCircle = function (sketch) {

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

	// Stored vars
	let ls_ndo, ls_noiseScale, ls_noiseStrength, ls_noiseDetails, ls_r;

	if(storage.read('is-form-generated') == 'true') {
		ls_ndo = storage.read('ndo');
		ls_noiseScale = storage.read('noiseScale');
		ls_noiseStrength = storage.read('noiseStrength');
		ls_noiseDetails = storage.read('noiseDetails');
		ls_r = storage.read('r');
	}else {
		ls_ndo = Math.random();
		ls_noiseScale = sketch.random(400, 700);
		ls_noiseStrength = sketch.random(10, 45);
		ls_noiseDetails = sketch.random(1, 10);
		ls_r = sketch.random(0.65, 1.5);

		document.querySelector('.js-landing').addEventListener('click', () => {
			storage.create('ndo', ls_ndo);
			storage.create('noiseScale');
			storage.create('noiseStrength');
			storage.create('noiseDetails');
			storage.create('r');
		});
	}

	sketch.setup = function() {
		let canvas = sketch.createCanvas(800, 800);
		canvas.parent('background-generative');

		sketch.smooth();
		sketch.background(21, 21, 21, 0);

		radius = sketch.width * 2;

		for (var i = 0; i < newIris.length; i++) {
			newIris[i] = new Iris(); //création Iris
		}
	}


	sketch.draw = function() {
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

	class Iris {
		// x,y    = the current position
		// ox,oy  = the position, but slightly back in time
		// sx,sy  = start positions

		constructor() {
			this.isOutside = false;

			this.step = 5; //distance entre les deux povars de la ligne
			this.NDo = Math.random() * 360;
			this.sx = sketch.width / 2 + radius * sketch.cos(this.NDo); //center + taille du cercle * cos(random) pour avoir un cercle de povars en x
			this.sy = sketch.height / 2 + radius * sketch.sin(this.NDo); //center + taille du cercle * sin(random) pour avoir un cercle de povars en y
			this.x = this.sx;
			this.y = this.sy;
		}

		drawIris(cF) {
			// calculate angle which is based on noise
			// and then use it for x and y positions
			var angle = sketch.noise(this.x / noiseScale, this.y / noiseScale) * noiseStrength; //noiseScale = taille des virages du dessin

			// write in the last value of x,y varo ox,oy >> old x, old y //on dit ici que la position actuelle devient l'ancienne pour calculer la prochaine
			this.ox = this.x;
			this.oy = this.y;

			radius = sketch.width / 4; //taille du cercle random avec rGen ou alors valeur fixe

			// calculate new x and y position
			this.x += sketch.cos(angle) * this.step;
			this.y += sketch.sin(angle) * this.step;

			// what happens when x and y hit the outside //si on touche les bord d'un cerlce dont le rayon fait 1/2 fenêtre x et y gardent leur ancienne position

			if (sketch.dist(sketch.width / 2, sketch.height / 2, this.x, this.y) > 300) {
				this.isOutside = true;
			}

			if (this.isOutside) { //donc les povars gardent leur position
				this.x = this.ox;
				this.y = this.oy;
			}

			// qu'est ce qu'on dessine

			sketch.noStroke();
			sketch.fill(cF);
			sketch.ellipse(this.x, this.y, 1, 1);

			// return var to false for next cycle
			this.isOutside = false;
		}

		reDrawIt() {

			// new noise
			noiseScale = sketch.random(400, 700);
			noiseStrength = sketch.random(10, 45);
			sketch.noiseDetail(sketch.random(1, 10), 0.5);

			// parameters reset

			this.x = sketch.width / 2 + radius * sketch.cos(this.NDo);
			this.y = sketch.height / 2 + radius * sketch.sin(this.NDo);
		}
	}

	function rGen() {
		var r = sketch.random(0.65, 1.5) * rTemp;
		return r;
	}

};

export default generativeCircle;