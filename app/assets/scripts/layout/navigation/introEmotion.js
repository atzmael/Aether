import Anger from "../../components/environments/emotions/anger/Anger";
import router from "./router";

const introEmotion = {
	ui: {},
	tl: new TimelineMax(),

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;
		this.ui.body = document.querySelector('body');

		this.increment = 0;

		this.dragged = false;
		this.canBeDragged = false;

		this.ui.section = document.querySelector('.js-intro-emotion');

		this.ui.timeline = document.querySelector('.js-intro-timeline');
		this.ui.textVoices = document.querySelectorAll('.js-list-voice');
		this.ui.btnSlider = document.querySelector('.js-off-btn');
		this.ui.textReady = document.querySelector('.js-off-ready');
		this.ui.textContainer = document.querySelector('.js-intro-off');

		this.ui.bubble = document.querySelector('.js-bubble');
		this.ui.emotionLoader = document.querySelector('.js-emotion-loader');
	},

	bindEvent() {
		this.ui.btnSlider.addEventListener('click', function(e) {
			e.preventDefault();
			this.introductionNextSlide(this.increment);
		}.bind(this));

		this.ui.bubble.addEventListener('mousedown', () => {
			if(this.canBeDragged) this.dragged = true;
		});
		this.ui.doc.addEventListener('mouseup', () => {
			if(this.dragged) {
				this.tl.to(this.ui.textVoices[this.increment], 0.4, {opacity: 0})
					.to(this.ui.textVoices[this.increment], 0, {display: 'none'})
					.to(this.ui.textContainer, 0, {display: 'none'})
					.to(this.ui.emotionLoader, 0, {display: 'block'})
					.to(this.ui.section, 0, {onComplete: () => {this.ui.section.classList.add('v-center')}})
					.to(this.ui.emotionLoader, 0.3, {opacity: 1});

				new Anger();

				this.dragged = false;
			}
		})
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	introductionNextSlide(i) {

		let tmln = ((i+1) * (100 / this.ui.textVoices.length)) + '%';
		if (this.increment === this.ui.textVoices.length - 2) {
			this.tl.to(this.ui.btnSlider, 0.2, {opacity: 0, pointerEvents: 'none'})
				.to(this.ui.textVoices[i], 0.4, {opacity: 0})
				.to(this.ui.textVoices[i], 0, {display: 'none'})
				.to(this.ui.textVoices[i + 1], 0, { display: 'block'})
				.to(this.ui.textVoices[i+1], 0.6, {opacity: 1});
			this.canBeDragged = true;
		} else {
			this.tl.to(this.ui.textVoices[i], 0.4, {opacity: 0})
				.to(this.ui.textVoices[i], 0, {display: 'none'})
				.to(this.ui.textVoices[i + 1], 0, { display: 'block'})
				.to(this.ui.textVoices[i+1], 0.6, {opacity: 1});
		}
		this.increment ++;
	},
};

export default introEmotion;