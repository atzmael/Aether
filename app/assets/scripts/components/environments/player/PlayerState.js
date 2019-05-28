class PlayerState {
	constructor() {
		this.score = 0;
		this.playerStateNumber = 2;

		this.init();
	}

	init() {
		this.score = this.playerStateNumber;
	}

	addScore(number) {
		this.score += number;

		this.calculatePlayerState();
	}

	removeScore(number) {
		this.score -= number;

		this.calculatePlayerState();
	}

	calculatePlayerState() {
		this.playerStateNumber = Math.floor(this.score);
		if(this.playerStateNumber > 3) this.playerStateNumber = 3;
	}
}

export default PlayerState;