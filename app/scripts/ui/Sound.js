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

		this.init();
	}

	init() {
		this.bindUI();
		this.bindEvent();

		this.createAudioElement();
		this.createAudioContext();
		this.play();
	}

	bindUI() {
		this.ui.body = document.querySelector('body');
	}

	bindEvent() {}

	createAudioElement() {
		this.audio = document.createElement("AUDIO");
		if(this.audio.canPlayType("audio/mpeg")){
			this.audio.setAttribute("src", this.sounds[this.currentEmotion][window.playerState - 1]);
		}
		this.audio.style.display = "none";
		this.ui.body.append(this.audio);
	}

	createAudioContext() {
		// Create audio context
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new AudioContext();
		this.track = this.audioContext.createMediaElementSource(this.audio);
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