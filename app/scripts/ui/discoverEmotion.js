const discoverEmotion = {
	ui: {},

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;

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
	}
};

export default discoverEmotion;