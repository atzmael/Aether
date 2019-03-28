import Stone from "../../World/Stone";
import Stalagmite from "../../World/Stalagmite";

let rules = {
	1: {
		stones: {
			number: 4,
			radius: 1,
			details: 0,
		},
		rocks: 0,
		corals: 0,
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
			number: 0,
		},
		geysers: 0,
	},
	2: {
		stones: {
			number: 6,
			radius: 2,
			details: 0,
		},
		rocks: 0,
		corals: 0,
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
			number: 0,
		},
		geysers: 0,
	},
	3: {
		stones: {
			number: 8,
			radius: 4,
			details: 0,
		},
		rocks: 0,
		corals: 0,
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
			number: 0,
		},
		geysers: 2,
	}
};

export default class River {
	constructor() {
		this.rule = rules[playerState];

		this.init();
	}

	init() {
		this.mesh = new THREE.Object3D();
		this.mesh.name = "template-river";
		this.mesh.position.y = 0;

		let fieldOfStone = new Stone(this.rule.stones.radius, this.rule.stones.details, this.rule.stones.number).mesh;
		this.mesh.add(fieldOfStone);

		let fieldOfStalagmite = new Stalagmite(this.rule.stalagmites.radius, this.rule.stalagmites.height, this.rule.stalagmites.segments, this.rule.stalagmites.number).mesh;
		this.mesh.add(fieldOfStalagmite);

	}
}