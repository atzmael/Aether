export default class App {

	constructor() {

		this.container = document.querySelector('#main');
		document.body.appendChild(this.container);

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.z = 10;

		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.container.appendChild(this.renderer.domElement);

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		this.onWindowResize();

		this.renderer.animate(this.render.bind(this));

		let cube = new Cube().mesh;

		this.scene.add(cube);

		this.render();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	onWindowResize() {

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

class Cube {
	constructor(width = 1, height = 1, depth = 1, color = 0xFFFFFF) {
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.color = color;

		this.mesh = this.createCube();
	}

	createCube() {
		let geometry = new THREE.BoxBufferGeometry( this.width, this.height, this.depth);
		let material = new THREE.MeshBasicMaterial( { color: this.color } );
		return new THREE.Mesh(geometry, material);
	}
}