import TweenMax from 'gsap';

import sceneSwitch from './sceneSwitch';
import introHandler from "./introHandler";
import discoverEmotion from "./discoverEmotion";
import cookies from "./cookies";
import header from "./header";

window.onload = () => {

	// Cookies handler
	window.COOKIES = cookies;

	// Handle animation in intro pages
	if (document.querySelector('body.is-intro')) {
		introHandler.init();
	}

	// Fast switch scene in menu
	if (document.querySelector('.js-scene-container')) {
		sceneSwitch.init();
	}

	if (document.querySelector('.js-emotion-choice')) {
		discoverEmotion.init();
	}

	// Skip intro if you already saw it
	if(COOKIES.read('intro-is-finished')) {
		introHandler.skipIntro();
	}

	// Build navigation controller
	if(document.querySelector('.js-header')) {
		header.init();
	}
};