// Ground elements import
import Normal from '../emotions/anger/template/Normal';
import River from '../emotions/anger/template/River';
import Materials from '../world/Materials';
import Simplex from 'simplex-noise'

class Ground {
	constructor(size = chunkSize, segments = 32, amp = 0.5) {
		this.size = size;
		this.segments = segments;
		this.amp = amp;
		this.mapNumber = 9;

		this.pieces = {
			size: this.size,
			piece: []
		};

		this.uniforms = {
			time: {
				value: 0
			},
			mouse: {
				value: {
					x: 0,
					y: 0,
					z: 0
				}
			},
			size: {
				value: 300
			}
		};
	}

	init() {
		return new Promise(async resolve => {
			await this.createGround();
			resolve();
		})
	}

	/**
	 *
	 * @param color
	 * @returns {THREE.Mesh}
	 */
	createPiece(isNormal = true, color = '#b32b00') {
		
		let simplex = new Simplex()

		let uniforms = this.uniforms;
		
		let geom = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);

		let mat = null;
		if (isNormal) {
			// console.log(geom.vertices)
			for (var i = 0; i < geom.vertices.length; i++) {
				if (geom.vertices[i].x != -50) {
					if (geom.vertices[i].x != 0) {
						if (geom.vertices[i].x != 50) {
							if (geom.vertices[i].y != -50) {
								if (geom.vertices[i].y != 0) {
									if (geom.vertices[i].y != 50) {
										let noise = simplex.noise2D(geom.vertices[i].x, geom.vertices[i].y)
										geom.vertices[i].z += Math.sin(noise) * 1.25;
										geom.vertices[i]._myZ = geom.vertices[i].z;
									}
								}
							}
						}
					}
				}
			}
			mat = new Materials({
				state: playerState.playerStateNumber,
				texture: 'sand'
			}).material;
		} else {
			for (var i = 0; i < geom.vertices.length; i++) {
				if (geom.vertices[i].x != -50) {
					if (geom.vertices[i].x != 0) {
						if (geom.vertices[i].x != 50) {
							if (geom.vertices[i].y != -50) {
								if (geom.vertices[i].y != 0) {
									if (geom.vertices[i].y != 50) {
										let noise = simplex.noise2D(geom.vertices[i].x, geom.vertices[i].y)
										geom.vertices[i].z += Math.sin(noise) * 0.25;
										geom.vertices[i]._myZ = geom.vertices[i].z;
									}
								}
							}
						}
					}
				}
			}
			mat = new Materials({
				state: playerState.playerStateNumber,
				texture: 'lava'
			}).material;
		};
		let ground = new THREE.Mesh(geom, mat);
		ground.geometry.verticesNeedUpdate = true;
		ground.geometry.normalsNeedUpdate = true;

		ground.name = "chunk";

		// Utility, debug purpose only
		let edges = new THREE.EdgesGeometry(geom);
		let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 'red'}));
		//ground.add(line);
		// Utilities

		ground.rotation.x = Math.PI / 180 * -90;
		ground.position.y = 0;

		return ground;
	}

	/**
	 *
	 */
	createGround() {
		return new Promise(async resolve => {
			let piece, template, templateID, templateName, posChunkX, posChunkZ;
			let piecesNumber = 0;
			let row = Math.sqrt(this.mapNumber);
			for (let x = 0; x < row; x++) {
				for (let y = 0; y < row; y++) {
					posChunkX = x * this.size - ((this.size * 3) / 2) + (this.size / 2);
					posChunkZ = y * this.size - ((this.size * 3) / 2) + (this.size / 2);

					window.grounds.push(
						{
							id: piecesNumber,
							elmt: undefined,
							posX: posChunkX,
							posZ: posChunkZ,
							objects: [],
							corals: [],
							unusedCorals: [],
						}
					);

					if (!this.checkChunkTemplate(posChunkX)) {
						await this.loadNormalTemplate(piecesNumber, posChunkX, posChunkZ, true);
						piece = this.createPiece(true);
					} else {
						await this.loadRiverTemplate(piecesNumber, posChunkX, posChunkZ, true);
						piece = this.createPiece(false, COLORS.blue);
					}

					piece.position.x = posChunkX;
					piece.position.z = posChunkZ;
					piece.position.y = -1;

					window.grounds[piecesNumber].elmt = piece;

					piecesNumber++;
				}
			}
			resolve();
		});
	}

	checkChunkTemplate(coord) {
		return (coord < -chunkSize / 2 && coord > -chunkSize * 1.5)
	}

	loadNormalTemplate(piecesNumber, posChunkX, posChunkZ, isInit) {
		return new Promise(async resolve => {
			await Normal.wait(piecesNumber, {x: posChunkX, y: posChunkZ}, isInit);
			resolve();
		})
	}

	loadRiverTemplate(piecesNumber, posChunkX, posChunkZ, isInit) {
		return new Promise(async resolve => {
			await River.wait(piecesNumber, {x: posChunkX, y: posChunkZ}, isInit);
			resolve();
		})
	}
}


const ground = {
	wait() {
		return new Promise(async resolve => {
			const newGround = new Ground();
			await newGround.init();
			resolve();
		});
	}
};

export default ground;