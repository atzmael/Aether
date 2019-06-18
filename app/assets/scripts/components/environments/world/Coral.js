import 'three/examples/js/loaders/OBJLoader';

class Coral {
	constructor(groundID, coord, coralMaxNumber, coralCurrentNumber, unused) {
		this.coralMaxNumber = coralMaxNumber;
		this.coralCurrentNumber = coralCurrentNumber;

		this.groundID = groundID;
		this.coord = coord;

		this.unused = unused;

		this.loader = new THREE.OBJLoader();

		this.corals = [];
		for(let x = 0; x < 5;x++){
			this.corals[x] = [];
		}
	}

	init() {
		return new Promise(async resolve => {
			if(!window.coralMeshIsLoaded) {
				await this.loadObj();
			} else {
				this.obj = window.coralMeshIsLoaded.clone();
			}
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

			for (let i = 1; i <= this.coralMaxNumber; i++) {
				x = Math.round(Math.random() * (4 - 1) + 1);
				y = Math.round(Math.random() * (4 - 1) + 1);
				if (this.corals[x][y] == undefined) {
					coral = this.createCoral();
					posX = (x - (this.corals.length / 2)) * 30 + (Math.cos(Math.random() * Math.PI) * 2) + this.coord.x;
					posY = (y - (this.corals.length / 2)) * 30 + (Math.sin(Math.random() * Math.PI) * 2) + this.coord.y;
					coral.position.set(posX, 0, posY);
					this.corals[x][y] = coral;
					if(this.unused || i > this.coralCurrentNumber) {
						window.grounds[this.groundID].unusedCorals.push(coral);
					} else {
						window.grounds[this.groundID].corals.push(coral);
					}
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
				window.DIR + "/assets/medias/meshes/coral.obj",

				// onLoad callback
				// Here the loaded data is assumed to be an object
				obj => {
					// Add the loaded object to the scene
					window.coralMeshIsLoaded = obj;
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
	wait(number, coord, coralNumber, unused = false) {
		return new Promise(async resolve => {
			const newCoral = new Coral(number, coord, coralNumber, unused);
			await newCoral.init();
			resolve();
		});
	}
};

export default coral;