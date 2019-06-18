/**
 * General import
 **/

const DIR = '/app';

window.listener = new THREE.AudioListener();
import Sound from '../../world/Sound';
// Sound init

window.soundHandler = new Sound();
window.soundBank = {};

// Libs
import 'three/examples/js/controls/OrbitControls';

// Modules

import SimplexNoise from 'simplex-noise';
import dat from 'dat.gui';
import CANNON from 'cannon';

// Utilities files

import Helpers from '../../../../core/helpers';
import router from "../../../../layout/navigation/router";
import panel from "../../../../layout/navigation/panel";

// Game files
import Character from '../../player/Character';
import PlayerState from '../../player/PlayerState';
import Ground from '../../world/Ground';
import Normal from './template/Normal';
import River from './template/River';

// Stats
import Stats from 'stats.js';

// Stats init
let stats = new Stats();
stats.showPanel(0);

// Helpers init
window.helpers = new Helpers();

// Player State init
window.playerState = new PlayerState();

window.coralMeshIsLoaded = false;

// collection of objects

window.objectToInteractCollection = [];

window.playerHitBox = 12;

window.statesScore = require('../../../../../datas/states');

window.chunkSize = 100;

window.COLORS = {
	blue: '#0c3191',
	orange: '#b32b00'
}

window.grounds = [];

window.rules = {
	normal: {
		1: {
			stones: {
				number: {
					min: 2,
					max: 5
				},
				radius: 1,
				details: 0,
			},
			rocks: {
				number: {
					min: 1,
					max: 3,
				}
			},
			corals: {
				max: 3,
				current: 3,
			},
			stalagmites: {
				radius: {
					min: 1,
					max: 1.4,
				},
				height: {
					min: 7,
					max: 9,
				},
				segments: 16,
				number: {
					min: 0,
					max: 0,
				},
			},
			geysers: 0,
			bubbles: {
				number: {
					min: 2,
					max: 4
				},
				zPos: {
					min: 1.5,
					max: 3
				},
				radius: {
					min: 0.5,
					max: 0.8
				}
			}
		},
		2: {
			stones: {
				number: {
					min: 8,
					max: 12,
				},
				radius: 1.5,
				details: 0,
			},
			rocks: {
				number: {
					min: 5,
					max: 8,
				}
			},
			corals: {
				max: 3,
				current: 1,
			},
			stalagmites: {
				radius: {
					min: 1,
					max: 1.4,
				},
				height: {
					min: 7,
					max: 9,
				},
				segments: 16,
				number: {
					min: 4,
					max: 6,
				},
			},
			geysers: 0,
			bubbles: {
				number: {
					min: 1,
					max: 3
				},
				zPos: {
					min: 1,
					max: 2
				},
				radius: {
					min: 0.5,
					max: 1.2
				}
			}
		},
		3: {
			stones: {
				number: {
					min: 8,
					max: 12,
				},
				radius: 2.5,
				details: 0,
			},
			rocks: 2,
			corals: {
				max: 3,
				current: 0,
			},
			stalagmites: {
				radius: {
					min: 1.4,
					max: 1.8,
				},
				height: {
					min: 11,
					max: 13,
				},
				segments: 16,
				number: {
					min: 5,
					max: 7,
				},
			},
			geysers: 0,
			bubbles: {
				number: {
					min: 1,
					max: 2
				},
				zPos: {
					min: -0.5,
					max: 0
				},
				radius: {
					min: 2,
					max: 2.2
				}
			}
		}
	},
	river: {
		1: {
			stones: {
				number: {
					min: 2,
					max: 3,
				},
				radius: 1,
				details: 0,
			},
			rocks: {
				number: {
					min: 0,
					max: 0
				}
			},
			corals: {
				max: 0,
				current: 0,
			},
			stalagmites: {
				radius: {
					min: 1,
					max: 1.4,
				},
				height: {
					min: 7,
					max: 9,
				},
				segments: 16,
				number: {
					min: 0,
					max: 0
				},
			},
			geysers: 0,
			bubbles: {
				number: {
					min: 0,
					max: 0
				},
				zPos: {
					min: -0.5,
					max: 0
				},
				radius: {
					min: 2,
					max: 2.2
				}
			}
		},
		2: {
			stones: {
				number: {
					min: 4,
					max: 6,
				},
				radius: 1,
				details: 0,
			},
			rocks: 0,
			corals: {
				max: 3,
				current: 0,
			},
			stalagmites: {
				radius: {
					min: 1,
					max: 1.4,
				},
				height: {
					min: 7,
					max: 9,
				},
				segments: 16,
				number: {
					min: 2,
					max: 3,
				},
			},
			geysers: 0,
			bubbles: {
				number: {
					min: 5,
					max: 8
				},
				zPos: {
					min: 0.3,
					max: 0.4
				},
				radius: {
					min: 0.1,
					max: 0.2
				}
			}
		},
		3: {
			stones: {
				number: {
					min: 5,
					max: 7,
				},
				radius: 1,
				details: 0,
			},
			rocks: 0,
			corals: {
				max: 3,
				current: 0,
			},
			stalagmites: {
				radius: {
					min: 1.4,
					max: 1.8,
				},
				height: {
					min: 11,
					max: 13,
				},
				segments: 16,
				number: {
					min: 3,
					max: 4,
				},
			},
			geysers: 2,
			bubbles: {
				number: {
					min: 7,
					max: 9
				},
				zPos: {
					min: 0.3,
					max: 0.4
				},
				radius: {
					min: 0.1,
					max: 0.2
				}
			}
		}
	}
};

// Vars

//settings
var pixelRatio = window.devicePixelRatio >= 2 ? 2 : window.devicePixelRatio;
var ANTIALIAS = false;

// background
var bgWidth, bgHeight, bgTexture;

// App

export default class Anger {

	constructor() {

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
		this.camera.position.z = 0;
		this.camera.position.y = 2;
		this.camera.rotation.x = Math.PI / 180 * -15;
		this.camera.add(window.listener);

		// this.controls = new THREE.OrbitControls(this.camera);
		// this.controls.update();

		// Vars
		this.playerPositionThrottle = true;

		// Init

		this.init();

		// Noise
		this.noise = new SimplexNoise(Math.random());

		// Light
		let ambientLight = new THREE.AmbientLight(0x404040, 4);
		//this.scene.add(ambientLight);

		var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		light.position.set(0, 100, -10);
		this.scene.add(light);

		// Sound things

		// Debug things

		// Gui init
		this.guiHandler();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	update(dt) {
		stats.begin();

		requestAnimationFrame(this.update.bind(this));

		// this.controls.update();

		// --- TEST ANIMATION D'INTRODUCTION ---//
		// this.test.forEach(stone => {
		// 	stone.position.copy(stone.body.position)
		// });
		// --- FIN DU TEST --- //

		this.physicsUpdate();

		// Link physics
		window.grounds.forEach(ground => {
			ground.elmt.position.copy(ground.elmt.body.position);
			ground.elmt.quaternion.copy(ground.elmt.body.quaternion);
			ground.objects.forEach(groundObj => {
				groundObj.position.copy(groundObj.body.position);
				groundObj.quaternion.copy(groundObj.body.quaternion);
			});
			ground.corals.forEach(coralObj => {
				coralObj.position.copy(coralObj.body.position);
				coralObj.quaternion.copy(coralObj.body.quaternion);
			})
		});

		// Update du personnage
		this.character.update();

		//this.camera.position.z -= 0.1;

		this.groundUpdate();

		this.raycaster.setFromCamera(this.mouse, this.camera);

		// calculate objects intersecting the picking ray
		this.intersects = this.raycaster.intersectObjects(objectToInteractCollection);

		// DEBUG ONLY //
		console.log(this.renderer.info.memory);

		this.render();

		stats.end();
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	async init() {
		return new Promise(async resolve => {
			this.initScene();
			this.initPhysics();
			this.helpers();

			await this.initObjects();

			this.initSounds();

			this.update();

			resolve();
		});
	}

	initSounds() {
		window.soundBank = {
			permanent: soundHandler.newSound({url: DIR + '/assets/medias/sounds/bg_permanent.wav', loop: true, trigger: 0, volume: 0.8, obj: this.character.mesh}),
			etat1: soundHandler.newSound({url: DIR + '/assets/medias/sounds/bg_etat_1.wav', loop: true, trigger: 1, volume: 0.4, obj: this.character.mesh}),
			etat2: soundHandler.newSound({url: DIR + '/assets/medias/sounds/bg_etat_2.wav', loop: true, trigger: 0, volume: 0.4, obj: this.character.mesh}),
			etat3: soundHandler.newSound({url: DIR + '/assets/medias/sounds/bg_etat_3.wav', loop: true, trigger: 1, volume: 0.4, obj: this.character.mesh}),
			river_base: soundHandler.newSound({url: DIR + '/assets/medias/sounds/riviere_1_base.wav', loop: true, trigger: 0}),
			stone_pose: soundHandler.newSound({
				url: DIR + '/assets/medias/sounds/cailloux_atterit.wav',
				loop: false,
				trigger: 1
			}),
			stone_break: soundHandler.newSound({url: DIR + '/assets/medias/sounds/cailloux_casse.wav', loop: false, trigger: 1}),
			inhale: soundHandler.newSound({url: DIR + '/assets/medias/sounds/respiration_inspiration.wav', loop: false, trigger: 1}),
			exhale: soundHandler.newSound({url: DIR + '/assets/medias/sounds/respiration_expiration.wav', loop: false, trigger: 1}),
		};

		window.lavaSoundObject = new THREE.Object3D();
		this.scene.add(window.lavaSoundObject);
		window.lavaSoundObject.position.x = -chunkSize;
		window.lavaSoundObject.add(window.soundBank.river_base);
	}

	initObjects() {
		return new Promise(async resolve => {
			// Floor
			this.character = new Character();
			this.character.mesh.add(this.camera);
			this.scene.add(this.character.mesh);

			await this.loadGround();

			window.grounds.forEach(ground => {
				this.scene.add(ground.elmt);
				ground.objects.forEach(groundElmt => {
					this.scene.add(groundElmt);
				});
				ground.corals.forEach(coral => {
					this.scene.add(coral);
				})
			});

			// --- TEST ANIMATION D'INTRODUCTION ---//

			this.test = [];
			for (let i = 0; i < 25; i++) {
				let shapes = Math.round(Math.random()),
					geom;

				geom = new THREE.IcosahedronGeometry(this.radius, this.details);

				if (shapes == 1) {
					geom = new THREE.DodecahedronGeometry(this.radius, this.details);
				}

				let mat = new THREE.MeshBasicMaterial({
					color: '#720300'
				});
				this.stone = new THREE.Mesh(geom, mat);

				this.stone.name = 'stone';
				// this.stone.position.set(0,0,0);
				this.stone.position.set(Math.random() * (5 - -5) + -5, Math.random() * (30 - 5) + 5, Math.random() * (-3 - -5) + -5);
				let sphere = new CANNON.Sphere(1);
				let body = new CANNON.Body({mass: 1});
				body.position.set(this.stone.position.x, this.stone.position.y, this.stone.position.z);
				body.addShape(sphere);
				this.world.add(body);
				this.stone.body = body;

				window.grounds[4].objects.push(this.stone);

				this.scene.add(this.stone);
			}

			// --- FIN DU TEST --- //

			this.addPhysics();

			resolve();
		});
	}

	loadGround() {
		return new Promise(async resolve => {
			await Ground.wait();
			resolve();

			router.defineNextSection('', 'game-scene');

			panel.panelHandler('', 'game-commands');
		});
	}

	initScene() {
		this.container = document.querySelector('#main');
		document.body.appendChild(this.container);

		this.scene = new THREE.Scene();

		this.scene.fog = new THREE.Fog('#4b0500', 1, 130);

		// Image as a background
		bgTexture = new THREE.TextureLoader().load(DIR + '/assets/textures/ciel-2.jpg',
			( texture ) => {
				let img = texture.image;
				bgWidth= img.width;
				bgHeight = img.height;
			} );
		this.scene.background = bgTexture;
		bgTexture.wrapS = THREE.MirroredRepeatWrapping;
		bgTexture.wrapT = THREE.MirroredRepeatWrapping;

		var aspect = window.innerWidth / window.innerHeight;
		var texAspect = bgWidth / bgHeight;
		var relAspect = aspect / texAspect;

		bgTexture.repeat = new THREE.Vector2( Math.max(relAspect, 1), Math.max(1/relAspect,1) );
		bgTexture.offset = new THREE.Vector2( -Math.max(relAspect-1, 0)/2, -Math.max(1/relAspect-1, 0)/2 );

		//this.scene.background = new THREE.Color('#890b00');

		this.renderer = new THREE.WebGLRenderer({antialias: ANTIALIAS, alpha: true});

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
		this.renderer.setClearColor(0x000000, 0);

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
		});
		this.world.addContactMaterial(this.ground);
	}

	addPhysics() {
		window.grounds.forEach(ground => {
			let plane = new CANNON.Plane();
			let body = new CANNON.Body({mass: 0});
			body.addShape(plane);
			body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
			body.position.set(ground.elmt.position.x, ground.elmt.position.y, ground.elmt.position.z);
			this.world.add(body);
			ground.elmt.body = body;
			ground.objects.forEach(groundObj => {
				let sphere = new CANNON.Sphere(1);
				let body = new CANNON.Body({mass: 1});
				body.position.set(groundObj.position.x, groundObj.position.y, groundObj.position.z);
				body.addShape(sphere);
				this.world.add(body);
				groundObj.body = body;
			});
			ground.corals.forEach(coral => {
				let sphere = new CANNON.Sphere(1);
				let body = new CANNON.Body({mass: 1});
				body.position.set(coral.position.x, coral.position.y, coral.position.z);
				body.addShape(sphere);
				this.world.add(body);
				coral.body = body;
			});
			ground.unusedCorals.forEach(coral => {
				let sphere = new CANNON.Sphere(1);
				let body = new CANNON.Body({mass: 1});
				body.position.set(coral.position.x, coral.position.y, coral.position.z);
				body.addShape(sphere);
				this.world.add(body);
				coral.body = body;
			});
		});
	}

	helpers() {
		var size = 30;
		var divisions = 10;

		var gridHelper = new THREE.GridHelper(size, divisions);
		//this.scene.add(gridHelper);
	}

	updateTemplate(elmt, color = false, templateType) {
		let usedObjectNumber = elmt.corals.length;
		elmt.objects.forEach(obj => {
			this.scene.remove(obj);
			obj.geometry.dispose();
			obj.geometry = undefined;
			obj.material.dispose();
			obj.material = undefined;
			obj = undefined;
		});
		elmt.objects = [];
		switch (templateType) {
			case "normal":
				this.loadNormalTemplate(elmt.id, elmt.elmt.body.position.x, elmt.elmt.body.position.z, false);
				if (usedObjectNumber > window.rules.normal[window.playerState.playerStateNumber].corals.current) {

					for (let i = 0; i <= usedObjectNumber - window.rules.normal[window.playerState.playerStateNumber].corals.current; i++) {
						elmt.unusedCorals.push(elmt.corals[i]);
						this.scene.remove(elmt.corals[i]);
						elmt.corals[i].geometry.dispose();
						elmt.corals[i].geometry = undefined;
						elmt.corals[i].material.dispose();
						elmt.corals[i].material = undefined;
						elmt.corals[i] = undefined;
						elmt.corals.splice(i, 1);
					}
				} else if (usedObjectNumber < window.rules.normal[window.playerState.playerStateNumber].corals.current) {
					for (let i = 0; i < window.rules.normal[window.playerState.playerStateNumber].corals.current - usedObjectNumber; i++) {
						elmt.corals.push(elmt.unusedCorals[i]);
						this.scene.add(elmt.unusedCorals[i]);
						elmt.unusedCorals.splice(i, 1);
					}
				}
				break;
		}
		elmt.corals.forEach(coral => {
			coral.body.position.x = elmt.elmt.body.position.x + helpers.rand(-chunkSize / 2, chunkSize / 2);
			coral.body.position.z = elmt.elmt.body.position.z + helpers.rand(-chunkSize / 2, chunkSize / 2);
		});
		elmt.objects.forEach(e => {
			this.addPhysicsObject(e);
			this.scene.add(e);
		});

		if (color) {
			elmt.elmt.material.color.set(color);
		}
	}

	groundUpdate() {
		if (this.playerPositionThrottle) {
			this.playerPositionThrottle = false;

			let limitLeft, limitRight, limitTop, limitBottom,
				characterX, characterZ,
				activeCase,
				isLastRiver = false,
				isNewRiver = false;

			window.grounds.forEach((ground, i) => {

				// Character position
				characterX = this.character.mesh.position.x;
				characterZ = this.character.mesh.position.z;

				// Current chunk limits
				limitLeft = ground.elmt.position.x - chunkSize / 2;
				limitTop = ground.elmt.position.z - chunkSize / 2;
				limitRight = ground.elmt.position.x + chunkSize / 2;
				limitBottom = ground.elmt.position.z + chunkSize / 2;

				// If player is in the chunk
				if (limitLeft < characterX &&
					characterX < limitRight &&
					limitTop < characterZ &&
					characterZ < limitBottom) {
					activeCase = ground.id;

					// If current chunk is not equals to the player current chunk ID
					if (activeCase != this.character.positionOnMap) {

						// If current chunk pos X is not equals to the last chunk pos X
						if (ground.elmt.position.x != window.grounds[this.character.positionOnMap].elmt.position.x) {

							// If current chunk pos X minus last chunk pos X is superior to 0
							// This mean that character is going to right
							// Else you are going to left
							if (ground.elmt.position.x - window.grounds[this.character.positionOnMap].elmt.position.x > 0) {

								window.grounds.forEach((elmt2, i) => {
									// If current chunk pos X is inferior to last chunk pos X
									// Move his position to the right
									if (elmt2.elmt.position.x < window.grounds[this.character.positionOnMap].elmt.position.x) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.elmt.body.position.x);

										// Move the chunk to his new position
										elmt2.elmt.body.position.x = ground.elmt.position.x + chunkSize;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.elmt.body.position.x);

										// if one of them is not a river
										if (!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if (!isNewRiver) {
												this.updateTemplate(elmt2, 0xb32B00, "normal");
											} else {
												this.updateTemplate(elmt2, 0x0c3191, "newriver");
											}
										} else {
											this.updateTemplate(elmt2, false, "oldriver");
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
										isLastRiver = this.checkChunkTemplate(elmt2.elmt.body.position.x);

										// Move the chunk to his new position
										elmt2.elmt.body.position.x = ground.elmt.position.x - chunkSize;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.elmt.body.position.x);

										// if one of them is not a river
										if (!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if (!isNewRiver) {
												this.updateTemplate(elmt2, 0xb32B00, "normal");
											} else {
												this.updateTemplate(elmt2, 0x0c3191, "newriver");
											}
										} else {
											this.updateTemplate(elmt2, false, "oldriver");
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
										isLastRiver = this.checkChunkTemplate(elmt2.elmt.body.position.x);

										// Move the chunk to his new position
										elmt2.elmt.body.position.z = ground.elmt.position.z + chunkSize;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.elmt.body.position.x);

										// if one of them is not a river
										if (!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if (!isNewRiver) {
												this.updateTemplate(elmt2, false, "normal");
											} else {
												this.updateTemplate(elmt2, false, "newriver");
											}
										} else {
											this.updateTemplate(elmt2, false, "oldriver");
										}
									}
								});
								this.character.positionOnMap = activeCase;

							} else {
								window.grounds.forEach((elmt2, i) => {
									if (elmt2.elmt.position.z > window.grounds[this.character.positionOnMap].elmt.position.z) {

										// check if the last is a river
										isLastRiver = this.checkChunkTemplate(elmt2.elmt.body.position.x);

										// Move the chunk to his new position
										elmt2.elmt.body.position.z = ground.elmt.position.z - chunkSize;

										// check if the new is a river
										isNewRiver = this.checkChunkTemplate(elmt2.elmt.body.position.x);

										// if one of them is not a river
										if (!isNewRiver || !isLastRiver) {

											// if the new chunk is not a river
											if (!isNewRiver) {
												this.updateTemplate(elmt2, false, "normal");
											} else {
												this.updateTemplate(elmt2, false, "newriver");
											}
										} else {
											this.updateTemplate(elmt2, false, "oldriver");
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
		this.world.step(1 / 60);
	}

	guiHandler() {
		const gui = new dat.GUI();

		let player = gui.addFolder("Player");
		player.open();

		player.add(this.character, 'movementVelocity', 0.1, 2);

		document.body.appendChild(stats.dom);
	}

	checkChunkTemplate(coord) {
		return (coord < -chunkSize / 2 && coord > -chunkSize * 1.5);
	}

	onMouseMove(event) {

		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components

		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	userInteractionHandler() {
		window.scene = this.scene;
		let id = 0, name = '';

		if (this.intersects.length > 0) {
			let obj, index, scoreToAdd = 0;
			for (var i = 0; i < this.intersects.length; i++) {

				obj = this.intersects[i];
				id = obj.object.id;
				name = obj.object.name;

				if (obj.distance <= playerHitBox) {

					// index = objectToInteractCollection.findIndex(elmt => elmt.id === id);
					// objectToInteractCollection.splice(index, 1);
					// this.character.mesh.add(obj.object);

					// obj.object.body.position.x = 0;
					// obj.object.body.position.z = -5;
					// obj.object.body.position.y = 0;

					// this.character.putObjectInHand(obj.object);

					var x = obj.object.body.position.x;
					var y = obj.object.body.position.y;
					var z = obj.object.body.position.z;

					var shootDirection = new THREE.Vector3();
					var shootVelo = 25;
					// var projector = new THREE.Projector();
					shootDirection.set(0, 0, 1);
					shootDirection.unproject(this.camera);
					// projector.unprojectVector(shootDirection, this.camera);
					var ray = new THREE.Ray(obj.object.body.position, shootDirection.sub(obj.object.body.position).normalize());
					shootDirection.copy(ray.direction);

					obj.object.body.velocity.set(shootDirection.x * shootVelo,
						shootDirection.y * shootVelo + 15,
						shootDirection.z * shootVelo);
					x += shootDirection.x * (1 * 1.02 + 1);
					y += shootDirection.y * (1 * 1.02 + 1);
					z += shootDirection.z * (1 * 1.02 + 1);
					obj.object.body.position.set(x, y, z);

					this.intersects.splice(i, 1);

					obj.object.body.addEventListener("collide", () => {
						if(!obj.hasCollide) {
							obj.hasCollide = true;
							obj.object.add(soundBank.stone_break.play());
							setTimeout(() => {
								window.scene.remove(obj.object);
								obj.object.geometry.dispose();
								obj.object.geometry = undefined;
								obj.object.material.dispose();
								obj.object.material = undefined;
								obj.object = undefined;
							}, 500);
						}
					});


					// Score handler

					switch (name) {
						case 'stone':
							scoreToAdd = statesScore.stone;
							break;
						case 'stalagmite':
							scoreToAdd = statesScore.stalagmite;
							break;
					}

					playerState.addScore(scoreToAdd);

					// var worldPoint = new CANNON.Vec3(0, 0, 1);
					// var force = new CANNON.Vec3(vector.x * -100, vector.y * -100, vector.z * -100);
					// obj.object.body.applyForce(force, worldPoint);

					// obj.object.body.position.x = this.character.mesh.position.x;
					// obj.object.body.position.y = this.character.mesh.position.y;
					// obj.object.body.position.z = this.character.mesh.position.z - 5;

					// this.character.throwObject(this.scene, obj.object);


				} else {
					//alert(`The object is too far from you, make ${Math.floor(obj.distance - playerHitBox)} more footstep`);
				}
			}
		}
	}

	addPhysicsObject(groundObj) {
		let sphere = new CANNON.Sphere(1);
		let body = new CANNON.Body({mass: 1});
		body.position.set(groundObj.position.x, groundObj.position.y, groundObj.position.z);
		body.addShape(sphere);
		this.world.add(body);
		groundObj.body = body;
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