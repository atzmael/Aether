export default class Bubble {
	constructor(groundID, coord, radius = 1, zPos = 0, bubbleNumber = 0) {
		this.radius = window.helpers.randFloat(radius.min, radius.max);
		this.zPos = zPos;
		this.stoneNumber = window.helpers.randFloat(bubbleNumber.min, bubbleNumber.max);

		this.groundID = groundID;
		this.coord = coord;

		this.bubbles = [];
		for(let x = 0; x < 5;x++){
			this.bubbles[x] = [];
		}

		this.init();
	}

	init() {
		this.createFieldOfBubble();
	}
	/**
	 *
	 */
	createFieldOfBubble() {
		let x, y;

		for (let i = 0; i < this.stoneNumber; i++) {
			x = Math.round(Math.random() * (4 - 1) + 1);
			y = Math.round(Math.random() * (4 - 1) + 1);
			if (this.bubbles[x][y] == undefined) {
				this.createBubble((x - (this.bubbles.length / 2)) * 30 + (Math.cos(Math.random() * Math.PI) * 2) + this.coord.x, (y - (this.bubbles.length / 2)) * 30 + (Math.sin(Math.random() * Math.PI) * 2) + this.coord.y);
				this.bubbles[x][y] = 'object';
			}
		}
	}

	/**
	 *
	 * @returns {THREE.Mesh}
	 */
	createBubble(x, y) {
		window.physics.add('sphere', {
			goundID: this.groundID,
			position: {
				x: x,
				y: y,
				z: this.zPos,
			},
			radius: this.radius,
		});
	}
}