export default class SoundHandler {
	constructor(currEmotion = 'anger') {
		this.ui = {};
		this.isASoundPlaying = false;
		this.sounds = {
			anger: {
				etat1: window.DIR + '/assets/medias/sounds/bg_etat_1.wav',
				etat2: window.DIR + '/assets/medias/sounds/bg_etat_2.wav',
				etat3: window.DIR + '/assets/medias/sounds/bg_etat_3.wav',
				permanent: window.DIR + '/assets/medias/sounds/bg_permanent.wav',
			}
		}
		;

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

	bindEvent() {
	}

	setupAudioElement() {
		this.source.src = this.sounds[this.currentEmotion][`etat${playerState.playerStateNumber}`];
	}

	play() {
		if (this.isASoundPlaying) {

		} else {
			this.audio.play();
		}
	}

	resume() {
		this.audio.resume();
	}

	pause() {
		this.audio.pause();
	}

	change
}