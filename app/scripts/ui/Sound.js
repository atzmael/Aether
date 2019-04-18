export default class SoundHandler {
	constructor(currEmotion = 'anger') {
		this.ui = {};
		this.sounds = {
			anger: [
				'/app/assets/sound/colere_etat1.mp3',
				'/app/assets/sound/colere_etat2.mp3',
				'/app/assets/sound/colere_etat3.mp3',
			],
		};

		this.currentEmotion = currEmotion;
		this.audio = document.querySelector("#audio");

		this.init();
	}

	init() {
		this.bindUI();
		this.bindEvent();

		this.setupAudioElement();
		this.audio.load();
		this.play();
	}

	bindUI() {
		this.ui.body = document.querySelector('body');
	}

	bindEvent() {}

	setupAudioElement() {
		this.audio.src = this.sounds[this.currentEmotion][playerState];
	}

	play() {
		this.audio.play();
	}

	resume() {
		this.audio.resume();
	}

	pause() {
		this.audio.pause();
	}


}