const header = {
	ui: {},
	tl: new TimelineMax(),

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;
		this.ui.body = document.querySelector('body');

		this.ui.menu = document.querySelector('.js-menu');
		this.ui.activeItem = document.querySelector('.js-menu-item.active');
		this.ui.item = document.querySelectorAll('.js-menu-item:not(.active)');

		console.log(this.ui.item);
	},

	bindEvent() {
		this.ui.activeItem.addEventListener('click', this.toggleMenu.bind(this));
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	toggleMenu(e) {
		e.preventDefault();
		if(this.ui.body.classList.contains('is-menu-open')) {
			this.ui.body.classList.remove('is-menu-open');
			this.ui.item.forEach(elmt => {
				TweenMax.to(elmt, 0.3, {opacity: 0, x: -20});
			})
		} else {
			this.ui.body.classList.add('is-menu-open');
			this.ui.item.forEach(elmt => {
				TweenMax.to(elmt, 0.3, {opacity: 1, x: 0});
			})
		}
	},
};

export default header;