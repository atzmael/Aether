import Anger from "../Anger/Anger";

const sceneSwitch = {
	ui: {},

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;

		this.ui.checker = document.querySelector('.js-scene-container');

		this.ui.btnAnger = document.querySelector('.js-btn-anger');
	},

	bindEvent() {
		this.ui.btnAnger.addEventListener('click', this.buildAnger.bind(this));
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	buildAnger(e) {
		e.preventDefault();
		this.ui.win.emotion = '';
		document.querySelector('.scene-container').innerHTML = '';
		this.ui.win.emotion = new Anger();
	}
};

export default sceneSwitch;