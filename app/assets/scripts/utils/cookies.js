const cookies = {
	ui: {},

	bindUI() {
		this.ui.win = window;
		this.ui.doc = document;
	},

	bindEvent() {
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	create(name, value, days) {
		let date, expire;
		// If days specified
		if (days) {
			date = new Date();
			// convert days in miliseconds
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expire = "; expire=" + date.toGMTString();
		} else {
			expire = "";
		}
		document.cookie = name + "=" + value + expire + "; path=/";
	},

	read(name) {

		let nameEQ = name + "=";

		let ca = document.cookie.split(';');

		for(let i=0;i < ca.length;i++) {

			let c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);

			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	
	update(name, value, days) {
		let expire;

		if(days) {
			expire = days;
		}else {
			expire = "";
		}

		this.create(name, value, expire);
	},

	delete(name, value) {
		this.create(name, value, -1);
	}
};

export default cookies;