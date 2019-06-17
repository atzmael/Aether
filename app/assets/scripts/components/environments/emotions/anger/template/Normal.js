import Stone from '../../../world/Stone';
import Stalagmite from '../../../world/Stalagmite';
import Coral from '../../../world/Coral';

let rules = {
	1: {
		stones: {
			number: 3,
			radius: 1,
			details: 0,
		},
		rocks: 0,
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
		rocks: 1,
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
			number: 3,
		},
		geysers: 0,
	},
	3: {
		stones: {
			number: 10,
			radius: 4,
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
			number: 5,
		},
		geysers: 0,
	}
};

class Normal {
	constructor(groundID, coord, isInit) {
		if(playerState.playerStateNumber > 0 && playerState.playerStateNumber < 4) {
			this.rule = window.rules.normal[playerState.playerStateNumber];
		}

		this.groundID = groundID;
		this.coord = coord;
		this.isInit = isInit;
	}

	init() {
		return new Promise(async resolve => {
			new Stone(this.groundID, this.coord, this.rule.stones.radius, this.rule.stones.details, this.rule.stones.number);

			new Stalagmite(this.groundID, this.coord, this.rule.stalagmites.radius, this.rule.stalagmites.height, this.rule.stalagmites.segments, this.rule.stalagmites.number);

			if(this.isInit) {
				await Coral.wait(this.groundID, this.coord, this.rule.corals.max, this.rule.corals.current);
			}
			resolve();
		});
	}
}

const normal = {
	wait(number, coord, isInit) {
		return new Promise(async resolve => {
			const newNormal = new Normal(number, coord, isInit);
			await newNormal.init();
			resolve();
		});
	}
};

export default normal;