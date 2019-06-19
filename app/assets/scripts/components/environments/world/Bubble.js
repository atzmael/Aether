

export default class Bubble {
	constructor(groundID, coord, radius = 1, bubbleNumber = 0, zPos = 1) {
		this.radius = window.helpers.randFloat(radius.min, radius.max);
		this.zPos = window.helpers.randFloat(zPos.min, zPos.max);
		this.bubbleNumber = window.helpers.randFloat(bubbleNumber.min, bubbleNumber.max);

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
		let x, y, bubble, posX, posY, posZ;

		for (let i = 0; i < this.bubbleNumber; i++) {
			x = Math.round(Math.random() * (4 - 1) + 1);
			y = Math.round(Math.random() * (4 - 1) + 1);
			if (this.bubbles[x][y] == undefined) {
				bubble = this.createBubble();
				posX = (x - (this.bubbles.length / 2)) * 30 + (Math.cos(Math.random() * Math.PI) * 2) + this.coord.x;
				posY = (y - (this.bubbles.length / 2)) * 30 + (Math.sin(Math.random() * Math.PI) * 2) + this.coord.y;
				posZ = this.zPos;
				bubble.position.set(posX, posZ, posY);
				this.bubbles[x][y] = bubble;
				window.grounds[this.groundID].objects.push(bubble);
			}
		}
	}

	/**
	 *
	 * @returns {THREE.Mesh}
	 */
	createBubble() {

		let geom = new THREE.SphereBufferGeometry(this.radius);

		let mat = new THREE.MeshBasicMaterial({color: '#720300', opacity: 0.8});

		let bubble = new THREE.Mesh(geom, mat);

		bubble.name = "bubble";

		objectToInteractCollection.push(bubble);

		return bubble;
	}
}