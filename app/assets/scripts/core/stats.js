import Stats from './stats';

let stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function showFPS() {

	stats.begin();

	// monitored code goes here

	stats.end();

	requestAnimationFrame(showFPS);

}

requestAnimationFrame(showFPS);