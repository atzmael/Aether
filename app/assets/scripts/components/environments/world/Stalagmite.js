import Helpers from '../../../core/helpers';
import Materials from '../world/Materials';

export default class Stalagmite {
	constructor(groundID, coord, radius = 1.6, height = 15, segments = 32, stalagmiteNumber = 0, amp = 0.5) {
		this.radius = radius;
		this.height = height;
		this.segments = segments;
		this.stalagmiteNumber = window.helpers.randFloat(stalagmiteNumber.min, stalagmiteNumber.max);

		this.groundID = groundID;
		this.coord = coord;

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
			if (window.grid[this.groundID][x][y] == undefined) {
				stalagmite = this.createstalagmite();
				posX = (x - (window.grid.length / 2)) * 30 + (Math.cos(Math.random() * Math.PI) * 2) + this.coord.x;
				posY = (y - (window.grid.length / 2)) * 30 + (Math.sin(Math.random() * Math.PI) * 2) + this.coord.y;
				stalagmite.position.set(posX, 0, posY);
				window.grid[this.groundID][x][y] = stalagmite;
				this.mesh.add(stalagmite);
				window.grounds[this.groundID].objects.push(stalagmite);
			} else {
				let origin = x;
				do {

					x += 1;

					if (x == origin) {
						y += 1;
						if (y > window.grid[0][0].length - 1) {
							y = 0;
						}
					}

					if (x > window.grid[0].length - 1) {
						x = 0;
					}

				} while (window.grid[this.groundID][x][y] != undefined);

				stalagmite = this.createstalagmite();
				posX = (x - (window.grid.length / 2)) * 30 + (Math.cos(Math.random() * Math.PI) * 2) + this.coord.x;
				posY = (y - (window.grid.length / 2)) * 30 + (Math.sin(Math.random() * Math.PI) * 2) + this.coord.y;
				stalagmite.position.set(posX, 0, posY);
				window.grid[this.groundID][x][y] = stalagmite;
				this.mesh.add(stalagmite);
				window.grounds[this.groundID].objects.push(stalagmite);
			}
		}
	}

	/**
	 *
	 * @returns {THREE.Mesh}
	 */
	createstalagmite() {
		let radius, height;

		radius = window.helpers.randFloat(this.radius.min, this.radius.max);
		height = window.helpers.randFloat(this.height.min, this.height.max);

		let geom = new THREE.ConeBufferGeometry( radius, height, this.segments );

		let mat = new Materials({
			state: playerState.playerStateNumber,
			texture: 'stalagmite'
		}).material;

		let stalagmite = new THREE.Mesh(geom, mat);

		stalagmite.rotation.y = Math.PI / 180 * 90;

		stalagmite.name = "stalagmite";

		objectToInteractCollection.push(stalagmite);

		return stalagmite;
	}
}