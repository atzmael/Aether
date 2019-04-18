import Stone from "../../World/Stone";
import Stalagmite from "../../World/Stalagmite";
import Coral from "../../World/Coral";

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

class River {
	constructor(groundID, coord) {
		if (playerState > 0 && playerState < 4) {
			this.rule = rules[playerState];
		}

		this.groundID = groundID;
		this.coord = coord;
	}

	init() {
		return new Promise(async resolve => {
			new Stone(this.groundID, this.coord, this.rule.stones.radius, this.rule.stones.details, this.rule.stones.number);

			new Stalagmite(this.groundID, this.coord, this.rule.stalagmites.radius, this.rule.stalagmites.height, this.rule.stalagmites.segments, this.rule.stalagmites.number);

			//await Coral.wait(this.groundID, this.coord, this.rule.corals);
			resolve();
		});
	}
}

const river = {
	wait(number, coord) {
		return new Promise(async resolve => {
			const newRiver = new River(number, coord);
			await newRiver.init();
			resolve();
		});
	}
};

export default river;