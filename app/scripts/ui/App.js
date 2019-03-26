import sceneSwitch from './sceneSwitch';

window.onload = () => {
	if (document.querySelector('.js-scene-container')) {
		sceneSwitch.init();
	}
}