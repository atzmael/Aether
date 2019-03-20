/**
 * General import
 **/

// Libs
import 'three/examples/js/controls/OrbitControls';

// Modules

import SimplexNoise from 'simplex-noise';
import dat from 'dat.gui';

// Utilities files

import * as Helpers from './helpers';

// Global vars
window.RATIO = 0.1;

// Game files
import Character from './Player/Character';
import Ground from './World/Ground';
import Normal from './World/template/Normal';
import River from './World/template/River';

// Stats
import Stats from 'stats.js';

let stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Vars

//settings
var pixelRatio = window.devicePixelRatio >= 2 ? 2 : window.devicePixelRatio;
var ANTIALIAS = false;

// collection of objects

window.usedTemplateCollection = [];

window.templateCollection = {
	normal: [],
	rivers: [],
};

window.playerState = 2;

window.chunkSize = 100;

// App

export default class App {

	constructor() {

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.z = 0;
		this.camera.position.y = 2;
		this.camera.rotation.x = Math.PI / 180 * -22.5;

		// Vars
		this.playerPositionThrottle = true;

		// Init

		this.init();

		// Noise
		this.noise = new SimplexNoise(Math.random());

		// Floor
		this.character = new Character();
		this.character.mesh.add(this.camera);
		this.scene.add(this.character.mesh);

		this.floor = new Ground();
		this.scene.add(this.floor.mesh);

		// Light
		let ambientLight = new THREE.AmbientLight(0x404040, 4);
		//this.scene.add(ambientLight);

		var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		light.position.set(0,100,-10);
		this.scene.add( light );

		console.log(this.scene);

		// Gui init
		this.guiHandler();


		this.update();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	update() {
		stats.begin();

		requestAnimationFrame(this.update.bind(this));

		// Code goes there

		this.character.update();

		//this.camera.position.z -= 0.1;

		this.groundUpdate();

		this.render();

		stats.end();
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	init() {
		this.initScene();
		this.helpers();
	}

	initScene() {
		this.container = document.querySelector('#main');
		document.body.appendChild(this.container);

		this.scene = new THREE.Scene();

		this.scene.fog = new THREE.Fog('#ffefce', 1, 200);

		this.renderer = new THREE.WebGLRenderer({antialias: ANTIALIAS});

		// Handle shadow, reduce perf
		//this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		//this.renderer.shadowMap.enabled = true;

		this.renderer.setPixelRatio(pixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.container.appendChild(this.renderer.domElement);

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		this.onWindowResize();
	}

	helpers() {
		var size = 30;
		var divisions = 10;

		var gridHelper = new THREE.GridHelper(size, divisions);
		//this.scene.add(gridHelper);
	}

	groundUpdate() {
		if (this.playerPositionThrottle) {
			this.playerPositionThrottle = false;

			let limitLeft, limitRight, limitTop, limitBottom,
				characterX, characterZ,
				activeCase, changeZone = 2,
				newX, newZ,
				isLastRiver = false,
				isNewRiver = false,
				newTemplate;


			this.floor.pieces.piece.forEach((elmt, i) => {

				// Character position
				characterX = this.character.mesh.position.x;
				characterZ = this.character.mesh.position.z;

				// Current chunk limits
				limitLeft = elmt.mesh.position.x - this.floor.size / 2;
				limitTop = elmt.mesh.position.z - this.floor.size / 2;
				limitRight = elmt.mesh.position.x + this.floor.size / 2;
				limitBottom = elmt.mesh.position.z + this.floor.size / 2;

				// If player is in the chunk
				if (limitLeft < characterX &&
					characterX < limitRight &&
					limitTop < characterZ &&
					characterZ < limitBottom) {
					activeCase = elmt.id;

					// If current chunk is not equals to the player current chunk ID
					if (activeCase != this.character.positionOnMap) {

						// If current chunk pos X is not equals to the last chunk pos X
						if (this.floor.pieces.piece[activeCase].mesh.position.x != this.floor.pieces.piece[this.character.positionOnMap].mesh.position.x) {

							// If current chunk pos X minus last chunk pos X is superior to 0
							// This mean that character is going to right
							// Else you are going to left
							if (this.floor.pieces.piece[activeCase].mesh.position.x - this.floor.pieces.piece[this.character.positionOnMap].mesh.position.x > 0) {
								this.floor.pieces.piece.forEach((elmt2, i) => {

									// If current chunk pos X is inferior to last chunk pos X
									// Move his position to the right
									if (elmt2.mesh.position.x < this.floor.pieces.piece[this.character.positionOnMap].mesh.position.x) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.mesh.position.x);

										// Move the chunk to his new position
										elmt2.mesh.position.x = this.floor.pieces.piece[elmt.id].mesh.position.x + this.floor.size;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.mesh.position.x);

										// if one of them is not a river
										if(!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if(!isNewRiver) {
												// Remove the template
												elmt2.mesh.remove(elmt2.mesh.children[1]);
												newTemplate = new Normal().mesh;
												elmt2.mesh.add(newTemplate);
												elmt2.template.name = 'template-normal';
												elmt2.template.id = 0;
												elmt2.template.object = newTemplate;
											} else {
												elmt2.mesh.remove(this.scene.getObjectById(elmt2.template.object.id));
												newTemplate = new River().mesh;
												elmt2.mesh.add(newTemplate);
												elmt2.template.name = 'template-river';
												elmt2.template.id = 1;
												elmt2.template.object = newTemplate;
											}
										}else {
											elmt2.mesh.remove(this.scene.getObjectById(elmt2.template.object.id));
											newTemplate = new River().mesh;
											elmt2.mesh.add(newTemplate);
											elmt2.template.name = 'template-river';
											elmt2.template.id = 1;
											elmt2.template.object = newTemplate;
										}
									}
								});
								this.character.positionOnMap = activeCase;
							} else {
								this.floor.pieces.piece.forEach((elmt2, i) => {

									// If current chunk pos X is superior to last chunk pos X
									// Move his position to the left
									if (elmt2.mesh.position.x > this.floor.pieces.piece[this.character.positionOnMap].mesh.position.x) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.mesh.position.x);

										// Move the chunk to his new position
										elmt2.mesh.position.x = this.floor.pieces.piece[activeCase].mesh.position.x - this.floor.size;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.mesh.position.x);

										// if one of them is not a river
										if(!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if(!isNewRiver) {
												// Remove the template
												elmt2.mesh.remove(elmt2.mesh.children[1]);
												newTemplate = new Normal().mesh;
												elmt2.mesh.add(newTemplate);
												elmt2.template.name = 'template-normal';
												elmt2.template.id = 0;
												elmt2.template.object = newTemplate;
											} else {
												elmt2.mesh.remove(this.scene.getObjectById(elmt2.template.object.id));
												newTemplate = new River().mesh;
												elmt2.mesh.add(newTemplate);
												elmt2.template.name = 'template-river';
												elmt2.template.id = 1;
												elmt2.template.object = newTemplate;
											}
										}else {
											elmt2.mesh.remove(this.scene.getObjectById(elmt2.template.object.id));
											newTemplate = new River().mesh;
											elmt2.mesh.add(newTemplate);
											elmt2.template.name = 'template-river';
											elmt2.template.id = 1;
											elmt2.template.object = newTemplate;
										}

									}
								});
								this.character.positionOnMap = activeCase;
							}
						}

						if (this.floor.pieces.piece[activeCase].mesh.position.z != this.floor.pieces.piece[this.character.positionOnMap].mesh.position.z) {
							if (this.floor.pieces.piece[activeCase].mesh.position.z - this.floor.pieces.piece[this.character.positionOnMap].mesh.position.z > 0) {
								this.floor.pieces.piece.forEach((elmt2, i) => {
									if (elmt2.mesh.position.z < this.floor.pieces.piece[this.character.positionOnMap].mesh.position.z) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.mesh.position.x);

										// Move the chunk to his new position
										elmt2.mesh.position.z = this.floor.pieces.piece[activeCase].mesh.position.z + this.floor.size;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.mesh.position.x);

										// if one of them is not a river
										if(!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if(!isNewRiver) {
												// Remove the template
												elmt2.mesh.remove(elmt2.mesh.children[1]);
												newTemplate = new Normal().mesh;
												elmt2.mesh.add(newTemplate);
												elmt2.template.name = 'template-normal';
												elmt2.template.id = 0;
												elmt2.template.object = newTemplate;
											} else {
												elmt2.mesh.remove(this.scene.getObjectById(elmt2.template.object.id));
												newTemplate = new River().mesh;
												elmt2.mesh.add(newTemplate);
												elmt2.template.name = 'template-river';
												elmt2.template.id = 1;
												elmt2.template.object = newTemplate;
											}
										}else {
											elmt2.mesh.remove(this.scene.getObjectById(elmt2.template.object.id));
											newTemplate = new River().mesh;
											elmt2.mesh.add(newTemplate);
											elmt2.template.name = 'template-river';
											elmt2.template.id = 1;
											elmt2.template.object = newTemplate;
										}
									}
								});
								this.character.positionOnMap = activeCase;

							} else {
								this.floor.pieces.piece.forEach((elmt2, i) => {
									if (elmt2.mesh.position.z > this.floor.pieces.piece[this.character.positionOnMap].mesh.position.z) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.mesh.position.x);

										// Move the chunk to his new position
										elmt2.mesh.position.z = this.floor.pieces.piece[activeCase].mesh.position.z - this.floor.size;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.mesh.position.x);

										// if one of them is not a river
										if(!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if(!isNewRiver) {
												// Remove the template
												elmt2.mesh.remove(elmt2.mesh.children[1]);
												newTemplate = new Normal().mesh;
												elmt2.mesh.add(newTemplate);
												elmt2.template.name = 'template-normal';
												elmt2.template.id = 0;
												elmt2.template.object = newTemplate;
											} else {
												elmt2.mesh.remove(this.scene.getObjectById(elmt2.template.object.id));
												newTemplate = new River().mesh;
												elmt2.mesh.add(newTemplate);
												elmt2.template.name = 'template-river';
												elmt2.template.id = 1;
												elmt2.template.object = newTemplate;
											}
										}else {
											elmt2.mesh.remove(this.scene.getObjectById(elmt2.template.object.id));
											newTemplate = new River().mesh;
											elmt2.mesh.add(newTemplate);
											elmt2.template.name = 'template-river';
											elmt2.template.id = 1;
											elmt2.template.object = newTemplate;
										}
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

	guiHandler() {
		const gui = new dat.GUI();

		let player = gui.addFolder("Player");
		player.open();

		player.add(this.character, 'movementVelocity', 0.1, 2);
	}

	checkChunkTemplate(coord) {
		return (coord < -chunkSize / 2 && coord > -chunkSize * 1.5)
	}
}