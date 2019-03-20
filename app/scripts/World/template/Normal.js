import Stone from '../Stone';

let rules = {
	1: {
		stones: {
			number: 3,
			radius: 1,
			details: 0,
		},
		rocks: 0,
		corals: 4,
		stalagmites: 0,
		geysers: 0,
	},
	2: {
		stones: {
			number: 6,
			radius: 2,
			details: 0,
		},
		rocks: 1,
		corals: 2,
		stalagmites: 3,
		geysers: 0,
	},
	3: {
		stones: {
			number: 10,
			radius: 3,
			details: 0,
		},
		rocks: 2,
		corals: 0,
		stalagmites: 5,
		geysers: 0,
	}
};

export default class Normal {
	constructor() {
		this.rule = rules[playerState];

		this.init();
	}

	init() {

		this.mesh = new THREE.Object3D();
		this.mesh.name = "template-normal";
		this.mesh.position.y = 0;

		let fieldOfStone = new Stone(this.rule.stones.radius, this.rule.stones.details, this.rule.stones.number).mesh;

		this.mesh.add(fieldOfStone);
	}


}