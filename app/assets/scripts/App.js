import TweenMax from 'gsap';
import lottie from 'lottie-web';

import sceneSwitch from './layout/navigation/sceneSwitch';
import router from "./layout/navigation/router";
import discoverEmotion from "./layout/navigation/discoverEmotion";
import cookies from "./utils/cookies";
import header from "./layout/header";
import aboutNav from "./layout/navigation/aboutNav";
import generativeCircle from "./utils/generative-circle";

import cursor from "./utils/Cursor";

import Anger from "./components/environments/emotions/anger/Anger";
import SoundHandler from "./utils/Sound";

window.onload = () => {

	// Cookies handler
	window.COOKIES = cookies;

	new cursor();

	// Handle animation in intro pages
	if (document.querySelector('.js-router')) {
		router.init();
	}

	if(document.querySelector('.js-about-nav')) {
		aboutNav.init();
	}

	// Fast switch scene in menu
	if (document.querySelector('.js-scene-container')) {
		sceneSwitch.init();
	}

	if (document.querySelector('.js-emotion-choice')) {
		discoverEmotion.init();
	}

	if(document.querySelector('.js-generative')) {
		//generativeCircle.init();
	}

	// Skip intro if you already saw it
	/*
	if(COOKIES.read('intro-is-finished')) {
		rooter.skipIntro();
	}
	*/

	// Build navigation controller
	if(document.querySelector('.js-header')) {
		header.init();
	}


	/** SVGs animation handler **/

	// Logo

	let logoAnim = lottie.loadAnimation({
		container: document.querySelector('.js-intro-logo'), // the dom element that will contain the animation
		renderer: 'svg',
		loop: false,
		autoplay: false,
		path: `${DIR}/assets/datas/logo.json` // the path to the animation json
	});

	document.querySelector('.js-anim-logo').addEventListener('click', () => {
		setTimeout(() => {
			logoAnim.play();
		}, 600);
	});
};