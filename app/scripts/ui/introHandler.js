const introHandler = {
	ui: {},
	tl: new TimelineMax(),

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;
		this.ui.body = document.querySelector('body');

		this.ui.sectionHome = document.querySelector('.js-home');
		this.ui.sectionHomeFirst = document.querySelector('.js-home-first');
		this.ui.sectionHomeEnd = document.querySelector('.js-home-end');
		this.ui.sectionQuotation = document.querySelector('.js-quotation');
		this.ui.sectionChoice = document.querySelector('.js-emotion-choice');

		this.ui.sectionWelcomeBack = document.querySelector('.js-welcome-back');
	},

	bindEvent() {
		this.ui.sectionHome.addEventListener('click', this.animateHome.bind(this));
		this.ui.sectionHomeFirst.addEventListener('click', this.homeFirstToSecond.bind(this));
		this.ui.sectionHomeEnd.addEventListener('click', this.homeToQuotation.bind(this));
		this.ui.sectionQuotation.addEventListener('click', this.quotationToChoice.bind(this));
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	animateHome(e) {
		e.preventDefault();
	},

	homeFirstToSecond(e) {
		e.preventDefault();

		this.tl.to(this.ui.sectionHomeFirst, 0.8, {opacity: 0})
			.to(this.ui.sectionHomeFirst, 0, {display: 'none'})
			.to(this.ui.sectionHomeEnd, 0, {display: 'flex'})
			.to(this.ui.sectionHomeEnd, 0.6, {opacity: 1});
	},

	homeToQuotation(e) {
		e.preventDefault();

		this.tl.to(this.ui.sectionHome, 0.8, {opacity: 0})
			.to(this.ui.sectionHome, 0, {display: 'none'})
			.to(this.ui.sectionQuotation, 0, {display: 'flex'})
			.to(this.ui.sectionQuotation, 0.6, {opacity: 1});
	},

	quotationToChoice(e) {
		e.preventDefault();

		COOKIES.create('intro-is-finished', true);

		this.tl.to(this.ui.sectionQuotation, 0.8, {opacity: 0})
			.to(this.ui.sectionQuotation, 0, {display: 'none'})
			.to(this.ui.sectionChoice, 0, {display: 'flex'})
			.to(this.ui.sectionChoice, 0.6, {opacity: 1});

	},

	skipIntro() {
		this.tl.to(this.ui.sectionHome, 0.8, {opacity: 0}, '+=1')
			.to(this.ui.sectionHome, 0, {display: 'none'})
			.to(this.ui.sectionWelcomeBack, 0, {display: 'flex'})
			.to(this.ui.sectionWelcomeBack, 0.6, {opacity: 1})
			.to(this.ui.sectionWelcomeBack, 0.8, {opacity: 0}, '+=1.5')
			.to(this.ui.sectionWelcomeBack, 0, {display: 'none'})
			.to(this.ui.sectionChoice, 0, {display: 'flex'})
			.to(this.ui.sectionChoice, 0.6, {opacity: 1});
	}
};

export default introHandler;