import Helpers from "../helpers";

export default class Coral {
	constructor(coralNumber = 1, amp = 0.5) {
		this.branchNumber = Helpers.rand(3, 5);
		console.log(this.branchNumber);
		this.coralNumber = coralNumber;

		this.corals = [];
		for (let x = 0; x < 5; x++) {
			this.corals[x] = [];
		}

		this.init();
	}

	init() {
		this.mesh = new THREE.Object3D();
		this.mesh.name = "coral-field";
		this.mesh.position.y = 0;

		//this.createFieldOfCorals();

		console.log(this.mesh);

		var size = 2; // thickness
		var material = new THREE.MeshPhongMaterial({ color: 0x555555 }); // material
		var children = 2;  // branches

		var sizeModifier = .6;
		this.branchPivots = [];

		var tree = this.createBranch(size, material, children, false, sizeModifier);
		tree.branchPivots = this.branchPivots;
		tree.rotation.x = Math.PI / 180 + 90;
		this.mesh.add(tree);
	}

	/**
	 *
	 */

	/*
	createFieldOfCorals() {
		let x, y, coral, posX, posY;

		for (let i = 0; i < this.coralNumber; i++) {
			x = Math.round(Math.random() * (4 - 1) + 1);
			y = Math.round(Math.random() * (4 - 1) + 1);
			if (this.corals[x][y] == undefined) {
				coral = this.createcoral();
				//posX = (x - (this.corals.length / 2)) * 30 + (Math.cos(Math.random() * Math.PI) * 20);
				//posY = (y - (this.corals.length / 2)) * 30 + (Math.sin(Math.random() * Math.PI) * 20);
				coral.position.set(0, -5, 1);
				this.corals[x][y] = coral;
				this.mesh.add(coral);
			}
		}
	}
	*/

	/**
	 *
	 * @returns {THREE.Mesh}
	 */
	/*
	createcoral() {
		let coral = new THREE.Object3D(), segNumber = 8, branchRadius = 0.3, branchHeight = 1;
		let geom, mat = new THREE.MeshLambertMaterial( {color: '#ed6a6c'} ), branch, alpha = 0;
		let posX = 0, posY = 0, posZ = 0;
		for(let i = 0; i < this.branchNumber; i ++) {
			branchRadius -= i / 30;
			if(i == 0) {
				geom = new THREE.CylinderBufferGeometry( branchRadius, branchRadius, branchHeight, segNumber );

				posX = Math.cos(alpha);
			}else {
				geom = new THREE.CylinderBufferGeometry( branchRadius, branchRadius, branchHeight, segNumber );
				alpha = Helpers.rand(-45, 45) * Math.PI / 180;

				posX = Math.cos(alpha);
			}
			branch = new THREE.Mesh( geom, mat );
			branch.name = 'coral-branch';

			branch.rotation.x = alpha;
			branch.rotation.z = alpha;
			branch.position.x = posX;
			branch.position.y = posY;
			branch.position.z = posZ;

			posY = branch.position.y + branchHeight;
			posZ = Math.sin(alpha);

			coral.add(branch);
		}
		coral.rotation.x = Math.PI / 180 * 90;
		coral.name = "coral";

		objectToInteractCollection.push(coral);

		return coral;
	}
	*/

	// Recursive branch function
	createBranch (size, material, children, isChild, sizeModifier) {
		var branchPivot = new THREE.Object3D();
		var branchEnd = new THREE.Object3D();

		this.branchPivots.push(branchPivot);

		var length = 5;

		if (children == 0) { var endSize = 0; } else { var endSize = size * sizeModifier; }

		var branch = new THREE.Mesh(new THREE.CylinderGeometry(endSize, size, length, 5, 1, true), material);

		branchPivot.add(branch);
		branch.add(branchEnd);

		branch.position.y = length / 2;
		branchEnd.position.y = length / 2 - size * .4;

		if (isChild) {
			branchPivot.rotation.z += Math.random() * 1.5 - sizeModifier * 1.05;
			branchPivot.rotation.x += Math.random() * 1.5 - sizeModifier * 1.05;
		} else {
			branch.castShadow = true;
			branch.receiveShadow = true;

			branchPivot.rotation.z += Math.random() * .1 - .05;
			branchPivot.rotation.x += Math.random() * .1 - .05;
		}

		if (children > 0) {
			for (var c=0; c<children; c++) {
				var child = this.createBranch(size * sizeModifier, material, children - 1, true, sizeModifier);
				branchEnd.add(child);
			}
		}

		return branchPivot;
	}
}