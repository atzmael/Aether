import Helpers from '../helpers';

export default class Stalagmite {
	constructor(radius = 1.6, height = 15, segments = 32, stalagmiteNumber = 0, amp = 0.5) {
		this.radius = radius;
		this.height = height;
		this.segments = segments;
		this.stalagmiteNumber = stalagmiteNumber;

		this.stalagmites = [];
		for(let x = 0; x < 5;x++){
			this.stalagmites[x] = [];
		}

		this.init();
	}

	init() {
		this.mesh = new THREE.Object3D();
		this.mesh.name = "stalagmite-field";
		this.mesh.position.y = 0;

		this.createFieldOfstalagmite();
	}
	/**
	 *
	 */
	createFieldOfstalagmite() {
		let x, y, stalagmite, posX, posY;

		if(this.stalagmiteNumber === 0) return;

		for (let i = 0; i < this.stalagmiteNumber; i++) {
			x = Math.round(Math.random() * (4 - 1) + 1);
			y = Math.round(Math.random() * (4 - 1) + 1);
			if (this.stalagmites[x][y] == undefined) {
				stalagmite = this.createstalagmite();
				posX = (x - (this.stalagmites.length / 2)) * 30 + (Math.cos(Math.random() * Math.PI) * 10);
				posY = (y - (this.stalagmites.length / 2)) * 30 + (Math.sin(Math.random() * Math.PI) * 10);
				stalagmite.position.set(posX, posY, 0);
				this.stalagmites[x][y] = stalagmite;
				this.mesh.add(stalagmite);
			}
		}
	}

	/**
	 *
	 * @returns {THREE.Mesh}
	 */
	createstalagmite() {
		let radius, height;

		radius = Helpers.randFloat(this.radius.min, this.radius.max);
		height = Helpers.randFloat(this.height.min, this.height.max);

		let geom = new THREE.ConeBufferGeometry( radius, height, this.segments );

		let mat = new THREE.MeshLambertMaterial({color: '#720300'});

		let stalagmite = new THREE.Mesh(geom, mat);

		stalagmite.rotation.x = Math.PI / 180 * 90;

		stalagmite.name = "stalagmite";

		objectToInteractCollection.push(stalagmite);

		return stalagmite;
	}
}