import TweenMax from 'gsap';
import lottie from 'lottie-web';

import router from "./layout/navigation/router";
import storage from "./utils/storage";
import header from "./layout/header";
import aboutNav from "./layout/navigation/aboutNav";
import introEmotion from "./layout/navigation/introEmotion";
import panel from './layout/navigation/panel';
import animations from './layout/animations';

import generativeCircle from "./utils/generative-circle";

import cursor from "./utils/Cursor";

import Anger from "./components/environments/emotions/anger/Anger";
import SceneInterface from "./layout/SceneInterface";

window.onload = () => {

	// Storage handler
	storage.init();

	new cursor();

	// Handle animation in intro pages
	if (document.querySelector('.js-router')) {
		router.init();
	}

	if(document.querySelector('.js-about-nav')) {
		aboutNav.init();
	}

	/*
	if (document.querySelector('.js-scene-container')) {
		sceneSwitch.init();
	}
	*/

	if (document.querySelector('.js-intro-emotion')) {
		introEmotion.init();
	}

	if(document.querySelector('.js-panel')) {
		panel.init();
	}

	// Build navigation controller
	if(document.querySelector('.js-header')) {
		header.init();
	}

	animations.init();

	// Skip intro if you already saw it

	/*
	if(storage.read('skipintro') == 'true') {
		router.defineNextSection('','welcome-back');
	} else {
		setTimeout(() => {
			TweenMax.to(document.querySelector('.js-loading-landing'), 0.2, {opacity: 0, ease: 'ease-out'});
			new p5(generativeCircle);

			setTimeout(() => {
				router.defineNextSection('', 'quotation');
				animations.animateQuotationIntro();
			}, 2000)
		}, 2000);
	}
	*/

	/** Dev only **/
	router.defineNextSection('', 'game-scene');
	new Anger();
	/** **/

};