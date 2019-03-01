export default class Character {
	constructor(color = 'red') {
		this.color = color;
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
		this.movementVelocity = .1;
		this.rotationVelocity = .06;
		this.limit = 16 / 2;
		this.lastPos = {
			x: 0,
			z: 0,
		};
		this.dir = {
			x: false,
			z: false,
		};

		this.positionOnMap = 4;

		this.init();
	}

	init() {
		this.generateCharacter();
	}

	update() {

		if (this.direction.left.forward) {
			this.mesh.rotation.y += this.rotationVelocity;
		}
		if (this.direction.right.forward) {
			this.mesh.rotation.y -= this.rotationVelocity;
		}
		if (this.direction.down.forward) {
			this.mesh.position.z += Math.cos(this.mesh.rotation.y) * this.movementVelocity;
			this.mesh.position.x += Math.sin(this.mesh.rotation.y) * this.movementVelocity;
		}
		if (this.direction.up.forward) {
			this.mesh.position.z -= Math.cos(this.mesh.rotation.y) * this.movementVelocity;
			this.mesh.position.x -= Math.sin(this.mesh.rotation.y) * this.movementVelocity;
		}
		if(this.direction.goLeft.forward) {
			this.mesh.position.z -= Math.cos(this.mesh.rotation.y + 90 * Math.PI / 180) * this.movementVelocity;
			this.mesh.position.x -= Math.sin(this.mesh.rotation.y + 90 * Math.PI / 180) * this.movementVelocity;
		}
		if(this.direction.goRight.forward) {
			this.mesh.position.z -= Math.cos(this.mesh.rotation.y - 90 * Math.PI / 180) * this.movementVelocity;
			this.mesh.position.x -= Math.sin(this.mesh.rotation.y - 90 * Math.PI / 180) * this.movementVelocity;
		}

		this.checkDirection();
	}

	generateCharacter() {
		this.mesh = new THREE.Object3D();
		this.mesh.position.y = 0.5;

		this.createBody();
		this.createHead();

		this.controls();
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

	controls() {
		document.addEventListener('keypress', (e) => {
			if (e.key === 'q' || e.key === 'ArrowLeft' ) {
				this.direction.left.forward = true;
				this.direction.left.keydown = true;

				this.direction.right.forward = false;
			}
			if (e.key === 'd' || e.key === 'ArrowRight') {
				this.direction.right.forward = true;
				this.direction.right.keydown = true;

				this.direction.left.forward = false;
			}
			if(e.key === 'z' || e.key === 'ArrowUp'){
				this.direction.up.forward = true;
				this.direction.up.keydown = true;

				this.direction.down.forward = false;
			}
			if(e.key === 's' || e.key === 'ArrowDown'){
				this.direction.down.forward = true;
				this.direction.down.keydown = true;

				this.direction.up.forward = false;
			}
			if(e.key === 'a'){
				this.direction.goLeft.forward = true;
				this.direction.goLeft.keydown = true;

				this.direction.goRight.forward = false;
			}

			if(e.key === 'e'){
				this.direction.goRight.forward = true;
				this.direction.goRight.keydown = true;

				this.direction.goLeft.forward = false;
			}
		});
		document.addEventListener('keyup', (e) => {
			if (e.key === 'q' || e.key === 'ArrowLeft') {
				this.direction.left.forward = false;
				this.direction.left.keydown = false;

				if(this.direction.right.keydown) this.direction.right.forward = true;
			}
			if (e.key === 'd' || e.key === 'ArrowRight') {
				this.direction.right.forward = false;
				this.direction.right.keydown = false;

				if(this.direction.left.keydown) this.direction.left.forward = true;
			}
			if(e.key === 'z' || e.key === 'ArrowUp'){
				this.direction.up.forward = false;
				this.direction.up.keydown = false;

				if(this.direction.down.keydown) this.direction.down.forward = true;
			}
			if(e.key === 's' || e.key === 'ArrowDown'){
				this.direction.down.forward = false;
				this.direction.down.keydown = false;

				if(this.direction.up.keydown) this.direction.up.forward = true;
			}

			if(e.key === 'a'){
				this.direction.goLeft.forward = false;
				this.direction.goLeft.keydown = false;

				if(this.direction.goRight.keydown) this.direction.goRight.forward = true;
			}

			if(e.key === 'e'){
				this.direction.goRight.forward = false;
				this.direction.goRight.keydown = false;

				if(this.direction.goLeft.keydown) this.direction.goLeft.forward = true;
			}
		})
	}

	/**
	 * @desc if dirX == true : going right, if dirZ == true : going down
	 * @returns {{dirX: boolean, dirZ: boolean}}
	 */
	checkDirection() {
		this.dir.x = this.mesh.position.x > this.lastPos.x;
		this.dir.z = this.mesh.position.z > this.lastPos.z;
	}
}