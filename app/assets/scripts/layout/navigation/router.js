const router = {
	ui: {},
	current: '',
	last: '',

	bindUI() {
		this.ui.body = document.querySelector('body');

		this.ui.router = document.querySelectorAll('.js-router[data-next]');
		this.ui.header = document.querySelector('.js-header');
	},

	bindEvent() {
		this.ui.router.forEach(elmt => {
			elmt.addEventListener('click', (e) => this.defineNextSection(e))
		})
	},

	init() {
		this.bindUI();
		this.bindEvent();

		this.current = this.last = document.querySelector('.js-router.is-visible').getAttribute('data-current');
	},

	defineNextSection(e) {
		e.preventDefault();

		let elmt = e.currentTarget;

		let newAttr = elmt.getAttribute('data-next');
		if(newAttr == null) return;
		if(newAttr == 'previous') newAttr = this.last;
		let oldAttr = this.current;

		console.log("new", newAttr, "old", oldAttr);

		let oldSection = document.querySelector(`.js-router[data-current=${oldAttr}]`);
		let newSection = document.querySelector(`.js-router[data-current=${newAttr}]`);

		this.changeSection(oldSection, newSection);

		this.last = this.current;
		this.current = newAttr;
	},

	changeSection(oldSection, newSection) {
		let pageType = newSection.getAttribute('data-page');
		let header = this.ui.header;

		switch(pageType) {
			case '0':
				new TimelineMax().to(oldSection, 0.3, {opacity: 0, ease: 'ease-out'})
					.to(oldSection, 0.1, {display: 'none'})
					.to(newSection, 0.1, {display: 'flex'})
					.to(newSection, 0.3, {opacity: 1, ease: 'ease-in', onComplete: () => {
							oldSection.classList.remove('is-visible');
							newSection.classList.add('is-visible');
						}});
				break;
			case '1':
				new TimelineMax().to([oldSection, header], 0.3, {opacity: 0, ease: 'ease-out'})
					.to(oldSection, 0.1, {display: 'none', onComplete: () => {
							if(!header.classList.contains('is-secondary')) header.classList.add('is-secondary');
							this.ui.body.classList.add('no-generative');
					}})
					.to(newSection, 0.1, {display: 'flex'})
					.to([newSection, header], 0.3, {opacity: 1, ease: 'ease-in', onComplete: () => {
							oldSection.classList.remove('is-visible');
							newSection.classList.add('is-visible');
							this.ui.body.classList.remove('is-intro');
						}});
				break;
			case '2':
				new TimelineMax().to([oldSection, header], 0.3, {opacity: 0, ease: 'ease-out'})
					.to(oldSection, 0.1, {display: 'none', onComplete: () => {header.classList.remove('is-secondary');}})
					.to(newSection, 0.1, {display: 'flex'})
					.to([newSection, header], 0.3, {opacity: 1, ease: 'ease-in', onComplete: () => {
							oldSection.classList.remove('is-visible');
							newSection.classList.add('is-visible');
							this.ui.body.classList.remove('is-intro');
						}});
				break;
			case '3':
				new TimelineMax().to([oldSection, header], 0.3, {opacity: 0, ease: 'ease-out'})
					.to(oldSection, 0.1, {display: 'none', onComplete: () => {header.classList.remove('is-secondary');}})
					.to(newSection, 0.1, {display: 'flex'})
					.to([newSection, header], 0.3, {opacity: 1, ease: 'ease-in', onComplete: () => {
							oldSection.classList.remove('is-visible');
							newSection.classList.add('is-visible');
							this.ui.body.classList.remove('is-intro');
						}});
				break;
		}
	}
};

export default router;