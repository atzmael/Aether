const aboutNav = {
	ui: {},
	current: 1,

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;

		this.ui.btnNav = document.querySelectorAll('.js-about-nav');
	},

	bindEvent() {
		this.ui.btnNav.forEach(e => {e.addEventListener('click', this.switchAboutSection.bind(this))});
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	switchAboutSection(e) {
		e.preventDefault();

		let animSpeed = 0.2;

		let allBtn = document.querySelectorAll(`.js-about-nav`);
		let currentBtn = allBtn[this.current - 1];
		let nextBtn = e.currentTarget;

		let nextIndex = nextBtn.getAttribute('data-index');

		let allElmt = document.querySelectorAll('.js-about-section');
		let currentElmt = allElmt[this.current - 1];
		let nextElmt = allElmt[parseInt(nextIndex) - 1];

		let title = document.querySelector('.js-about-section-name');
		let titleHeight = title.offsetHeight;
		let titleText = nextElmt.getAttribute('data-title');

		// console.log(titleHeight);

		if(nextIndex > this.current) {
			new TimelineMax().fromTo(currentElmt, 0.3, {opacity: 1, y: 0}, {opacity: 0, y: -50})
				.fromTo(title, animSpeed, {y: 0}, {y: -titleHeight}, 0)
				.to(currentElmt, 0.1, {display: 'none', onComplete: () => {
					title.textContent = titleText;
					}})
				.to(nextElmt, 0.1, {display: 'block'})
				.fromTo(nextElmt, animSpeed, {opacity: 0, y: 50}, {opacity: 1, y: 0})
				.fromTo(title, animSpeed, {y: titleHeight}, {y: 0}, '-=0.3');
			nextBtn.classList.add('active');
			currentBtn.classList.remove('active');
		} else if(nextIndex < this.current) {
			new TimelineMax().fromTo(currentElmt, animSpeed, {opacity: 1, y: 0}, {opacity: 0, y: 50})
				.fromTo(title, animSpeed, {y: 0}, {y: titleHeight}, 0)
				.to(currentElmt, 0.1, {display: 'none', onComplete: () => {
						title.textContent = titleText;
					}})
				.to(nextElmt, 0.1, {display: 'block'})
				.fromTo(nextElmt, animSpeed, {opacity: 0, y: -50}, {opacity: 1, y: 0})
				.fromTo(title, animSpeed, {y: -titleHeight}, {y: 0}, '-=0.3');
			nextBtn.classList.add('active');
			currentBtn.classList.remove('active');
		}

		this.current = parseInt(nextIndex);
	}
};

export default aboutNav;