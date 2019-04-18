import 'three/examples/js/loaders/OBJLoader';
import CANNON from "cannon";
import Normal from "../Anger/template/Normal";

class Coral {
	constructor(groundID, coord, coralNumber) {
		this.coralNumber = coralNumber;

		this.groundID = groundID;
		this.coord = coord;

		this.loader = new THREE.OBJLoader();
		this.manager = new THREE.LoadingManager();

		this.corals = [];
		for(let x = 0; x < 5;x++){
			this.corals[x] = [];
		}

		this.init();
	}

	init() {
		return new Promise(async resolve => {
			await this.loadObj();
			await this.createFieldOfCoral();
			resolve();
		})
	}
	/**
	 *
	 */
	createFieldOfCoral() {
		return new Promise(async resolve => {
			let x, y, coral, posX, posY;

			for (let i = 0; i < this.coralNumber; i++) {
				x = Math.round(Math.random() * (4 - 1) + 1);
				y = Math.round(Math.random() * (4 - 1) + 1);
				if (this.corals[x][y] == undefined) {
					coral = this.createCoral();
					posX = (x - (this.corals.length / 2)) * 30 + (Math.cos(Math.random() * Math.PI) * 10) + this.coord.x;
					posY = (y - (this.corals.length / 2)) * 30 + (Math.sin(Math.random() * Math.PI) * 10) + this.coord.y;
					coral.position.set(posX, 0, posY);
					this.corals[x][y] = coral;
					window.grounds[this.groundID].objects.push(coral);
				}
			}
			resolve();
		});

	}

	/**
	 *
	 * @returns {THREE.Mesh}
	 */
	createCoral() {
		let coral = this.obj.clone();
		coral.name = "coral";
		objectToInteractCollection.push(coral);

		return coral;
	}

	loadObj() {
		return new Promise(resolve => {
			this.loader.load(
				// resource URL
				"/app/assets/obj/coral_test.obj",

				// onLoad callback
				// Here the loaded data is assumed to be an object
				obj => {
					// Add the loaded object to the scene
					this.obj = obj;
					resolve();
				},

				// onProgress callback
				xhr => {
					//console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
				},

				// onError callback
				err => {
					//console.error( 'An error happened' );
				}
			);
		});
	}
}

const coral = {
	wait(number, coord, coralNumber) {
		return new Promise(async resolve => {
			const newCoral = new Coral(number, coord, coralNumber);
			await newCoral.init();
			resolve();
		});
	}
};

export default coral;