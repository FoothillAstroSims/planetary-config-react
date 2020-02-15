import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

const getPlanetPos = function(radius, phase) {
    return new PIXI.Point(
        radius * Math.cos(-phase) + 600,
        radius * Math.sin(-phase) + 460); // these magic numbers come from this.orbitCenter
};
export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHoveringOnEarth: false,
            isHoveringOnObserverPlanet: false,
            isHoveringOnTargetPlanet: false
        };

        this.resources = {};

        this.orbitCenter = new PIXI.Point(600, 460);

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this.onEarthMove = this.onEarthMove.bind(this);
        this.onObserverPlanetMove = this.onObserverPlanetMove.bind(this);
        this.onTargetPlanetMove = this.onTargetPlanetMove.bind(this);
    }
    render() {
        return (
            <div className="MainView"
                 ref={(thisDiv) => {this.el = thisDiv;}} />
        );
    }
    componentDidMount() {
        this.app = new PIXI.Application({
            // Size of canvas
            width: 600 * 2,
            height: 460 * 2,

            antialias: true,
        });

        this.el.appendChild(this.app.view);

        // Loads all the images
        this.app.loader.add('observerPlanet', 'img/earth.svg')
        .add('earth', 'img/sun.png')
	.add('targetPlanet', 'img/mars.png')
        .add('highlight', 'img/circle-highlight.svg');

        const me = this;
        this.app.loader.load((loader, resources) => {
            me.resources = resources;

            me.earth = me.drawEarth(
                resources.earth);

            me.observerPlanetOrbitContainer = me.drawObserverPlanetOrbit();
            me.targetPlanetOrbitContainer = me.drawTargetPlanetOrbit();

            me.observerPlanetContainer = me.drawObserverPlanet(
            resources.observerPlanet, resources.highlight);
            me.observerPlanetContainer
              // events for drag start
              .on('mousedown', me.onDragStart)
              .on('touchstart', me.onDragStart)
              // events for drag end
              .on('mouseup', me.onDragEnd)
              .on('mouseupoutside', me.onDragEnd)
              .on('touchend', me.onDragEnd)
              .on('touchendoutside', me.onDragEnd)
              // events for drag move
              .on('mousemove', me.onObserverPlanetMove)
              .on('touchmove', me.onObserverPlanetMove);

            me.targetPlanetContainer = me.drawTargetPlanet(
                resources.targetPlanet, resources.highlight);
            me.targetPlanetContainer
              // events for drag start
              .on('mousedown', me.onDragStart)
              .on('touchstart', me.onDragStart)
              // events for drag end
              .on('mouseup', me.onDragEnd)
              .on('mouseupoutside', me.onDragEnd)
              .on('touchend', me.onDragEnd)
              .on('touchendoutside', me.onDragEnd)
              // events for drag move
              .on('mousemove', me.onTargetPlanetMove)
              .on('touchmove', me.onTargetPlanetMove);

            me.start();
        });
    }
    componentWillUnmount() {
        this.app.stop();
    }
    componentDidUpdate(prevProps) {
    }
    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }
    stop() {
        cancelAnimationFrame(this.frameId);
    }
    animate() {
        // I'm guessing that the reason why the outline
        // of the orbit is overlayed on the planets is due to the
        // fact that these coontainers are being cleared and redrawn
        // whereas the observerPlanet container and targetPlanet container are not
	// being redrawn

        this.updateObserverPlanetOrbit();
        this.updateTargetPlanetOrbit();

        this.observerPlanetContainer.position = getPlanetPos(this.props.radiusObserverPlanet,
                                                    this.props.observerPlanetAngle);
        this.targetPlanetContainer.position = getPlanetPos(this.props.radiusTargetPlanet,
                                                    this.props.targetPlanetAngle);

        if (this.state.isHoveringOnObserverPlanet || this.draggingObserverPlanet) {
            this.observerPlanetHighlight.visible = true;
        } else {
            this.observerPlanetHighlight.visible = false;
        }

        if (this.state.isHoveringOnTargetPlanet || this.draggingTargetPlanet) {
            this.targetPlanetHighlight.visible = true;
        } else {
            this.targetPlanetHighlight.visible = false;
        }

        this.frameId = requestAnimationFrame(this.animate);
    }
    updateObserverPlanetOrbit() {
        this.observerPlanetOrbitContainer.clear();
        this.observerPlanetOrbitContainer.lineStyle(2, 0xffffff);
        this.observerPlanetOrbitContainer.drawCircle(this.orbitCenter.x, this.orbitCenter.y, this.props.radiusObserverPlanet);
    }
    updateTargetPlanetOrbit() {
        this.targetPlanetOrbitContainer.clear();
        this.targetPlanetOrbitContainer.lineStyle(2, 0xffffff);
        this.targetPlanetOrbitContainer.drawCircle(this.orbitCenter.x, this.orbitCenter.y, this.props.radiusTargetPlanet);
    }
    drawObserverPlanetOrbit() {
        const graphicsObserverPlanet = new PIXI.Graphics();
        graphicsObserverPlanet.lineStyle(2, 0xffffff);
        graphicsObserverPlanet.drawCircle(this.orbitCenter.x, this.orbitCenter.y, this.props.radiusObserverPlanet);
        this.app.stage.addChild(graphicsObserverPlanet);
        return graphicsObserverPlanet;
    }
    drawTargetPlanetOrbit() {
        const graphicsTargetPlanet = new PIXI.Graphics();
        graphicsTargetPlanet.lineStyle(2, 0xffffff);
        graphicsTargetPlanet.drawCircle(this.orbitCenter.x, this.orbitCenter.y, this.props.radiusTargetPlanet);
        this.app.stage.addChild(graphicsTargetPlanet);
        return graphicsTargetPlanet;
    }
    drawObserverPlanet(observerPlanetResource, highlightResource) {
        const observerPlanetContainer = new PIXI.Container();
        observerPlanetContainer.name = 'observerPlanet';
        observerPlanetContainer.buttonMode = true;
        observerPlanetContainer.interactive = true;
        observerPlanetContainer.position = this.orbitCenter;

        const highlight = new PIXI.Sprite(highlightResource.texture);
        highlight.visible = false;
        highlight.width = 30 * 2;
        highlight.height = 30 * 2;
        highlight.anchor.set(0.5);
        this.observerPlanetHighlight = highlight;
        observerPlanetContainer.addChild(highlight);

        const observerPlanet = new PIXI.Sprite(observerPlanetResource.texture);
        observerPlanet.width = 20 * 2;
        observerPlanet.height = 20 * 2;
        observerPlanet.anchor.set(0.5);
        observerPlanetContainer.addChild(observerPlanet);

        this.app.stage.addChild(observerPlanetContainer);
        return observerPlanetContainer;
    }
    drawTargetPlanet(targetPlanetResource, highlightResource) {
        const targetPlanetContainer = new PIXI.Container();
        targetPlanetContainer.name = 'targetPlanet';
        targetPlanetContainer.buttonMode = true;
        targetPlanetContainer.interactive = true;
        targetPlanetContainer.position = this.orbitCenter;

        const highlight = new PIXI.Sprite(highlightResource.texture);
        highlight.visible = false;
        highlight.width = 30 * 2;
        highlight.height = 30 * 2;
        highlight.anchor.set(0.5);
        this.targetPlanetHighlight = highlight;
        targetPlanetContainer.addChild(highlight);

        const targetPlanet = new PIXI.Sprite(targetPlanetResource.texture);
        targetPlanet.width = 20 * 2;
        targetPlanet.height = 20 * 2;
        targetPlanet.anchor.set(0.5);
        targetPlanetContainer.addChild(targetPlanet);

        this.app.stage.addChild(targetPlanetContainer);
        return targetPlanetContainer;
    }
    drawEarth(earthResource) {
        const earthContainer = new PIXI.Container();
        earthContainer.pivot = this.orbitCenter;
        earthContainer.name = 'earth';
        earthContainer.buttonMode = true;
        earthContainer.interactive = true;
        earthContainer.position = this.orbitCenter;

        const earth = new PIXI.Sprite(earthResource.texture);
        earth.width = 40 * 2;
        earth.height = 40 * 2;
        earth.position = this.orbitCenter;
        earth.anchor.set(0.5);
        earth.rotation = -0.9;
        earthContainer.addChild(earth);

        this.app.stage.addChild(earthContainer);
        return earthContainer;
    }
    onDragStart(event) {
        this.props.stopAnimation();

        this.data = event.data;
        this.dragStartPos = this.data.getLocalPosition(this.app.stage);

        if (event.target.name === 'earth') {
            this.draggingEarth = true;
        } else if (event.target.name === 'observerPlanet') {
            this.draggingObserverPlanet = true;
        } else if (event.target.name === 'targetPlanet') {
            this.draggingTargetPlanet = true;
        }
    }
    onDragEnd() {
        this.draggingEarth = false;
        this.draggingObserverPlanet = false;
        this.draggingTargetPlanet = false;
        // set the interaction data to null
        this.data = null;
    }
    onEarthMove(e) {
        if (e.target && e.target.name === 'earth' &&
            !this.state.isHoveringOnEarth &&
            !this.draggingObserverPlanet &&
            !this.draggingTargetPlanet
        ) {
            this.setState({isHoveringOnEarth: true});
        }
        if (!e.target && this.state.isHoveringOnEarth) {
            this.setState({isHoveringOnEarth: false});
        }
    }
    onObserverPlanetMove(e) {
        if (e.target && e.target.name === 'observerPlanet' &&
            !this.state.isHoveringOnObserverPlanet &&
            !this.draggingEarth
        ) {
            this.setState({isHoveringOnObserverPlanet: true});
        }
        if (!e.target && this.state.isHoveringOnObserverPlanet) {
            this.setState({isHoveringOnObserverPlanet: false});
        }

        if (this.draggingObserverPlanet) {
            const newPosition = this.data.getLocalPosition(this.app.stage);

            // This angle starts at the center of the orbit. It's the
            // difference, in radians, between where the cursor was and
            // where it is now.
            let vAngle =
                -1 * Math.atan2(newPosition.y - this.orbitCenter.y,
                           newPosition.x - this.orbitCenter.x);

            this.props.onObserverPlanetAngleUpdate(vAngle);
        }
    }
    onTargetPlanetMove(e) {
        if (e.target && e.target.name === 'targetPlanet' &&
            !this.state.isHoveringOnTargetPlanet &&
            !this.draggingEarth
        ) {
            this.setState({isHoveringOnTargetPlanet: true});
        }
        if (!e.target && this.state.isHoveringOnTargetPlanet) {
            this.setState({isHoveringOnTargetPlanet: false});
        }

        if (this.draggingTargetPlanet) {
            const newPosition = this.data.getLocalPosition(this.app.stage);

            const vAngle =
                -1 * Math.atan2(newPosition.y - this.orbitCenter.y,
                           newPosition.x - this.orbitCenter.x);

            this.props.onTargetPlanetAngleUpdate(vAngle);
        }
    }
}

MainView.propTypes = {
    observerPlanetAngle: PropTypes.number.isRequired,
    targetPlanetAngle: PropTypes.number.isRequired,
    radiusObserverPlanet: PropTypes.number.isRequired,
    radiusTargetPlanet: PropTypes.number.isRequired,
    onObserverPlanetAngleUpdate: PropTypes.func.isRequired,
    onTargetPlanetAngleUpdate: PropTypes.func.isRequired,
    stopAnimation: PropTypes.func.isRequired
};
