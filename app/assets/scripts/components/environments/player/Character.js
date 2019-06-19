export default class Character {
	constructor(color = 'red') {
		this.color = color;

		this.limit = 16 / 2;

		this.playerStrengh = playerState.playerStateNumber * 0.8;

		this.lastPos = {
			x: 0,
			z: 0,
		};
		this.dir = {
			x: false,
			z: false,
		};

		this.vars = {};

		this.positionOnMap = 4;

		this.hasBreath = false;

		this.direction = {
			up: {
				forward: false,
				keydown: false,
			},
			right: {
				forward: false,
				keydown: false,
			},
			down: {
				forward: false,
				keydown: false,
			},
			left: {
				forward: false,
				keydown: false,
			},
			goLeft: {
				forward: false,
				keydown: false,
			},
			goRight: {
				forward: false,
				keydown: false,
			}
		};
		this.movementVelocity = 0.4;
		this.rotationVelocity = .04;

		this.init();
	}

	init() {
		this.generateCharacter();
	}

	generateCharacter() {
		this.mesh = new THREE.Object3D();
		this.mesh.name = "character";
		this.mesh.position.y = 0.5;
		/*
		Hitbox helper
		 */

		/*
		let geometry = new THREE.CircleBufferGeometry(playerHitBox, 32);
		let material = new THREE.MeshBasicMaterial({color: COLORS.orange});
		let hitbox = new THREE.Mesh(geometry, material);

		hitbox.position.y = -1.4;
		hitbox.position.z = 0;
		hitbox.position.x = 0;
		hitbox.rotation.x = Math.PI / 180 * -90;

		let edges = new THREE.EdgesGeometry(geometry);
		let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 'yellow'}));
		hitbox.add(line);

		this.mesh.add(hitbox);
		*/

		this.controls();
	}

	update() {
		this.vars = {
			rotation: {
				y: this.mesh.rotation.y,
			},
			position: {
				x: this.mesh.position.x,
				y: this.mesh.position.y,
				z: this.mesh.position.z,
			}
		};

		if (this.direction.left.forward) {
			this.vars.rotation.y += this.rotationVelocity;
		}
		if (this.direction.right.forward) {
			this.vars.rotation.y -= this.rotationVelocity;
		}
		if (this.direction.down.forward) {
			this.vars.position.z += Math.cos(this.mesh.rotation.y) * this.movementVelocity;
			this.vars.position.x += Math.sin(this.mesh.rotation.y) * this.movementVelocity;
			window.lavaSoundObject.position.z = this.mesh.position.z;
		}
		if (this.direction.up.forward) {
			this.vars.position.z -= Math.cos(this.mesh.rotation.y) * this.movementVelocity;
			this.vars.position.x -= Math.sin(this.mesh.rotation.y) * this.movementVelocity;
			window.lavaSoundObject.position.z = this.mesh.position.z;
		}
		if (this.direction.goLeft.forward) {
			this.vars.position.z -= Math.cos(this.mesh.rotation.y + 90 * Math.PI / 180) * this.movementVelocity;
			this.vars.position.x -= Math.sin(this.mesh.rotation.y + 90 * Math.PI / 180) * this.movementVelocity;
			window.lavaSoundObject.position.z = this.mesh.position.z;
		}
		if (this.direction.goRight.forward) {
			this.vars.position.z -= Math.cos(this.mesh.rotation.y - 90 * Math.PI / 180) * this.movementVelocity;
			this.vars.position.x -= Math.sin(this.mesh.rotation.y - 90 * Math.PI / 180) * this.movementVelocity;
			window.lavaSoundObject.position.z = this.mesh.position.z;
		}

		if ((this.vars.position.x <= -45 && this.vars.position.x >= -165) || (this.vars.position.x >= 145 && this.vars.position.x <= 205)) {
			this.vars.position.x = this.mesh.position.x;
		}
		this.mesh.rotation.y = this.vars.rotation.y;
		this.mesh.position.x = this.vars.position.x;
		this.mesh.position.y = this.vars.position.y;
		this.mesh.position.z = this.vars.position.z;
	}

	controls() {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'q' || e.key === 'ArrowLeft') {
				this.direction.left.forward = true;
				this.direction.left.keydown = true;

				this.direction.right.forward = false;
			} else if (e.key === 'd' || e.key === 'ArrowRight') {
				this.direction.right.forward = true;
				this.direction.right.keydown = true;

				this.direction.left.forward = false;
			} else if (e.key === 'z' || e.key === 'ArrowUp') {
				this.direction.up.forward = true;
				this.direction.up.keydown = true;

				this.direction.down.forward = false;

				clearTimeout(this.breathInterval);
			} else if (e.key === 's' || e.key === 'ArrowDown') {
				this.direction.down.forward = true;
				this.direction.down.keydown = true;

				this.direction.up.forward = false;

				clearTimeout(this.breathInterval);
			} else if (e.key === 'a') {
				this.direction.goLeft.forward = true;
				this.direction.goLeft.keydown = true;

				this.direction.goRight.forward = false;
			} else if (e.key === 'e') {
				this.direction.goRight.forward = true;
				this.direction.goRight.keydown = true;

				this.direction.goLeft.forward = false;
			}
		});
		document.addEventListener('keyup', (e) => {
			if (e.key === 'q' || e.key === 'ArrowLeft') {
				this.direction.left.forward = false;
				this.direction.left.keydown = false;

				if (this.direction.right.keydown) this.direction.right.forward = true;
			} else if (e.key === 'd' || e.key === 'ArrowRight') {
				this.direction.right.forward = false;
				this.direction.right.keydown = false;

				if (this.direction.left.keydown) this.direction.left.forward = true;
			} else if (e.key === 'z' || e.key === 'ArrowUp') {
				this.direction.up.forward = false;
				this.direction.up.keydown = false;

				if (this.direction.down.keydown) this.direction.down.forward = true;
			} else if (e.key === 's' || e.key === 'ArrowDown') {
				this.direction.down.forward = false;
				this.direction.down.keydown = false;

				if (this.direction.up.keydown) this.direction.up.forward = true;
			} else if (e.key === 'a') {
				this.direction.goLeft.forward = false;
				this.direction.goLeft.keydown = false;

				if (this.direction.goRight.keydown) this.direction.goRight.forward = true;
			} else if (e.key === 'e') {
				this.direction.goRight.forward = false;
				this.direction.goRight.keydown = false;

				if (this.direction.goLeft.keydown) this.direction.goLeft.forward = true;
			}
		})

		document.addEventListener('keypress', (e) => {
			if (e.key === 'Spacebar' || e.key == ' ') {
				this.breath();
			}
		})
	}

	createBody() {
		let geom = new THREE.BoxBufferGeometry(0.8, 1, 0.5);
		let mat = new THREE.MeshBasicMaterial({color: this.color});
		let body = new THREE.Mesh(geom, mat);

		this.mesh.add(body);
	}

	createHead() {
		let geom = new THREE.BoxBufferGeometry(0.5, 0.4, 0.6);
		let mat = new THREE.MeshBasicMaterial({color: this.color});
		let head = new THREE.Mesh(geom, mat);

		head.position.y = 0.7;

		this.mesh.add(head);
	}

	createHands() {
		let geom = new THREE.BoxBufferGeometry(0.1, 0.1, 0.5);
		let mat = new THREE.MeshBasicMaterial({color: this.color});
		let handLeft = new THREE.Mesh(geom, mat);
		handLeft.position.x = 0.4;
		handLeft.position.z = 0.2;
		handLeft.position.y = 0.1;

		let handRight = new THREE.Mesh(geom, mat);
		handRight.position.x = -0.4;
		handRight.position.z = 0.2;
		handRight.position.y = 0.1;

		this.mesh.add(handLeft);
		this.mesh.add(handRight);
	}

	createFoot() {
		let geom = new THREE.BoxBufferGeometry(0.2, 0.2, 0.4);
		let mat = new THREE.MeshBasicMaterial({color: this.color});
		let handLeft = new THREE.Mesh(geom, mat);
		handLeft.position.x = 0.4;
		handLeft.position.z = 0.2;
		handLeft.position.y = 0.1;

		let handRight = new THREE.Mesh(geom, mat);
		handRight.position.x = -0.4;
		handRight.position.z = 0.2;
		handRight.position.y = 0.1;

		this.mesh.add(handLeft);
		this.mesh.add(handRight);
	}

	breath() {
		window.soundBank.respiration.play();

		this.breathInterval = setTimeout(() => {

			window.playerState.removeScore(reduce.breath);
			window.soundBank.respiration.stop();
			console.log('end breath');
			clearTimeout(this.breathInterval);
		}, 3000);
	}

	listen() {
		this.hasBreath = false;
	}
}

const reduce = {
	breath: 3.0,
	listen: 0.2
};