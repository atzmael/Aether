const panel = {
	ui: {},
	current: '',

	bindUI() {
		this.ui.body = document.querySelector('body');

		this.ui.panelBtn = document.querySelectorAll('.js-panel-btn');
	},

	bindEvent() {
		this.ui.panelBtn.forEach(elmt => {
			elmt.addEventListener('click', (e) => this.panelHandler(e))
		});
	},

	init() {
		this.bindUI();
		this.bindEvent();
	},

	panelHandler(e, dataPanel) {
		if(e) e.preventDefault();

		let elmt = e.currentTarget;

		let panelID = dataPanel ? dataPanel : elmt.getAttribute('data-panel');

		if(panelID == 0) {
			this.closePanel();
		} else {
			this.current = document.querySelector(`.js-panel[data-panel=${panelID}]`);
			let panelType = this.current.getAttribute('data-ptype') ? this.current.getAttribute('data-ptype') : 0;
			this.openPanel(panelType);
		}

		console.log(panelID);
	},

	openPanel(panelType) {
		new TimelineMax().to(this.current, 0, {display: 'flex'})
			.to(this.current, 0.3, {opacity: 1});

		
		switch(panelType) {
			case '1':
				setTimeout(() => {
					new TimelineMax().to(this.current, 0.3, {opacity: 0})
						.to(this.current, 0, {display: 'none'});
				}, 3000);
				break;
		}

	},

	closePanel() {
		new TimelineMax().to(this.current, 0.3, {opacity: 0})
			.to(this.current, 0, {display: 'none'});
	},
};

export default panel;