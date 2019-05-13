const generative = {
	ui: {},

	bindUI() {
		this.ui.body = document.querySelector('body');

		this.ui.container = document.querySelector('.js-generative');
	},

	bindEvent() {},

	init() {
		this.bindUI();
		this.bindEvent();

		this.createGenerative();
	},

	createGenerative() {

	}
};

export default generative;