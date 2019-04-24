export default class Cursor {
    constructor() {
        this.obj = document.getElementById('cursor');
        this.elems = {
            dot: {
                obj: document.getElementById('dot')
            },
            circle: {
                obj: document.getElementById('circle')
            }
        };
        this.params = {
            color: '#fff',
            size: 2.5,
            position: {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            },
            events: {
                move: function (e) {
                    this.params.position.x = e.clientX;
                    this.params.position.y = e.clientY;
                }
            }
        };
        this.initialize();
        this.update();
    }
    initialize() {
        window.addEventListener('mousemove', this.params.events.move.bind(this), false);
    }
    update() {
        requestAnimationFrame(this.update.bind(this));
        TweenMax.to(this.elems.dot.obj, 0.25, {
            x: (this.params.position.x - this.params.size),
            y: (this.params.position.y - this.params.size)
        });
        TweenMax.to(this.elems.circle.obj, 0.5, {
            x: (this.params.position.x - this.params.size),
            y: (this.params.position.y - this.params.size)
        });
    }
}