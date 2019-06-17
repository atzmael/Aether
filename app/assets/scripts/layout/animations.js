import lottie from "lottie-web";
import Blob from './Blob';
import SceneInterface from "./SceneInterface";

const animations = {
	ui: {},
	current: '',
	timelineRunning: true,
	blobScene: null,

	bindUI() {
		this.ui.body = document.querySelector('body');

		this.ui.landing = document.querySelector('.js-landing');
		this.ui.quotation = document.querySelector('.js-quotation');
		this.ui.intro = document.querySelector('.js-intro');
		this.ui.btnWbChoice = document.querySelector('.js-wb-choice');
		this.ui.choice = document.querySelector('.js-choice');
		this.ui.pulseBtn = document.querySelector('.js-pulse-wave');
		this.ui.mainmenuBtn = document.querySelector('.js-main-menu');
		this.ui.helpmenuBtn = document.querySelector('.js-help-btn');
		this.ui.bgGenerative = document.querySelector('.js-generative');
	},

	bindEvent() {
		this.ui.landing.addEventListener('click', this.animateQuotationIntro.bind(this));
		this.ui.quotation.addEventListener('click', this.animateLogoIntro.bind(this));
		this.ui.intro.addEventListener('click', this.animateChoiceEmotion.bind(this));
		this.ui.btnWbChoice.addEventListener('click', this.animateChoiceEmotion.bind(this));
		this.ui.choice.addEventListener('click', this.pulsateIntroEmoBtn.bind(this));
		this.ui.pulseBtn.addEventListener('mouseenter', this.stopPulsing.bind(this));
		this.ui.pulseBtn.addEventListener('mouseleave', this.startPulsing.bind(this));
	},

	init() {
		this.bindUI();
		this.bindEvent();

		/** SVGs animation handler **/

		// Logo intro

		this.logoAnim = lottie.loadAnimation({
				container: document.querySelector('.js-intro-logo'), // the dom element that will contain the animation
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path: `${DIR}/assets/datas/logo.json` // the path to the animation json
			});

		// Anim Help Game

		// Navigate
		this.navigateAnim = lottie.loadAnimation({
			container: document.querySelector('.js-anim-navigate'), // the dom element that will contain the animation
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `${DIR}/assets/datas/picto-clavier.json` // the path to the animation json
		});
		document.querySelector('.js-item-navigate').addEventListener('mouseenter', () => {this.navigateAnim.play()});
		document.querySelector('.js-item-navigate').addEventListener('mouseleave', () => {this.navigateAnim.stop()});

		// Interact
		this.discoverAnim = lottie.loadAnimation({
			container: document.querySelector('.js-anim-discover'), // the dom element that will contain the animation
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `${DIR}/assets/datas/picto-camera.json` // the path to the animation json
		});
		document.querySelector('.js-item-discover').addEventListener('mouseenter', () => {this.discoverAnim.play()});
		document.querySelector('.js-item-discover').addEventListener('mouseleave', () => {this.discoverAnim.stop()});

		// Discover
		this.dragDropAnim = lottie.loadAnimation({
			container: document.querySelector('.js-anim-drag-drop'), // the dom element that will contain the animation
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `${DIR}/assets/datas/picto-drag-and-drop.json` // the path to the animation json
		});
		this.doubleClicAnim = lottie.loadAnimation({
			container: document.querySelector('.js-anim-double-clic'), // the dom element that will contain the animation
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `${DIR}/assets/datas/picto-double-clic.json` // the path to the animation json
		});
		this.soundAnim = lottie.loadAnimation({
			container: document.querySelector('.js-anim-son'), // the dom element that will contain the animation
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `${DIR}/assets/datas/picto-son.json` // the path to the animation json
		});
		document.querySelector('.js-item-interact').addEventListener('mouseenter', () => {
			this.dragDropAnim.play();
			this.doubleClicAnim.play();
			this.soundAnim.play();
		});

		document.querySelector('.js-item-interact').addEventListener('mouseleave', () => {
			this.dragDropAnim.stop();
			this.doubleClicAnim.stop();
			this.soundAnim.stop();
		});

		this.menuBtnAnim = lottie.loadAnimation({
			container: document.querySelector('.js-main-menu'), // the dom element that will contain the animation
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `${DIR}/assets/datas/picto-menu.json` // the path to the animation json
		});

		document.querySelector('.js-main-menu').addEventListener('mouseenter', () => {
			this.menuBtnAnim.play();
		});

		document.querySelector('.js-main-menu').addEventListener('mouseleave', () => {
			this.menuBtnAnim.stop();
		});

		this.helpmenuAnim = lottie.loadAnimation({
			container: document.querySelector('.js-help-btn'), // the dom element that will contain the animation
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `${DIR}/assets/datas/picto-help.json` // the path to the animation json
		});

		document.querySelector('.js-help-btn').addEventListener('mouseenter', () => {
			this.helpmenuAnim.play();
		});

		document.querySelector('.js-help-btn').addEventListener('mouseleave', () => {
			this.helpmenuAnim.stop();
		});
	},

	animateQuotationIntro() {
		let text = document.querySelectorAll('.js-quotation-anim-text');
		let credit = document.querySelectorAll('.js-quotation-credit');

		setTimeout(() => {
			new TimelineMax().to(text[0], 0.4, {y: 0, ease: 'ease-in'})
				.to(text[1], 0.4, {y: 0, ease: 'ease-in'})
				.to(text[2], 0.4, {y: 0, ease: 'ease-in'})
				.to(credit, 0.3, {opacity: 1, ease: 'ease-in'});

			TweenMax.to(this.ui.bgGenerative, 0.3, {opacity: .4, onComplete: () => {
					this.ui.body.classList.remove('is-landing');
				}});
		}, 600)
	},

	animateLogoIntro() {
		setTimeout(() => {
			this.logoAnim.play();
		}, 600);

		let text = document.querySelector('.js-intro-text');

		setTimeout(() => {
			TweenMax.to(text, 0.3, {y: 0, ease: 'ease-in'});
		}, 1400)
	},

	animateChoiceEmotion() {
		let text = document.querySelector('.js-choice-text');
		let help = document.querySelector('.js-choice-help');

		window.sceneInterface = new SceneInterface();
		window.blob = new Blob(window.sceneInterface.scene);
		function animate(time) {
			window.sceneInterface.raf = requestAnimationFrame(animate);
			window.sceneInterface.renderer.render(window.sceneInterface.scene, window.sceneInterface.camera);
			window.blob.update(time)
		}
		animate();

		setTimeout(() => {
			new TimelineMax().to(text, 0.4, {y: 0, ease: 'ease-in'})
				.to(help, 0.3, {opacity: 0.6, ease: 'ease-in'});
		}, 1400)
	},

	pulsateIntroEmoBtn() {
		let wave = document.querySelector('.js-pulse-wave');

		setInterval(() => {
			if(this.timelineRunning) {
				TweenMax.fromTo(wave, 1,{scale: 1, x: '-50%', y: '-50%', opacity: 1}, {scale: 2, x: '-50%', y: '-50%', opacity: 0, ease: 'ease-out'})
			}
		}, 1000);
	},

	startPulsing() {
		this.timelineRunning = true;
	},

	stopPulsing() {
		this.timelineRunning = false;
	},
};

export default animations;