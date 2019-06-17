import Stone from '../../../world/Stone';
import Stalagmite from '../../../world/Stalagmite';
import Coral from '../../../world/Coral';
import Bubble from "../../../world/Bubble";

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

			new Bubble(this.groundID, this.coord, this.rule.bubbles.radius, this.rule.bubbles.zPos, this.rule.bubbles.number);

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