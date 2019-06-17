/*

	Usage :
	-----------------------------------------
	↓ Init ↓
	Parameters : 
	 - scene => Object : Scene de ThreeJS
	 - {} => Object : Parametres d'intialisation
	 	- helper => Boolean : Wireframe de la physique de chaque objects
	Exemple : 
	const physics = new Physics(scene, {
		helper: true
	})
	-----------------------------------------
	↓ Add ↓
	Parameters:
	 - 'floor' => String : Object à ajouter (box, sphere, stone, character, floor, coral)
	 - {} => Object : Parametres d'intialisation 
	 	- size => Object => Int : Taille de l'object en xyz
	 	- radius => Int : Radius de l'object
	 	- position => Object => Int: Position de l'object en xyz
	 	- rotation => Int : Rotation de l'object en PI
	 	- mass => Int : masse de l'object (0 = pas de gravité, n>0 = gravité )
	 	- materials => Object : Texture de l 'object
	 		- state => Int : Etat de l 'object (1, 2, 3) // Pas obligatoire
	 		- texture => String : Type de texture de l 'object (default, sand, bush, tree, stone, mountain, stalagmite, bubble, lava)
	Exemple:
	 physics.add('floor', {
		// Global variables
		size: {
			x: 1,
			y: 1,
			z: 1
		},
		radius: 1,
		position: {
			x: 1,
			y: 1,
			z: 1
		},
		rotation: -Math.PI / 2,
		// Physics variables
		mass: 5,
		// Graphics variables
		materials: {
			state: 1,
			texture: 'default'
		}
	})
	-----------------------------------------
	↓ Update ↓
	Parameters:
	 - time => Float : Temps depuis le début du lancement
	Exemple:
	 physics.update(time)
*/

import CANNON from "../../../core/cannon"
import CANNONHELPERS from "../../../core/cannonHelpers"
import 'three/examples/js/loaders/GLTFLoader';
import { resolve } from "q";
import { cpus } from "os";
import { brotliCompressSync } from "zlib";
import Materials from './Materials';
import SimplexNoise from 'simplex-noise';
import Character from '../player/Character';

export default class Physics {
	constructor(scene, opts) {
		// Initialize variables
		this.world;
		this.gravity = opts.gravity ? opts.gravity : -10;
		this.helper = opts.helper;
		this.scene = scene;
		// Update variables
		this.fixedTimeStep = 1 / 60;
		this.maxSubSteps = 3;
		this.lastTime;
		// Globals variables
		this.character = {};
		this.floors = {
			meshes: [],
			bodies: []
		};
		this.objects = {
			meshes: [],
			bodies: []
		};
		this.sources = {
			coral: '/assets/medias/meshes/coral.gltf'
		};
		this.meshes = {};
		this.elements = [];
		this.loaded = false;
		// Initiliaze physics
		this.initialize();
		// Load meshes
		this.loader();
	}
// --- 
	initialize() {
		this.world = new CANNON.World();
		this.world.gravity.set(0, this.gravity, 0);
		this.world.broadphase = new CANNON.NaiveBroadphase();
		this.helper && (this.helper = new THREE.CannonDebugRenderer(this.scene, this.world));
	}
	update(time) {
	// Time
		if (time && this.lastTime) {
			let dt = time - this.lastTime;
			this.world.step(this.fixedTimeStep, dt / 1000, this.maxSubSteps);
		}
		this.lastTime = time;
	// Charater
		if (this.character.mesh) {
			this.character.mesh.position.copy(this.character.body.position);
			this.character.mesh.quaternion.copy(this.character.body.quaternion);
		}
		if (this.character.body) {
			// this.character.body.character.update()
		}
	// Floor
		if (this.floors.meshes) {
			for (let i = 0; i !== this.floors.meshes.length; i++) {
				this.floors.meshes[i].position.copy(this.floors.bodies[i].position);
				this.floors.meshes[i].quaternion.copy(this.floors.bodies[i].quaternion);
				this.floors.meshes[i].material.texture.update(time);
			}
		}
	// Objects
		if (this.objects.meshes) {
			for (let i = 0; i !== this.objects.meshes.length; i++) {
				this.objects.meshes[i].position.copy(this.objects.bodies[i].position);
				this.objects.meshes[i].quaternion.copy(this.objects.bodies[i].quaternion);
				this.objects.meshes[i].material.texture.update(time);
			}
		}
	// Helper
		this.helper && (this.helper.update());
	}
// ---
	add(object, options) {
		this.elements.push([object, options]);
		(this.loaded) && this.draw(object, options);
	}
// ---
	async loader() {
		Object.assign(this.meshes, this.sources);
		this.meshes.coral = await this.load(this.sources.coral);
		this.mount();
		this.loaded = true;
	}
	load(url) {
		return new Promise(resolve => {
			const loader = new THREE.GLTFLoader();
			loader.load(
				window.DIR + url,
				obj => {
					resolve(obj.scene.children[0]);
				},
				xhr => {},
				err => {}
			);
		})
	}
// ---
	mount() {
		for (let i = 0; i < this.elements.length; i++) {
			const element = this.elements[i];
			this.draw(element[0], element[1]);
		}
	}
// ---
	draw(object, options) {
		// Update
		const opts = Object.assign({
			// Global variables
			groundID: 4,
			size: {x:1, y:1, z:1},
			radius: 1,
			position: {x:0, y:0, z:0},
			rotation: -Math.PI / 2,
			is: true,
			// Physics variables
			shape: null,
			body: null,
			mass: 5,
			// Graphics variables
			geometry: null,
			materials: {
				state: 1,
				texture: 'default'
			},
			material: null,
			mesh: null
		}, options);
		opts.name = object
		// Route
		switch (object) {
			case 'box':
				this.drawBox(opts)
				break;
			case 'sphere':
				opts.detail = 5;
				this.drawIcosahedron(opts)
				break;
			case 'stone':
				opts.detail = 1;
				this.drawIcosahedron(opts)
				break;
			case 'chunk':
				this.drawPlane(opts)
				break;
			case 'character':
				opts.detail = 5;
				opts.character = true;
				this.drawIcosahedron(opts)
				break;
			case 'coral':
				this.drawComplex(opts)
				break;
			default:
				this.drawBox(opts)
				break;
		}
	}
	drawBox(options) {
	// Initialize
		let size = options.size;
		let position = options.position;
		let rotation = options.rotation;
		let shape = options.shape;
		let body = options.body;
		let mass = options.mass;
		let geometry = options.geometry;
		let materials = options.materials;
		let material = options.material;
		let mesh = options.mesh;
		let name = options.name;
		let is = options.is;
		let groundID = options.groundID;
	// Update
		size.x = size.x / 2;
		size.y = size.y / 2;
		size.z = size.z / 2;
	// Physics
		shape = new CANNON.Box(
			new CANNON.Vec3(size.x, size.y, size.z)
		);
		body = new CANNON.Body({
			mass: mass
		});
		body.addShape(shape);
		body.position.set(position.x, position.y, position.z);
		body.quaternion.setFromAxisAngle(
			new CANNON.Vec3(0, 1, 0), 
			rotation
		);
	// Update
		size.x = (materials.texture == 'lava') ? size.x : size.x * 2;
		size.y = (materials.texture == 'lava') ? size.y : size.y * 2;
		size.z = (materials.texture == 'lava') ? size.z : size.z * 2;
	// Graphics
		geometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z, 32, 32, 32);
		materials = new Materials(materials);
		material = materials.material;
		material.texture = materials;
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(position.x, position.y, position.z);
		mesh.quaternion.setFromAxisAngle(
			new THREE.Vector3(0, 1, 0), 
			rotation
		);
		mesh.name = name;
		mesh.is = is;
	// Global
		this.world.addBody(body);
		this.objects.bodies.push(body);
		// this.scene.add(mesh);
		this.objects.meshes.push(mesh);
		window.grounds[groundID].objects.push(mesh);
	}
	drawIcosahedron(options) {
		// Initialize
		let radius = options.radius;
		let detail = options.detail;
		let position = options.position;
		let rotation = options.rotation;
		let shape = options.shape;
		let body = options.body;
		let mass = options.mass;
		let geometry = options.geometry;
		let materials = options.materials;
		let material = options.material;
		let mesh = options.mesh;
		let character = options.character;
		let name = options.name;
		let is = options.is;
		let groundID = options.groundID;
		// Physics
		shape = new CANNON.Sphere(radius);
		body = new CANNON.Body({
			mass: mass
		});
		body.addShape(shape);
		body.position.set(position.x, position.y, position.z);
		body.quaternion.setFromAxisAngle(
			new CANNON.Vec3(0, 1, 0),
			rotation
		);
		// Graphics
		geometry = new THREE.IcosahedronBufferGeometry(radius, detail);
		materials = new Materials(materials);
		material = materials.material;
		material.texture = materials;
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(position.x, position.y, position.z);
		mesh.quaternion.setFromAxisAngle(
			new THREE.Vector3(0, 1, 0),
			rotation
		);
		mesh.name = name;
		mesh.is = is;
		// Global
		this.world.addBody(body);
		console.log(character)
		if (character) {
			this.character.body = body;
			this.character.body.character = new Character()
			console.log(this.character.body.character)
		} else {
			this.objects.bodies.push(body);
		}
		// (character) || this.scene.add(mesh);
		(character) || this.objects.meshes.push(mesh);
		window.grounds[groundID].objects.push(mesh);
	}
	drawPlane(options) {
	// Initialize
		let size = options.size;
		let position = options.position;
		let rotation = options.rotation;
		let matrix = [];
		let shape = options.shape;
		let body = options.body;
		let mass = options.mass;
		let geometry = options.geometry;
		let materials = options.materials;
		let material = options.material;
		let mesh = options.mesh;
		let groundID = options.groundID;
	// Update
		size.x = (materials.texture == 'lava') ? size.x / 4 : size.x / 2;
		size.y = (materials.texture == 'lava') ? size.y / 4 : size.y / 2;
		size.z = (materials.texture == 'lava') ? size.z / 4 : size.z / 2;
	// Physics
		for (let i = 0; i < size.x; i++) {
			matrix.push([]);
			for (let j = 0; j < size.y; j++) {
				let height = Math.sin(i / size.x * Math.PI * 2) * Math.cos(j / size.y * Math.PI * 2);
				height *= (materials.texture == 'lava') ? 0 : 0.75;
				matrix[i].push(height);
			}
		}
		shape = new CANNON.Heightfield(matrix, {
			elementSize: (materials.texture == 'lava') ? 2.25 : 5
		});
		body = new CANNON.Body({
			mass: mass
		});
		body.addShape(shape);
		body.position.set(position.x, position.y, position.z);
		body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), rotation);
	// Update
		size.x = size.x;
		size.y = size.y;
		size.z = size.z;
	// Graphics
		geometry = new THREE.Geometry();
		let v0 = new CANNON.Vec3();
		let v1 = new CANNON.Vec3();
		let v2 = new CANNON.Vec3();
		for (let xi = 0; xi < shape.data.length - 1; xi++) {
			for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
				for (let k = 0; k < 2; k++) {
					shape.getConvexTrianglePillar(xi, yi, k === 0);
					v0.copy(shape.pillarConvex.vertices[0]);
					v1.copy(shape.pillarConvex.vertices[1]);
					v2.copy(shape.pillarConvex.vertices[2]);
					v0.vadd(shape.pillarOffset, v0);
					v1.vadd(shape.pillarOffset, v1);
					v2.vadd(shape.pillarOffset, v2);
					geometry.vertices.push(
						new THREE.Vector3(v0.x, v0.y, v0.z),
						new THREE.Vector3(v1.x, v1.y, v1.z),
						new THREE.Vector3(v2.x, v2.y, v2.z)
					);
					let i = geometry.vertices.length - 3;
					geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
				}
			}
		}
		geometry.computeBoundingSphere();
		geometry.computeFaceNormals();
		materials = new Materials(materials);
		material = materials.material;
		material.texture = materials;
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(position.x, position.y, position.z);
		mesh.quaternion.setFromAxisAngle(
			new THREE.Vector3(0, 1, 0),
			rotation
		);
	// Global
		this.world.addBody(body);
		this.floors.bodies.push(body);
		// this.scene.add(mesh);
		this.floors.meshes.push(mesh);
		window.grounds[groundID].elmt = mesh;
		window.grounds[groundID].elmt.body = body;
	}
	drawComplex(options) { // TODO : resize body + center mesh on the body
	// Initialize
		let size = options.size;
		let position = options.position;
		let rotation = options.rotation;
		let shape = options.shape;
		let body = options.body;
		let mass = options.mass;
		let geometry = options.geometry;
		let materials = options.materials;
		let material = options.material;
		let mesh = options.mesh;
		let name = options.name;
		let is = options.is;
		let groundID = options.groundID;
		for (let i = 0; i < this.meshes.coral.children.length; i++) {
		// Physics
			mesh = this.meshes.coral.children[i];
			shape = new CANNON.Box(
				new CANNON.Vec3(size.x, size.y, size.z)
			);
			body = new CANNON.Body({
				mass: mass
			});
			body.addShape(shape);
			body.position.set(position.x * i, position.y * i, position.z);
			body.quaternion.setFromAxisAngle(
				new CANNON.Vec3(0, 1, 0),
				rotation
			);
		// Graphics
			geometry = mesh.geometry;
			materials = new Materials(options.materials);
			material = materials.material;
			material.texture = materials;
			mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(position.x, position.y, position.z);
			mesh.quaternion.setFromAxisAngle(
				new THREE.Vector3(0, 1, 0),
				rotation
			);
			mesh.scale.set(options.size.x, options.size.y, options.size.z);
			mesh.name = name;
			mesh.is = is;
		// Global
			this.world.addBody(body);
			this.objects.bodies.push(body);
			// this.scene.add(mesh);
			this.objects.meshes.push(mesh);
			window.grounds[groundID].objects.push(mesh);
		}
	}
}