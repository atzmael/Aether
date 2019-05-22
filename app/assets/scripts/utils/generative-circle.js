import p5 from 'p5';

const generativeCircle = p5 => {
	p5.setup = () => {
		p5.createCanvas(window.innerWidth, window.innerHeight);


		smooth();
		background(21, 21, 21, 0);

		this.radius = width * 2;

		for (var i = 0; i < this.newIris.length; i++) {
			this.newIris[i] = new Iris(this); //création Iris
		}
	}

	/*
	let ui = {};

	iris: new Array(1000),
	newIris: new Array(1000),

	// noise factors
	noiseScale: 500, noiseStrength: 50,

	// noise display factors
	overlayAlpha: 0, irisAlpha: 255,

	// main circle parameters
	radius: 0, //taille du cercle de départ
	rTemp: 0,

	// animation related variables
	limit: 100, timer: 0,

	// colors
	c1: '#ffffff',

	bindUI() {
		this.ui.body = document.querySelector('body');

		this.ui.container = document.querySelector('.js-generative');
	},

	bindEvent() {
	},

	init() {
		this.bindUI();
		this.bindEvent();

		this.rTemp = this.radius;

		this.setup();
	},

	setup() {
		createCanvas(window.innerWidth, window.innerHeight);


		smooth();
		background(21, 21, 21, 0);

		this.radius = width * 2;

		for (var i = 0; i < this.newIris.length; i++) {
			this.newIris[i] = new Iris(this); //création Iris
		}
	},

	rGen() {
		var r = random(0.65, 1.5) * this.rTemp;
		return r;
	},

	draw() {
		// Animate Iris
		for (var i = 0; i < newIris.length; i++) {
			this.newIris[i].drawIris(this.c1); //dessiner selon l'objet (qui est contenu dans le tableau) et la méthode drawIris (cf plus bas)
		}
		// reset parameters every time 'limit' is hit
		if (timer++ === 0)//transition entre deux formes
		{
			for (var j = 0; j < this.newIris.length; j++) {
				this.newIris[j].reDrawIt(); //pour redessiner une autre forme
			}
		}
	}
	*/
};

/*

class Iris {
	// x,y    = the current position
	// ox,oy  = the position, but slightly back in time
	// sx,sy  = start positions

	constructor(context) {
		this.isOutside = false;

		this.context = context;

		this.step = 5; //distance entre les deux povars de la ligne
		this.NDo = Math.random() * 360;
		this.sx = width / 2 + this.context.radius * cos(this.NDo); //center + taille du cercle * cos(random) pour avoir un cercle de povars en x
		this.sy = height / 2 + this.context.radius * sin(this.NDo); //center + taille du cercle * sin(random) pour avoir un cercle de povars en y
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

		this.context.radius = width / 4; //taille du cercle random avec rGen ou alors valeur fixe

		// calculate new x and y position
		this.x += cos(angle) * this.step;
		this.y += sin(angle) * this.step;

		// what happens when x and y hit the outside //si on touche les bord d'un cerlce dont le rayon fait 1/2 fenêtre x et y gardent leur ancienne position

		if (dist(width / 2, height / 2, this.x, this.y) > 300) {
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

		this.x = width / 2 + this.context.radius * cos(this.NDo);
		this.y = height / 2 + this.context.radius * sin(this.NDo);
	}
}
*/

export default generativeCircle;