// Ground elements import
import Normal from './template/Normal';
import River from './template/River';

export default class Ground {
	constructor(size = chunkSize, segments = 1, amp = 0.5) {
		this.size = size;
		this.segments = segments;
		this.amp = amp;
		this.mapNumber = 9;

		this.pieces = {
			size: this.size,
			piece: []
		};

		this.init();
	}

	init() {
		this.mesh = new THREE.Object3D();
		this.mesh.name = "ground";
		this.mesh.position.y = -1;

		this.createGround();

		console.log(this.mesh);
	}

	/**
	 *
	 * @param color
	 * @returns {THREE.Mesh}
	 */
	createPiece(color = '#e8cab2') {
		let geom = new THREE.PlaneBufferGeometry(this.size, this.size, this.segments, this.segments);
		let mat = new THREE.MeshLambertMaterial({color: color});

		let ground = new THREE.Mesh(geom, mat);

		ground.name = "chunk";

		// Utility, debug purpose only
		let edges = new THREE.EdgesGeometry(geom);
		let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 'red'}));
		ground.add(line);
		// Utilities

		ground.rotation.x = Math.PI / 180 * -90;
		ground.position.y = 0;

		this.mesh.add(ground);

		return ground;
	}

	/**
	 *
	 */
	createGround() {
		let piece, template, templateID, templateName, posChunkX, posChunkZ;
		let piecesNumber = 0;
		let row = Math.sqrt(this.mapNumber);
		for (let x = 0; x < row; x++) {
			for (let y = 0; y < row; y++) {
				posChunkX = x * this.size - (this.size * 3) / 2 + this.size / 2;
				posChunkZ = y * this.size - (this.size * 3) / 2 + this.size / 2;

				if (!this.checkChunkTemplate(posChunkX)) {
					template = new Normal().mesh;
					templateID = 0;
					templateName = "Normal";
					piece = this.createPiece();
				} else {
					template = new River().mesh;
					templateID = 1;
					templateName = "River";
					piece = this.createPiece('#0c3191');
				}

				usedTemplateCollection.push(template);

				piece.position.x = posChunkX;
				piece.position.z = posChunkZ;
				piece.add(template);

				this.pieces.piece.push({
					mesh: piece,
					id: piecesNumber,
					template: {
						id: templateID,
						name: templateName,
						object: template
					}
				});
				piecesNumber++;
			}
		}
	}

	checkChunkTemplate(coord) {
		return (coord < -chunkSize / 2 && coord > -chunkSize * 1.5)
	}
}