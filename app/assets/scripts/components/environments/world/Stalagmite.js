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
				for (let i = 0; i < 5; i++) {
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
						break;
					}
				}
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

		let geom = new THREE.ConeGeometry( radius, height, this.segments );

		let mat = new Materials({
			state: window.playerState.playerStateNumber,
			texture: 'stalagmite'
		}).material;

		let stalagmite = new THREE.Mesh(geom, mat);

		stalagmite.rotation.y = Math.PI / 180 * 90;

		stalagmite.name = "stalagmite";

		let verts = stalagmite.geometry.vertices, ang, amp;

		for (let i = 0; i < verts.length; i++) {
			let v = verts[i];

			ang = Math.random() * Math.PI;
			amp = 0.8;

			v.x += Math.cos(ang) * amp;
			v.y += Math.sin(ang) * amp;
		}

		objectToInteractCollection.push(stalagmite);

		return stalagmite;
	}
}