let rules = {
	1: {
		stones: 4,
		rocks: 0,
		corals: 0,
		stalagmites: 0,
		geysers: 0,
	},
	2: {
		stones: 6,
		rocks: 0,
		corals: 0,
		stalagmites: 0,
		geysers: 0,
	},
	3: {
		stones: 8,
		rocks: 0,
		corals: 0,
		stalagmites: 0,
		geysers: 2,
	}
};

export default class River {
	constructor() {

		this.init();
	}

	init() {
		this.mesh = new THREE.Object3D();
		this.mesh.name = "template-river";
		this.mesh.position.y = 0;

	}
}