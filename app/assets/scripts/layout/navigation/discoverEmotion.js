import Anger from "../../components/environments/emotions/anger/Anger";
import SoundHandler from "../../utils/Sound";

const discoverEmotion = {
	ui: {},
	tl: new TimelineMax(),

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;
		this.ui.body = document.querySelector('body');

		this.emotion = '';
		this.increment = 0;

		this.ui.btnEmotion = document.querySelectorAll('.js-emotion-link');
		this.ui.introductionSection = document.querySelector('.js-intro-emotion');
		this.ui.emotionSection = document.querySelector('.js-emotion-choice');
		this.ui.containerPage = document.querySelector('.js-page-content');

		this.ui.timeline = document.querySelector('.js-intro-timeline');
		this.ui.textVoices = document.querySelectorAll('.js-list-voice');
		this.ui.btnSlider = document.querySelector('.js-off-btn');
		this.ui.textReady = document.querySelector('.js-off-ready');
		this.ui.loader = document.querySelector('.js-emotion-loader');
	},

	bindEvent() {
		this.ui.btnEmotion.forEach(e => {e.addEventListener('click', this.buildEmotion.bind(this));});
		this.ui.btnSlider.addEventListener('click', function(e) {
			e.preventDefault();
			this.introductionNextSlide(this.increment);
		}.bind(this));
		
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
		this.tl.to(this.ui.emotionSection, 0.4, {opacity: 0})
			   .to(this.ui.emotionSection, 0, {display: 'none', onComplete: () => this.chooseEmotionToBuild(elmt)});
	},

	chooseEmotionToBuild(e) {
		switch(e.getAttribute('data-emotion')){
			case 'anger':
				let source = DIR + "/assets/medias/images/sphere-medium-anger.png";
				let title = "anger";

				let elImg = this.ui.introductionSection.querySelector('img');
				let elText = this.ui.introductionSection.querySelector('p');

				elImg.setAttribute('src', source);
				elText.innerHTML = title;

			   this.tl.to(this.ui.introductionSection, 0, {display: 'flex'})
			   		  .to(this.ui.introductionSection, 0.6, {opacity: 1});

				this.emotion = 'anger';
				break;
		}
	},
	introductionNextSlide(i) {
		let tmln = ((i+1) * (100 / this.ui.textVoices.length)) + '%';
		if (this.increment === this.ui.textVoices.length - 1) {
			this.tl.to(this.ui.introductionSection, 0.3, {opacity: 0})
				.to(this.ui.timeline, 0.3, {width: tmln }, '-=0.6')
				.to(this.ui.loader, 0, {display: 'flex'})
				.to(this.ui.loader, 0.3, {opacity: 1, onComplete: () => this.launchScene()});
		} else if (this.increment === this.ui.textVoices.length - 2) {
			this.tl.to(this.ui.textVoices[i], 0.4, {opacity: 0})
				.to(this.ui.textVoices[i], 0, {display: 'none'})
				.to(this.ui.textVoices[i+1], 0, {display: 'block'})
				.to(this.ui.textReady, 0, {display: 'flex'})
				.to(this.ui.textVoices[i+1], 0.6, {opacity: 1})
				.to(this.ui.textReady, 0.6, {opacity: 1}, '-=0.6')
				.to(this.ui.timeline, 0.6, {width: tmln }, '-=0.6');
		} else {
			this.tl.to(this.ui.textVoices[i], 0.4, {opacity: 0})
				.to(this.ui.textVoices[i], 0, {display: 'none'})
				.to(this.ui.textVoices[i + 1], 0, { display: 'block'})
				.to(this.ui.textVoices[i+1], 0.6, {opacity: 1})
				.to(this.ui.timeline, 0.6, {width: tmln }, '-=0.6');
		}
		this.increment = i+1;
	},

	launchScene() {
		switch (this.emotion) {
			case 'anger':
				this.ui.win.emotion = new Anger();
				this.ui.win.sound = new SoundHandler();
				break;
		}
	}
};

export default discoverEmotion;