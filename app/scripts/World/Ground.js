export default class Ground {
	constructor(size = 100, segments = 1, amp = 0.5) {
		this.size = size;
		this.segments = segments;
		this.amp = amp;
		this.mapNumber = 9;

		this.pieces = {
			size: this.size,
			array: []
		};

		this.init();
	}

	init() {
		this.mesh = new THREE.Object3D();
		this.mesh.position.y = - 1;

		this.createGround();
	}

	createPiece() {
		let geom = new THREE.PlaneBufferGeometry(this.size, this.size, this.segments, this.segments);
		let mat = new THREE.MeshBasicMaterial({color: '#e8cab2'});

		let ground = new THREE.Mesh(geom, mat);

		// Utility, debug purpose only
		let edges = new THREE.EdgesGeometry( geom );
		let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 'red' } ) );
		ground.add(line);
		// Utilities

		ground.rotation.x = Math.PI / 180 * -90;
		ground.position.y = 0;

		this.mesh.add(ground);
		return ground;
	}

	createGround() {
		let piece;
		let piecesNumber = 0;
		let row = Math.sqrt(this.mapNumber);
		for(let x = 0;x < row; x++) {
			for(let y = 0;y < row; y++) {
				piece = this.createPiece();
				piece.position.x = x * this.size - (this.size * 3) / 2 + this.size / 2;
				piece.position.z = y * this.size - (this.size * 3) / 2 + this.size / 2;
				this.pieces.array.push({
					mesh: piece,
					id: piecesNumber,
				});
				piecesNumber++;
			}
		}
	}
}