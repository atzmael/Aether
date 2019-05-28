export default class SoundHandler {
	constructor(currEmotion = 'anger') {
		this.ui = {};
		this.sounds = {
			anger: [
				window.DIR + '/assets/medias/sounds/colere_etat1.mp3',
				window.DIR + '/assets/medias/sounds/colere_etat2.mp3',
				window.DIR + '/assets/medias/sounds/colere_etat3.mp3',
			],
		};

		this.currentEmotion = currEmotion;
		this.audio = document.querySelector("#audio");
		this.source = document.querySelector('#audio source');

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
		this.source.src = this.sounds[this.currentEmotion][playerState.playerStateNumber];
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