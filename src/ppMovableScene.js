var PPMovableScene = class PPMovableScene {

    /**
     * Constructor for PPMovableScene class
     *
     * @param options
     */
    constructor(options) {
        this.requestAnimationFrameId = null;

        this.options = Object.assign({
            selector: 'body',
            animate: false,
            shapes: {}
        }, options);

        this.selector = document.querySelector(this.options.selector);

        this.breakpoint = {
            active: null,
            list: [],
            shapes: {}
        };

        this.run();
        this.build();
        this.detectBreakpoint();
    }

    /**
     * Adding events listeners
     */
    addEvents = () => {
        window.addEventListener('resize', this.detectBreakpoint);
        document.addEventListener('mousemove', this.onHandleEventMouseOver)
    }

    /**
     * When you want stop movable scene
     */
    stop = () => {
        window.removeEventListener("resize", this.detectBreakpoint);
        document.removeEventListener("mousemove", this.onHandleEventMouseOver);

        this.stopAnimate();
    }

    /**
     * Stop animate shapes
     */
    stopAnimate = () => {

        cancelAnimationFrame(this.requestAnimationFrameId);

        this.getActiveShapes().forEach((shape) => {
            clearTimeout(shape.timeOut);
        })
    }

    /**
     * Start animate for shapes
     */
    startAnimate = () => {

        this.getActiveShapes().forEach((shape) => {
            this.startShapeAnimate(shape);
        });
    }

    /**
     * When you want run again functionality
     */
    run = () => {

        this.addEvents();
    }

    /**
     * Build scene
     * Create custom array with shapes
     */
    build = () => {

        this.selector.classList.add('pp-movable-scene');

        for (let breakpoint in this.options.shapes) {
            this.breakpoint.list.push(breakpoint);
            this.breakpoint.shapes[breakpoint] = this.createShapes(this.options.shapes[breakpoint]);
        }

    }

    /**
     * Return now active shapes for current breakpoint
     *
     * @returns {*|Array}
     */
    getActiveShapes = () => {

        return this.breakpoint.shapes[this.breakpoint.active] || [];
    }

    /**
     * Start animate for shapes
     *
     * @param shape
     */
    startShapeAnimate = (shape) => {

        if (this.options.animate === true) {
            if (shape.move == false) {

                let random1 = Math.floor(Math.random() * 20) + 1;
                let random2 = Math.floor(Math.random() * 20) + 1;
                let random3 = Math.floor(Math.random() * 20) - 20;

                this.setPosition(shape, shape.position.x + random1, shape.position.y + random2, random3)

                clearTimeout(shape.timeOut);

                shape.timeOut = setTimeout(() => {
                    this.startShapeAnimate(shape);
                }, shape.speed);
            }
        }
    }

    /**
     * Init functionality
     */
    init = () => {
        for (let breakpoint in this.breakpoint.shapes) {
            this.breakpoint.shapes[breakpoint].forEach((shape) => {
                if (null !== shape.html.parentNode) {
                    shape.html.parentNode.removeChild(shape.html);
                }
            });
        }

        this.startAnimate();

        this.getActiveShapes().forEach((shape) => {
            this.selector.appendChild(shape.html);
        })
    }

    /**
     * Detect breakpoint and reinit scene when breakpoint is changed
     */
    detectBreakpoint = () => {

        let breakpoint = this.getBreakPointByWidth(window.outerWidth);
        if (breakpoint !== this.breakpoint.active) {
            this.setActiveBreakpoint(breakpoint);
            this.init();
        }

    }

    /**
     * Setter for active breakpoint
     *
     * @param breakpoint
     */
    setActiveBreakpoint = (breakpoint) => {

        if (this.breakpoint.list.indexOf(breakpoint) == -1) {
            this.breakpoint.active = null;
        } else {
            this.breakpoint.active = breakpoint;
        }

    }

    /**
     * Return breakpoint by width
     *
     * @param width
     * @returns {*}
     */
    getBreakPointByWidth = (width) => {

        let activeBreakPoint = null;

        this.breakpoint.list.forEach((breakPoint) => {
            if (width >= breakPoint) {
                activeBreakPoint = breakPoint;
            }
        });

        return activeBreakPoint;

    }

    /**
     * Return document width and height
     *
     * @returns {{width: number, height: number}}
     */
    getDocPositions = () => {
        return {
            width: Math.max(
                document.body.scrollWidth, document.documentElement.scrollWidth,
                document.body.offsetWidth, document.documentElement.offsetWidth,
                document.body.clientWidth, document.documentElement.clientWidth
            ),
            height: Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            )
        };
    }

    /**
     * Return center position for document
     *
     * @returns {{x: number, y: number}}
     */
    getDocumentCenterPoints = () => {

        return {
            x: this.getDocPositions().width / 2,
            y: this.getDocPositions().height / 2
        }
    }

    /**
     * Mousemove event
     *
     * @param event
     */
    onHandleEventMouseOver = (event) => {

        let centerPoisition = this.getDocumentCenterPoints();

        let offsetOfCenter = {
            x: event.clientX - centerPoisition.x,
            y: event.clientY - centerPoisition.y
        }

        this.getActiveShapes().forEach((shape) => {

            let offsetX = offsetOfCenter.x;
            let offsetY = offsetOfCenter.y;

            if (shape.direction === 'invert') {
                offsetX *= -1;
                offsetY *= -1;
            }

            if ("undefined" !== typeof shape.ratio) {
                offsetX *= shape.ratio;
                offsetY *= shape.ratio;
            }

            this.setPosition(shape, offsetX, offsetY, 20 * ( offsetX > 0 ? -1 : 1 ));
            shape.move = true;
            shape.position = {
                x: offsetX,
                y: offsetY
            }

            shape.move = false;
            this.startShapeAnimate(shape);
        })
    }

    setPosition(shape, x, y, rotate) {
        this.requestAnimationFrameId = requestAnimationFrame(() => {
            shape.html.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + rotate + "deg)";
        });
    }

    /**
     * Event for resize window
     *
     * @param event
     */
    eventResize = (event) => {

        this.detectBreakpoint();
    }

    /**
     * Create shapes object
     *
     * @param shapes
     * @returns {Array}
     */
    createShapes = (shapes) => {

        let shapesHTML = [];

        shapes.forEach((shape) => {

            let convertedShape = {
                html: document.createElement("DIV"),
                direction: shape.direction || 'normal',
                ratio: parseFloat(shape.ratio),
                speed: parseInt(shape.speed),
                move: false,
                position: {
                    x: 0,
                    y: 0
                }
            };

            convertedShape.html.classList.add(shape.type, 'pp-shape');
            convertedShape.html.style.top = shape.top + '%';
            convertedShape.html.style.left = shape.left + '%';

            if ("undefined" !== typeof shape.speed) {
                convertedShape.html.style.transition = shape.speed + 'ms transform linear';
            }

            shapesHTML.push(convertedShape);

        });

        return shapesHTML;
    }
}

module.exports = PPMovableScene;