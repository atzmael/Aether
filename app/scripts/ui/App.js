import sceneSwitch from './sceneSwitch';

window.onload = () => {

	// Fast switch scene in menu
	if (document.querySelector('.js-scene-container')) {
		sceneSwitch.init();
	}


}