import Anger from "../Anger/Anger";

const discoverEmotion = {
	ui: {},
	tl: new TimelineMax(),

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;
		this.ui.body = document.querySelector('body');

		this.ui.btnEmotion = document.querySelectorAll('.js-emotion-link');
		this.ui.containerPage = document.querySelector('.js-page-content');
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
		let elmt = e.currentTarget;
		document.querySelector('.scene-container').innerHTML = '';
		this.ui.body.classList.remove('is-intro');
		this.tl.to(this.ui.containerPage, 0.4, {opacity: 0})
			.to(this.ui.containerPage, 0, {display: 'none', onComplete: () => this.chooseEmotionToBuild(elmt)});

	},

	chooseEmotionToBuild(e) {
		switch(e.getAttribute('data-emotion')){
			case 'anger':
				this.ui.win.emotion = new Anger();
				break;
		}
	}
};

export default discoverEmotion;