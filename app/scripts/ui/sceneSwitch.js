import Anger from "../Anger/Anger";

const sceneSwitch = {
	ui: {},

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;

		this.ui.btnEmotion = document.querySelectorAll('.js-btn-emotion');
	},

	bindEvent() {
		this.ui.btnEmotion.forEach(e => {e.addEventListener('click', this.buildEmotion.bind(this));});
	},

	init() {
		this.bindUI();
		this.bindEvent();

	},

	buildEmotion(e) {
		e.preventDefault();
		this.ui.win.emotion = '';
		document.querySelector('.scene-container').innerHTML = '';
		switch(e.currentTarget.getAttribute('data-emotion')){
			case 'anger':
				this.ui.win.emotion = new Anger();
				break;
		}
	},
};

export default sceneSwitch;