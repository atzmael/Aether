const router = {
	ui: {},
	current: '',
	last: '',

	bindUI() {
		this.ui.body = document.querySelector('body');

		this.ui.router = document.querySelectorAll('.js-router[data-next]');
		this.ui.header = document.querySelector('.js-header');

		this.ui.btnMenu = document.querySelector('.js-main-menu');
	},

	bindEvent() {
		this.ui.router.forEach(elmt => {
			elmt.addEventListener('click', (e) => this.defineNextSection(e))
		});
		this.ui.btnMenu.addEventListener('click', this.openMenuFromGame.bind(this));
	},

	init() {
		this.bindUI();
		this.bindEvent();

		this.current = this.last = document.querySelector('.js-router.is-visible').getAttribute('data-current');
	},

	defineNextSection(e, dataNext, pType = '') {
		if (e) e.preventDefault();

		let elmt = e.currentTarget;

		let newAttr = dataNext ? dataNext : elmt.getAttribute('data-next');
		if (newAttr == null) return;
		if (newAttr == 'previous') newAttr = this.last;
		let oldAttr = this.current;

		console.log("new", newAttr, "old", oldAttr);

		let oldSection = document.querySelector(`.js-router[data-current=${oldAttr}]`);
		let newSection = document.querySelector(`.js-router[data-current=${newAttr}]`);

		this.changeSection(oldSection, newSection, pType);

		this.last = this.current;
		this.current = newAttr;
	},

	changeSection(oldSection, newSection, pType) {
		let pageType = pType != '' ? pType : newSection.getAttribute('data-page');
		let header = this.ui.header;

		console.log('test', pageType);

		switch (pageType) {
			case '0':
				new TimelineMax().to(oldSection, 0.3, {opacity: 0, ease: 'ease-out'})
					.to(oldSection, 0.1, {
						display: 'none', onComplete: () => {
							this.ui.body.classList.add('is-intro');
							header.classList.remove('is-secondary');
							header.classList.remove('is-third');
						}
					})
					.to(newSection, 0.1, {display: 'flex'})
					.to(newSection, 0.3, {
						opacity: 1, ease: 'ease-in', onComplete: () => {
							oldSection.classList.remove('is-visible');
							newSection.classList.add('is-visible');
						}
					});
				break;
			case '1':
				new TimelineMax().to([oldSection, header], 0.3, {opacity: 0, ease: 'ease-out'})
					.to(oldSection, 0.1, {
						display: 'none', onComplete: () => {
							header.classList.add('is-secondary');
							header.classList.remove('is-third');
							this.ui.body.classList.add('no-generative');
						}
					})
					.to(newSection, 0.1, {display: 'flex'})
					.to([newSection, header], 0.3, {
						opacity: 1, ease: 'ease-in', onComplete: () => {
							oldSection.classList.remove('is-visible');
							newSection.classList.add('is-visible');
							this.ui.body.classList.remove('is-intro');
						}
					});
				break;
			case '2':
				new TimelineMax().to([oldSection, header], 0.3, {opacity: 0, ease: 'ease-out'})
					.to(oldSection, 0.1, {
						display: 'none', onComplete: () => {
							header.classList.remove('is-secondary');
							header.classList.remove('is-third');
						}
					})
					.to(newSection, 0.1, {display: 'flex'})
					.to([newSection, header], 0.3, {
						opacity: 1, ease: 'ease-in', onComplete: () => {
							oldSection.classList.remove('is-visible');
							newSection.classList.add('is-visible');
							this.ui.body.classList.remove('is-intro');
						}
					});
				break;
			case '3':
				new TimelineMax().to([oldSection, header], 0.3, {opacity: 0, ease: 'ease-out'})
					.to(oldSection, 0.1, {
						display: 'none', onComplete: () => {
							header.classList.remove('is-secondary');
							header.classList.add('is-third');
						}
					})
					.to(newSection, 0.1, {display: 'flex'})
					.to([newSection, header], 0.3, {
						opacity: 1, ease: 'ease-in', onComplete: () => {
							oldSection.classList.remove('is-visible');
							newSection.classList.add('is-visible');
							this.ui.body.classList.remove('is-intro');
						}
					});
				break;
		}
	},

	openMenuFromGame(e) {
		e.preventDefault();
		router.defineNextSection('', 'change-emotion');
	}
};

export default router;