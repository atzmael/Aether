export default class SceneInterface {
	constructor(param_class) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = 5;

		this.renderer = new THREE.WebGLRenderer({alpha: true});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.domElement.classList.add('canvas', param_class);
		document.querySelector('.js-canvas-interface').appendChild(this.renderer.domElement);
	}

	unconstruct() {

	}
}