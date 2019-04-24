import TweenMax from 'gsap';

import sceneSwitch from './components/interfaces/sceneSwitch';
import introHandler from "./components/interfaces/introHandler";
import discoverEmotion from "./components/interfaces/discoverEmotion";
import cookies from "./ui/cookies";
import header from "./layout/header";

import cursor from "./ui/Cursor";

import Anger from "./components/environments/emotions/anger/Anger";
import SoundHandler from "./ui/Sound";

window.onload = () => {

	// Cookies handler
	window.COOKIES = cookies;

	new cursor();

	new Anger();

	/*

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

	*/
};