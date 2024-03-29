export default class Stone {
	constructor(radius = 1, details = 0, stoneNumber = 0, amp = 0.5) {
		this.radius = radius;
		this.details = details;
		this.stoneNumber = stoneNumber;

		this.stones = [];
		for(let x = 0; x < 5;x++){
			this.stones[x] = [];
		}

		this.init();
	}

	init() {
		this.mesh = new THREE.Object3D();
		this.mesh.name = "stone-field";
		this.mesh.position.y = 0;

		this.createFieldOfStone();
	}
	/**
	 *
	 */
	createFieldOfStone() {
		let x, y, stone, posX, posY;

		for (let i = 0; i < this.stoneNumber; i++) {
			x = Math.round(Math.random() * (4 - 1) + 1);
			y = Math.round(Math.random() * (4 - 1) + 1);
			if (this.stones[x][y] == undefined) {
				stone = this.createStone();
				posX = (x - (this.stones.length / 2)) * 30 + (Math.cos(Math.random() * Math.PI) * 10);
				posY = (y - (this.stones.length / 2)) * 30 + (Math.sin(Math.random() * Math.PI) * 10);
				stone.position.set(posX, posY, 0);
				this.stones[x][y] = stone;
				this.mesh.add(stone);
			}
		}
	}

	/**
	 *
	 * @returns {THREE.Mesh}
	 */
	createStone() {
		let shapes = Math.round(Math.random()), geom;

		geom = new THREE.IcosahedronGeometry(this.radius, this.details);

		if (shapes == 1) {
			geom = new THREE.DodecahedronGeometry(this.radius, this.details);
		}

		let mat = new THREE.MeshLambertMaterial({color: '#720300'});

		let stone = new THREE.Mesh(geom, mat);

		stone.name = "stone";

		let verts = stone.geometry.vertices, ang, amp;

		for (let i = 0; i < verts.length; i++) {
			let v = verts[i];

			ang = Math.random() * Math.PI;
			amp = 0.2;

			v.x += Math.cos(ang) * amp;
			v.y += Math.sin(ang) * amp;
		}

		// Utility, debug purpose only
		let edges = new THREE.EdgesGeometry(geom);
		let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 'red'}));
		//stone.add(line);

		objectToInteractCollection.push(stone);

		return stone;
	}
}