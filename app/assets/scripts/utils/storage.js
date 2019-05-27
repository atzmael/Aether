const storage = {
	ui: {},
	storage: localStorage,

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;

		this.ui.intro = document.querySelector('.js-intro');
	},

	bindEvent() {
		this.ui.intro.addEventListener('click', this.endIntro.bind(this));
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	create(name, value) {
		this.storage.setItem(name, value);
	},

	read(name) {
		return this.storage.getItem(name);
	},
	
	update(name, value) {
		this.storage.setItem(name, value);
	},

	delete(name) {
		this.storage.removeItem(name);
	},

	endIntro() {
		this.create('skipintro', true);
	}
};

export default storage;