class Sound {
	constructor() {
		this.listener = window.listener
		this.audioLoader = new THREE.AudioLoader();
	}

	init() {

	}

	newSound({url = null, volume = 1, loop = true, trigger = 0, obj = null, refDistance = 20}) {
		if(url != null) {
			let soundObject = new THREE.PositionalAudio(this.listener);

			this.audioLoader.load(url, (buffer) => {
				soundObject.setBuffer(buffer);
				soundObject.setLoop(loop);
				soundObject.setRefDistance(refDistance);
				soundObject.setVolume(volume);

				if(obj != null) {
					this.attach(obj, soundObject);
				}

				switch (trigger) {
					case 0:
						soundObject.play();
				}

			});
			return soundObject;
		}
	}

	attach(obj, soundObj) {
		obj.add(soundObj);
	}
}

export default Sound;