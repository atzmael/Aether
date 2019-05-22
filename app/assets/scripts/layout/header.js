const header = {
	ui: {},

	bindUI() {
		this.ui.body = document.querySelector('body');

		this.ui.openAbout = document.querySelector('.js-menu-about');
		this.ui.hoverAbout = document.querySelector('.js-about-hover');
	},

	bindEvent() {
		this.ui.hoverAbout.addEventListener('mouseenter', this.toggleToolTip.bind(this));
		this.ui.hoverAbout.addEventListener('mouseleave', this.toggleToolTip.bind(this));
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	toggleToolTip() {
		let elmt = document.querySelector('.js-menu-about-tooltip');

		if(elmt.classList.contains('active')) {
			elmt.classList.remove('active');
			new TimelineMax().to(elmt, 0.2, {opacity: 0, x: -10, ease: "ease-in"})
				.to(elmt, 0.2, {display: 'none'});
		} else {
			elmt.classList.add('active');
			new TimelineMax().to(elmt, 0.2, {display: 'inline'})
				.to(elmt, 0.2, {opacity: 1, x: 10, ease: "ease-in"});
		}
	}
};

export default header;