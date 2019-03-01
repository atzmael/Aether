/**
 * General import
 **/

// Libs
import 'three/examples/js/controls/OrbitControls';

// Files

import * as Helpers from './helpers';
import Character from './Character';
import Ground from './Ground';

// Declare class

// Vars

// App

export default class App {

	constructor() {

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5);
		this.camera.position.z = 0;
		this.camera.position.y = 0.6;

		this.init();

		// Floor
		this.character = new Character();
		this.character.mesh.add(this.camera);
		this.scene.add(this.character.mesh);

		this.floor = new Ground();
		this.scene.add(this.floor.mesh);

		// Light
		var light = new THREE.DirectionalLight(0xFFFFFF, 1);
		light.castShadow = true;
		var helper = new THREE.DirectionalLightHelper(light, 1);
		this.scene.add(helper);
		light.position.y = 4;
		light.position.x = 0;
		light.position.z = 0;
		this.scene.add(light);

		let axesHelper = new THREE.AxesHelper(5);
		this.character.mesh.add(axesHelper);

		this.update();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.character.update();
		this.isIn();

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.render();
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	init() {
		this.initVars();
		this.initScene();
		this.helpers();
	}

	initVars() {
		this.playerPositionThrottle = true;
	}

	initScene() {
		this.container = document.querySelector('#main');
		document.body.appendChild(this.container);

		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
		this.renderer.shadowMapEnabled = true;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.container.appendChild(this.renderer.domElement);

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		this.onWindowResize();

		this.renderer.animate(this.render.bind(this));
	}

	helpers() {
		var size = 30;
		var divisions = 10;

		var gridHelper = new THREE.GridHelper(size, divisions);
		this.scene.add(gridHelper);
	}

	isIn() {
		if (this.playerPositionThrottle) {
			this.playerPositionThrottle = false;

			let limitLeft, limitRight, limitTop, limitBottom, characterX, characterZ, activeCase, changeZone = 2, newX, newZ;


			this.floor.pieces.array.forEach((elmt, i) => {

				characterX = this.character.mesh.position.x;
				characterZ = this.character.mesh.position.z;
				limitLeft = elmt.mesh.position.x - this.floor.size / 2;
				limitTop = elmt.mesh.position.z - this.floor.size / 2;
				limitRight = elmt.mesh.position.x + this.floor.size / 2;
				limitBottom = elmt.mesh.position.z + this.floor.size / 2;

				if (limitLeft < characterX &&
					characterX < limitRight &&
					limitTop < characterZ &&
					characterZ < limitBottom)
				{
					console.log("You're in :", elmt.id, "character last pos : ", this.character.positionOnMap);
					activeCase = elmt.id;
					if (activeCase != this.character.positionOnMap) {
						if(this.floor.pieces.array[elmt.id].mesh.position.x != this.floor.pieces.array[this.character.positionOnMap].mesh.position.x) {
							if(this.floor.pieces.array[elmt.id].mesh.position.x - this.floor.pieces.array[this.character.positionOnMap].mesh.position.x > 0) {
								this.floor.pieces.array.forEach((elmt2, i) => {
									if(elmt2.mesh.position.x < this.floor.pieces.array[this.character.positionOnMap].mesh.position.x) {
										elmt2.mesh.position.x = this.floor.pieces.array[elmt.id].mesh.position.x + this.floor.size;
									}
								});
								this.character.positionOnMap = activeCase;
							} else {
								this.floor.pieces.array.forEach((elmt2, i) => {
									if(elmt2.mesh.position.x > this.floor.pieces.array[this.character.positionOnMap].mesh.position.x) {
										elmt2.mesh.position.x = this.floor.pieces.array[elmt.id].mesh.position.x - this.floor.size;
									}
								});
								this.character.positionOnMap = activeCase;
							}
						}

						if(this.floor.pieces.array[elmt.id].mesh.position.z != this.floor.pieces.array[this.character.positionOnMap].mesh.position.z) {
							if(this.floor.pieces.array[elmt.id].mesh.position.z - this.floor.pieces.array[this.character.positionOnMap].mesh.position.z > 0) {
								this.floor.pieces.array.forEach((elmt2, i) => {
									if(elmt2.mesh.position.z < this.floor.pieces.array[this.character.positionOnMap].mesh.position.z) {
										elmt2.mesh.position.z = this.floor.pieces.array[elmt.id].mesh.position.z + this.floor.size;
									}
								});
								this.character.positionOnMap = activeCase;

							} else {
								this.floor.pieces.array.forEach((elmt2, i) => {
									console.log(elmt2);
									if(elmt2.mesh.position.z > this.floor.pieces.array[this.character.positionOnMap].mesh.position.z) {
										console.log("I'm in");
										elmt2.mesh.position.z = this.floor.pieces.array[elmt.id].mesh.position.z - this.floor.size;
									}
								});
								this.character.positionOnMap = activeCase;
							}
						}
					}
				}
			});

			let setTimeoutIsIn = setTimeout(() => {
				this.playerPositionThrottle = true;
			}, 100);
		}
	}
}