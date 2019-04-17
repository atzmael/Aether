/**
 * General import
 **/

// Libs
import 'three/examples/js/controls/OrbitControls';

// Modules

import SimplexNoise from 'simplex-noise';
import dat from 'dat.gui';
import CANNON from 'cannon';

// Utilities files

import * as Helpers from '../helpers';

// Global vars
window.RATIO = 0.1;

// collection of objects

window.objectToInteractCollection = [];

window.playerState = 2;
window.playerHitBox = 12;

window.statesScore = require('../json/states');

window.scoreObjectDestroyed = playerState;

window.chunkSize = 100;

window.COLORS = {
	blue: '#0c3191',
	orange: '#b32b00'
}

window.grounds = [];

// Game files
import Character from '../Player/Character';
import Ground from '../World/Ground';
import Normal from './template/Normal';
import River from './template/River';

// Stats
import Stats from 'stats.js';

let stats = new Stats();
stats.showPanel(0);

// Vars

//settings
var pixelRatio = window.devicePixelRatio >= 2 ? 2 : window.devicePixelRatio;
var ANTIALIAS = false;

// App

export default class Anger {

	constructor() {

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.z = 0;
		this.camera.position.y = 2;
		this.camera.rotation.x = Math.PI / 180 * -15;

		// this.controls = new THREE.OrbitControls(this.camera);
		// this.controls.update();

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
		window.grounds.forEach(ground => {
			this.scene.add(ground.elmt);
			ground.objects.forEach(groundElmt => {
				this.scene.add(groundElmt);
			})
		});

		//this.scene.add(this.floor.mesh);

		// Add physics
		window.grounds.forEach(ground => {
			let plane = new CANNON.Plane();
			let body = new CANNON.Body({ mass: 0 });
			body.addShape(plane);
			body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);
			body.position.set(ground.elmt.position.x, ground.elmt.position.y, ground.elmt.position.z);
			this.world.add(body);
			ground.elmt.body = body;
			ground.objects.forEach(groundObj => {
				let sphere = new CANNON.Sphere(1);
				let body = new CANNON.Body({ mass: 1 });
				body.position.set(groundObj.position.x, groundObj.position.y, groundObj.position.z);
				body.addShape(sphere);
				this.world.add(body);
				groundObj.body = body;
			})
		});

		// Light
		let ambientLight = new THREE.AmbientLight(0x404040, 4);
		//this.scene.add(ambientLight);

		var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		light.position.set(0, 100, -10);
		this.scene.add(light);

		// Gui init
		this.guiHandler();

		// Debug things


		// First call update
		this.update();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	update(dt) {
		stats.begin();

		requestAnimationFrame(this.update.bind(this));

		// this.controls.update();
		
		this.physicsUpdate();

		// Link physics
		window.grounds.forEach(ground => {
			ground.elmt.position.copy(ground.elmt.body.position);
			ground.elmt.quaternion.copy(ground.elmt.body.quaternion);
			ground.objects.forEach(groundObj => {
				groundObj.position.copy(groundObj.body.position);
				groundObj.quaternion.copy(groundObj.body.quaternion);
			})
		});

		// Update du personnage
		this.character.update();

		//this.camera.position.z -= 0.1;

		this.groundUpdate();

		this.raycaster.setFromCamera(this.mouse, this.camera);

		// calculate objects intersecting the picking ray
		this.intersects = this.raycaster.intersectObjects(objectToInteractCollection);

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
		this.initPhysics();
		this.helpers();

		this.displayGraphState();
	}

	initScene() {
		this.container = document.querySelector('#main');
		document.body.appendChild(this.container);

		this.scene = new THREE.Scene();

		//this.scene.fog = new THREE.Fog('#270100', 1, 75);

		this.renderer = new THREE.WebGLRenderer({antialias: ANTIALIAS});

		// Raycasting
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.intersects = [];

		// Handle shadow, reduce perf
		//this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		//this.renderer.shadowMap.enabled = true;

		this.renderer.setPixelRatio(pixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.container.appendChild(this.renderer.domElement);

		// Event listener
		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		window.addEventListener('click', this.userInteractionHandler.bind(this), false);

		this.onWindowResize();
	}

	initPhysics() {
		this.world = new CANNON.World();
		this.world.gravity.set(0, -9, 0);
		this.world.broadphase = new CANNON.NaiveBroadphase();
		this.world.solver.iterations = 5;
		this.world.defaultContactMaterial.contactEquationStiffness = 1e6;
		this.world.defaultContactMaterial.contactEquationRelaxation = 10;
		this.ground = new CANNON.ContactMaterial(new CANNON.Material("groundMaterial"), new CANNON.Material("slipperyMaterial"), {
			friction: .1,
			restitution: .55
		})
		this.world.addContactMaterial(this.ground)
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

			window.grounds.forEach((ground, i) => {

				// Character position
				characterX = this.character.mesh.position.x;
				characterZ = this.character.mesh.position.z;

				// Current chunk limits
				limitLeft = ground.elmt.position.x - this.floor.size / 2;
				limitTop = ground.elmt.position.z - this.floor.size / 2;
				limitRight = ground.elmt.position.x + this.floor.size / 2;
				limitBottom = ground.elmt.position.z + this.floor.size / 2;

				// If player is in the chunk
				if (limitLeft < characterX &&
					characterX < limitRight &&
					limitTop < characterZ &&
					characterZ < limitBottom) {
					activeCase = ground.id;

					// If current chunk is not equals to the player current chunk ID
					if (activeCase != this.character.positionOnMap) {

						console.log('player changed chunk');

						// If current chunk pos X is not equals to the last chunk pos X
						if (ground.elmt.position.x != window.grounds[this.character.positionOnMap].elmt.position.x) {

							console.log('player moved on X');

							// If current chunk pos X minus last chunk pos X is superior to 0
							// This mean that character is going to right
							// Else you are going to left
							if (ground.elmt.position.x - window.grounds[this.character.positionOnMap].elmt.position.x > 0) {

								console.log('player moved on right');

								window.grounds.forEach((elmt2, i) => {
									// If current chunk pos X is inferior to last chunk pos X
									// Move his position to the right
									if (elmt2.elmt.position.x < window.grounds[this.character.positionOnMap].elmt.position.x) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.elmt.position.x);

										// Move the chunk to his new position
										elmt2.elmt.body.position.x = ground.elmt.position.x + this.floor.size;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.elmt.position.x);

										// if one of them is not a river
										if (!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if (!isNewRiver) {
												// Remove the template
												elmt2.objects.forEach((obj) => {
													this.scene.remove(obj);
												});
												elmt2.objects = [];
												new Normal(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
												elmt2.objects.forEach(e => {
													this.addPhysicsObject(e);
													this.scene.add(e);
												});
												elmt2.elmt.material.color.set(0xb32B00);
											} else {
												elmt2.objects.forEach((obj) => {
													this.scene.remove(obj);
												});
												elmt2.objects = [];
												new River(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
												elmt2.objects.forEach(e => {
													this.addPhysicsObject(e);
													this.scene.add(e);
												});
												elmt2.elmt.material.color.set(0x0c3191);
											}
										} else {
											elmt2.objects.forEach((obj) => {
												this.scene.remove(obj);
											});
											elmt2.objects = [];
											new River(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
											elmt2.objects.forEach(e => {
												this.addPhysicsObject(e);
												this.scene.add(e);
											});
										}

									}
								});

								this.character.positionOnMap = activeCase;
							} else {
								window.grounds.forEach((elmt2, i) => {

									// If current chunk pos X is superior to last chunk pos X
									// Move his position to the left
									if (elmt2.elmt.position.x > window.grounds[this.character.positionOnMap].elmt.position.x) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.elmt.position.x);

										// Move the chunk to his new position
										elmt2.elmt.body.position.x = ground.elmt.position.x - this.floor.size;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.elmt.position.x);

										// if one of them is not a river
										if (!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if (!isNewRiver) {
												// Remove the template
												elmt2.objects.forEach((obj) => {
													this.scene.remove(obj);
												});
												elmt2.objects = [];
												new Normal(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
												elmt2.objects.forEach(e => {
													this.addPhysicsObject(e);
													this.scene.add(e);
												});
												elmt2.elmt.material.color.set(0xb32B00);
											} else {
												elmt2.objects.forEach((obj) => {
													this.scene.remove(obj);
												});
												elmt2.objects = [];
												new River(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
												elmt2.objects.forEach(e => {
													this.addPhysicsObject(e);
													this.scene.add(e);
												});
												elmt2.elmt.material.color.set(0x0c3191);
											}
										} else {
											elmt2.objects.forEach((obj) => {
												this.scene.remove(obj);
											});
											elmt2.objects = [];
											new River(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
											elmt2.objects.forEach(e => {
												this.addPhysicsObject(e);
												this.scene.add(e);
											});
										}

									}
								});

								this.character.positionOnMap = activeCase;
							}
						}

						if (ground.elmt.position.z != window.grounds[this.character.positionOnMap].elmt.position.z) {
							if (ground.elmt.position.z - window.grounds[this.character.positionOnMap].elmt.position.z > 0) {
								window.grounds.forEach((elmt2, i) => {
									if (elmt2.elmt.position.z < window.grounds[this.character.positionOnMap].elmt.position.z) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.elmt.position.x);

										// Move the chunk to his new position
										elmt2.elmt.body.position.z = ground.elmt.position.z + this.floor.size;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.elmt.position.x);

										// if one of them is not a river
										if (!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if (!isNewRiver) {
												// Remove the template
												elmt2.objects.forEach((obj) => {
													this.scene.remove(obj);
												});
												elmt2.objects = [];
												new Normal(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
												elmt2.objects.forEach(e => {
													this.addPhysicsObject(e);
													this.scene.add(e);
												});
											} else {
												elmt2.objects.forEach((obj) => {
													this.scene.remove(obj);
												});
												elmt2.objects = [];
												new River(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
												elmt2.objects.forEach(e => {
													this.addPhysicsObject(e);
													this.scene.add(e);
												});
											}
										} else {
											elmt2.objects.forEach((obj) => {
												this.scene.remove(obj);
											});
											elmt2.objects = [];
											new River(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
											elmt2.objects.forEach(e => {
												this.addPhysicsObject(e);
												this.scene.add(e);
											});
										}
									}
								});
								this.character.positionOnMap = activeCase;

							} else {
								window.grounds.forEach((elmt2, i) => {
									if (elmt2.elmt.position.z > window.grounds[this.character.positionOnMap].elmt.position.z) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.elmt.position.x);

										// Move the chunk to his new position
										elmt2.elmt.body.position.z = ground.elmt.position.z - this.floor.size;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.elmt.position.x);

										// if one of them is not a river
										if (!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if (!isNewRiver) {
												// Remove the template
												elmt2.objects.forEach((obj) => {
													this.scene.remove(obj);
												});
												elmt2.objects = [];
												new Normal(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
												elmt2.objects.forEach(e => {
													this.addPhysicsObject(e);
													this.scene.add(e);
												});
											} else {
												elmt2.objects.forEach((obj) => {
													this.scene.remove(obj);
												});
												elmt2.objects = [];
												new River(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
												elmt2.objects.forEach(e => {
													this.addPhysicsObject(e);
													this.scene.add(e);
												});
											}
										} else {
											elmt2.objects.forEach((obj) => {
												this.scene.remove(obj);
											});
											elmt2.objects = [];
											new River(elmt2.id, {x: elmt2.elmt.body.position.x, y: elmt2.elmt.body.position.z});
											elmt2.objects.forEach(e => {
												this.addPhysicsObject(e);
												this.scene.add(e);
											});
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

	physicsUpdate() {
		this.world.step(1/60);
	}

	guiHandler() {
		const gui = new dat.GUI();

		let player = gui.addFolder("Player");
		player.open();

		player.add(this.character, 'movementVelocity', 0.1, 2);

		document.body.appendChild(stats.dom);
	}

	checkChunkTemplate(coord) {
		return (coord < -chunkSize / 2 && coord > -chunkSize * 1.5)
	}

	onMouseMove(event) {

		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components

		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	userInteractionHandler() {
		let id = 0, name = '';

		if (this.intersects.length > 0) {
			let obj, index;
			for (var i = 0; i < this.intersects.length; i++) {

				obj = this.intersects[i];
				id = obj.object.id;
				name = obj.object.name;

				if (obj.distance <= playerHitBox) {

					index = objectToInteractCollection.findIndex(elmt => elmt.id === id);
					objectToInteractCollection.splice(index, 1);
					this.character.mesh.add(obj.object);

					obj.object.body.position.x = 0;
					obj.object.body.position.z = -5;
					obj.object.body.position.y = 0;

					this.character.putObjectInHand(obj.object);

					//TODO: apply physic to throw the object$
				} else {
					//alert(`The object is too far from you, make ${Math.floor(obj.distance - playerHitBox)} more footstep`);
				}
			}
		}
	}

	displayGraphState() {
		let canvas = document.querySelector('.js-graph-canvas'),
			ctx = canvas.getContext('2d'),
			canvasW = canvas.width, canvasH = canvas.height,
			dotCollection = [],
			posX = 0, posY = canvasH / 2,
			lastPosY = 0,
			diff = 0;

		setInterval(() => {
			posY = scoreObjectDestroyed;
			if (posY != lastPosY) {

				posY += diff;

				let dot = new Dot(posX, posY * 10, ctx);
				dot.init();
				dotCollection.push(dot);

				lastPosY = posY;
				posX += 6;
			}
		}, 50);
	}

	updateUserState() {

	}

	addPhysicsObject(groundObj) {
		let sphere = new CANNON.Sphere(1);
		let body = new CANNON.Body({ mass: 1 });
		body.position.set(groundObj.position.x, groundObj.position.y, groundObj.position.z);
		body.addShape(sphere);
		this.world.add(body);
		groundObj.body = body;
	}
}


class Dot {
	constructor(posX, posY, ctx) {
		this.radius = 2;

		this.posX = posX + this.radius;
		this.posY = posY;
		this.ctx = ctx;
	}

	init() {
		this.drawDot();
	}

	drawDot() {
		this.ctx.beginPath();
		this.ctx.fillStyle = 'white';
		this.ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.closePath();
	}
}