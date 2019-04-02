const header = {
	ui: {},
	tl: new TimelineMax(),
	lastAccordionItem: undefined,
	tlAccordion: new TimelineMax(),

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;
		this.ui.body = document.querySelector('body');

		this.ui.menu = document.querySelector('.js-menu');
		this.ui.activeItem = document.querySelector('.js-menu-item.active');
		this.ui.item = document.querySelectorAll('.js-menu-item:not(.active)');

		this.ui.infos = document.querySelector('.js-infos');
		this.ui.openInfos = document.querySelector('.js-open-infos');
		this.ui.closeInfos = document.querySelector('.js-close-infos');

		this.ui.infosItem = document.querySelectorAll('.js-infos-accordion-item');
		this.ui.infosItemBtn = document.querySelectorAll('.js-infos-accordion-btn');
	},

	bindEvent() {
		this.ui.activeItem.addEventListener('click', this.toggleMenu.bind(this));
		this.ui.openInfos.addEventListener('click', this.openInfos.bind(this));
		this.ui.closeInfos.addEventListener('click', this.closeInfos.bind(this));


		this.ui.infosItemBtn.forEach(e => {
			e.addEventListener('click', this.toggleAccordion.bind(this));
		})
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	toggleMenu(e) {
		e.preventDefault();
		if (this.ui.body.classList.contains('is-menu-open')) {
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

	openInfos(e) {
		e.preventDefault();

		this.ui.body.classList.add('is-infos-open');
		this.tl.to(this.ui.infos, 0.3, {opacity: 1})
			.to(this.ui.infos, 0, {display: 'block'});
	},

	closeInfos(e) {
		e.preventDefault();

		this.ui.body.classList.remove('is-infos-open');
		this.tl.to(this.ui.infos, 0.3, {opacity: 0})
			.to(this.ui.infos, 0, {display: 'none'});
	},

	toggleAccordion(e) {
		e.preventDefault();

		let elmt = e.currentTarget;
		let container = elmt.closest('.js-infos-accordion-item');
		let content = container.querySelector('.js-infos-accordion-content');
		let inner = container.querySelector('.js-infos-content-inner');
		let newHeight = container.querySelector('.js-infos-content-inner').offsetHeight;

		if(container.classList.contains('is-active')){
			this.tlAccordion
				.to(inner, 0.3, {ease: Power1.easeOut, opacity: 0, x: -40})
				.to(content, 0.1, {overflow: 'hidden'})
				.to(content, 0.3, {ease: Power1.easeOut, height: `${0}px`});
			container.classList.remove('is-active');
		} else {
			this.tlAccordion
				.to(content, 0.3, {ease: Power1.easeOut, height: `${newHeight}px`})
				.to(content, 0.1, {overflow: 'auto'})
				.to(inner, 0.3, {ease: Power1.easeOut, opacity: 1, x: 0});
			container.classList.add('is-active');
		}
	}
};

export default header;