import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';
import { degToRad, radToDeg, roundToOnePlace } from './utils';

/**
 * Convert the moon angle for display.
 *
 * Returns a string.
 */
const getAngleDisplay = function(moonAngle) {
    let a = Math.abs(moonAngle - Math.PI);
    if (a >= Math.PI) {
        a -= Math.PI * 2;
    }
    const angle = roundToOnePlace(radToDeg(Math.abs(a)));
    return `${angle}°`;
};

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHoveringOnEarth: false,
            isHoveringOnMoon: false,
            isHoveringOnMars: false
        };

        this.resources = {};

        this.orbitCenter = new PIXI.Point(300 * 2, 230 * 2);

        // this.radiusMars = 200 * 2;
        // this.radiusMoon = 150 * 2;

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this.onEarthMove = this.onEarthMove.bind(this);
        this.onMoonMove = this.onMoonMove.bind(this);
        this.onMarsMove = this.onMarsMove.bind(this);
    }

    // https://www.protectator.ch/post/pixijs-v4-in-a-react-component
    render() {
        return (
            <div className="MainView" 
                ref={(thisDiv) => {this.el = thisDiv}} />
        );
    }
    componentDidMount() {
        this.app = new PIXI.Application({
            width: 600 * 2,
            height: 460 * 2,

            antialias: true,

            // as far as I know the ticker isn't necessary at the
            // moment.
            sharedTicker: true
        });

        this.el.appendChild(this.app.view);

        // this.drawText();
        // this.drawArrows();
        // this.drawMoonOrbit();
        // this.drawMarsOrbit();
        this.angle = this.drawAngle();
        this.angleText = this.drawAngleText(this.props.moonAngle);

        this.app.loader.add('moon', 'img/moon.svg')
            .add('earth', 'img/sun.png')  // earth
            .add('mars', 'img/earth.svg')  // <------- change this to mars
            .add('avatar', 'img/white-stickfigure.svg')
            .add('highlight', 'img/circle-highlight.svg')
            .add('timeCompass', 'img/time-compass.svg');

        const me = this;
        this.app.loader.load((loader, resources) => {
            me.resources = resources;

            me.moonOrbitContainer = me.drawMoonOrbit();
            me.marsOrbitContainer = me.drawMarsOrbit();

            me.moonContainer = me.drawMoon(
            resources.moon, resources.highlight);
            me.moonContainer
              // events for drag start
              .on('mousedown', me.onDragStart)
              .on('touchstart', me.onDragStart)
              // events for drag end
              .on('mouseup', me.onDragEnd)
              .on('mouseupoutside', me.onDragEnd)
              .on('touchend', me.onDragEnd)
              .on('touchendoutside', me.onDragEnd)
              // events for drag move
              .on('mousemove', me.onMoonMove)
              .on('touchmove', me.onMoonMove);

            me.marsContainer = me.drawMars(
                resources.mars, resources.highlight);
            me.marsContainer
              // events for drag start
              .on('mousedown', me.onDragStart)
              .on('touchstart', me.onDragStart)
              // events for drag end
              .on('mouseup', me.onDragEnd)
              .on('mouseupoutside', me.onDragEnd)
              .on('touchend', me.onDragEnd)
              .on('touchendoutside', me.onDragEnd)
              // events for drag move
              .on('mousemove', me.onMarsMove)
              .on('touchmove', me.onMarsMove);


            me.earth = me.drawEarth(
                resources.earth,
                resources.avatar,
                resources.highlight);

            me.earth
              // events for drag start
              .on('mousedown', me.onDragStart)
              .on('touchstart', me.onDragStart)
              // events for drag end
              .on('mouseup', me.onDragEnd)
              .on('mouseupoutside', me.onDragEnd)
              .on('touchend', me.onDragEnd)
              .on('touchendoutside', me.onDragEnd)
              // events for drag move
              .on('mousemove', me.onEarthMove)
              .on('touchmove', me.onEarthMove);

            me.timeCompass = me.drawTimeCompass(resources.timeCompass);

            me.start();
        });
    }
    componentWillUnmount() {
        this.app.stop();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.showLunarLandmark !== this.props.showLunarLandmark) {
            this.landmark.visible = this.props.showLunarLandmark;
        }

        if (this.props.showAngle &&
            prevProps.moonAngle !== this.props.moonAngle
        ) {
            this.updateAngle(this.angle, this.props.moonAngle);
            this.updateAngleText(this.angleText, this.props.moonAngle);
        }

        if (prevProps.showAngle !== this.props.showAngle) {
            if (this.props.showAngle) {
                this.updateAngle(this.angle, this.props.moonAngle);
                this.updateAngleText(this.angleText, this.props.moonAngle);
            }

            this.angle.visible = this.props.showAngle;
            this.angleText.visible = this.props.showAngle;
        }
    }
    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }
    stop() {
        cancelAnimationFrame(this.frameId)
    }
    animate() {
        // I'm guessing that the reason why the outline 
        // of the orbit is overlaid on the planets is due to the 
        // fact that these containers are being cleared and redrawn
        // whereas the moon container and mars container are not being redrawn
        
        this.moonOrbitContainer.clear();
        this.moonOrbitContainer = this.drawMoonOrbit();
        this.marsOrbitContainer.clear();
        this.marsOrbitContainer = this.drawMarsOrbit();

        this.moonContainer.position = this.getMoonPos(this.props.moonAngle);
        this.marsContainer.position = this.getMarsPos(this.props.marsAngle);
       // Rotate the moon about the earth, but not the shade from the
        // sun.

        if (this.state.isHoveringOnMoon || this.draggingMoon) {
            this.moonHighlight.visible = true;
        } else {
            this.moonHighlight.visible = false;
        }

        if (this.state.isHoveringOnMars || this.draggingMars) {
            this.marsHighlight.visible = true;
        } else {
            this.marsHighlight.visible = false;
        }

        // // this is the sun rotating
        // this.earth.rotation = -this.props.observerAngle + degToRad(90);

        if (this.state.isHoveringOnEarth || this.draggingEarth) {
            this.earthHighlight.visible = true;
        } else {
            this.earthHighlight.visible = false;
        }

        // if (this.props.showTimeTickmarks) {
        //     this.timeCompass.visible = true;
        // } else {
        //     this.timeCompass.visible = false;
        // }

        this.frameId = requestAnimationFrame(this.animate);
    }

    drawMoonOrbit() {
        const graphicsMoon = new PIXI.Graphics();
        graphicsMoon.lineStyle(2, 0xffffff);
        graphicsMoon.drawCircle(this.orbitCenter.x, this.orbitCenter.y, this.props.radiusMoon);
        this.app.stage.addChild(graphicsMoon);
        return graphicsMoon;
    }

    drawMarsOrbit() {
        const graphicsMars = new PIXI.Graphics();
        graphicsMars.lineStyle(2, 0xffffff);
        graphicsMars.drawCircle(this.orbitCenter.x, this.orbitCenter.y, this.props.radiusMars);
        this.app.stage.addChild(graphicsMars);
        return graphicsMars;
    }

    drawAngle() {
    //     const g = new PIXI.Graphics();
    //     g.visible = false;
    //     this.updateAngle(g, this.props.moonAngle);

    //     this.app.stage.addChild(g);
    //     return g;
    }
    drawAngleText(moonAngle) {
        // const angle = getAngleDisplay(-moonAngle);
        // const g = new PIXI.Text(angle, {
        //     fontFamily: 'Arial',
        //     fontSize: 16 * 2,
        //     fontWeight: 'bold',
        //     fill: 0xffe040,
        //     align: 'center'
        // });
        // g.visible = false;
        // g.position.x = this.orbitCenter.x - (180 * 2);
        // g.position.y = this.orbitCenter.y - (170 * 2);

        // this.updateAngleText(g, this.props.moonAngle);

        // this.app.stage.addChild(g);
        // return g;
    }
    updateAngle(g, moonAngle) {
        g.clear();
        g.moveTo(this.orbitCenter.x, this.orbitCenter.y);
        g.lineStyle(6, 0xffe040);
        g.beginFill(0xffe200, 0.7);
        g.arc(this.orbitCenter.x, this.orbitCenter.y,
              this.props.radiusMoon, // this used to be 200 * 2       <---- make sure to debug
              Math.PI, -moonAngle,
              // counter-clockwise?
              moonAngle < 0 && moonAngle > -Math.PI);

        g.lineTo(this.orbitCenter.x, this.orbitCenter.y);
        g.lineTo(170 * 2, 230 * 2);
    }
    updateAngleText(g, moonAngle) {
        g.text = getAngleDisplay(-moonAngle);
    }
    drawTimeCompass(timeCompassResource) {
        const timeCompass = new PIXI.Sprite(timeCompassResource.texture);
        timeCompass.name = 'timeCompass';
        timeCompass.width = 410 * 0.8 * 2;
        timeCompass.height = 260 * 0.8 * 2;
        timeCompass.position = this.orbitCenter;
        timeCompass.anchor.set(0.5);
        timeCompass.visible = false;

        this.app.stage.addChild(timeCompass);
        return timeCompass;
    }

    drawMoon(moonResource, highlightResource) {
        const pos = this.getMoonPos(this.props.moonAngle);

        const moonContainer = new PIXI.Container();
        moonContainer.name = 'moon';
        moonContainer.buttonMode = true;
        moonContainer.interactive = true;
        moonContainer.position = pos;  // <------ not sure what the point of this line is since it's being reassigned
        moonContainer.position = this.orbitCenter;

        const highlight = new PIXI.Sprite(highlightResource.texture);
        highlight.visible = false;
        highlight.width = 30 * 2;
        highlight.height = 30 * 2;
        highlight.anchor.set(0.5);
        this.moonHighlight = highlight;
        moonContainer.addChild(highlight);

        const moon = new PIXI.Sprite(moonResource.texture);
        moon.width = 20 * 2;
        moon.height = 20 * 2;
        moon.anchor.set(0.5);
        moonContainer.addChild(moon);

        this.app.stage.addChild(moonContainer);
        return moonContainer;
    }

    drawMars(marsResource, highlightResource) {
        const pos = this.getMarsPos(this.props.marsAngle);

        const marsContainer = new PIXI.Container();
        marsContainer.name = 'mars';
        marsContainer.buttonMode = true;
        marsContainer.interactive = true;
        marsContainer.position = pos;
        marsContainer.position = this.orbitCenter;

        const highlight = new PIXI.Sprite(highlightResource.texture);
        highlight.visible = false;
        highlight.width = 30 * 2;
        highlight.height = 30 * 2;
        highlight.anchor.set(0.5);
        this.marsHighlight = highlight;
        marsContainer.addChild(highlight);

        const mars = new PIXI.Sprite(marsResource.texture);
        mars.width = 20 * 2;
        mars.height = 20 * 2;
        mars.anchor.set(0.5);
        marsContainer.addChild(mars);

        this.app.stage.addChild(marsContainer);
        return marsContainer;
    }
 
    /*
     * The earth's rotation in this view is determined by observerAngle.
     */
    drawEarth(earthResource, avatarResource, highlightResource) {
        const earthContainer = new PIXI.Container();
        earthContainer.pivot = this.orbitCenter;
        earthContainer.name = 'earth';
        earthContainer.buttonMode = true;
        earthContainer.interactive = true;
        earthContainer.position = this.orbitCenter;
        earthContainer.rotation = -this.props.observerAngle + degToRad(90);

        const highlight = new PIXI.Sprite(highlightResource.texture);
        highlight.visible = false;
        highlight.width = 50 * 2;
        highlight.height = 50 * 2;
        highlight.position = this.orbitCenter;
        highlight.anchor.set(0.5);
        this.earthHighlight = highlight;
        earthContainer.addChild(highlight);

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
        // Save the initial observer angle to use for offset.
        this.dragStartAngle = this.props.observerAngle;

        if (event.target.name === 'earth') {
            this.draggingEarth = true;
        } else if (event.target.name === 'moon') {
            this.draggingMoon = true;
        } else if (event.target.name === 'mars') {
            this.draggingMars = true;
        }
    }
    onDragEnd() {
        this.draggingEarth = false;
        this.draggingMoon = false;
        this.draggingMars = false;
        // set the interaction data to null
        this.data = null;
    }
    onEarthMove(e) {
        if (e.target && e.target.name === 'earth' &&
            !this.state.isHoveringOnEarth &&
            !this.draggingMoon && 
            !this.draggingMars
        ) {
            this.setState({isHoveringOnEarth: true});
        }
        if (!e.target && this.state.isHoveringOnEarth) {
            this.setState({isHoveringOnEarth: false});
        }

        // if (this.draggingEarth) {
        //     const newPosition = this.data.getLocalPosition(this.app.stage);

        //     // This angle starts at the center of the earth. It's the
        //     // difference, in radians, between where the cursor was and
        //     // where it is now.
        //     const vAngle =
        //         Math.atan2(newPosition.y - this.orbitCenter.y,
        //                    newPosition.x - this.orbitCenter.x);

        //     const offset = Math.atan2(
        //         this.dragStartPos.y - this.orbitCenter.y,
        //         this.dragStartPos.x - this.orbitCenter.x) + (Math.PI / 2);

        //     this.props.onObserverAngleUpdate(
        //         // Offset vAngle with initial angle, as well as current
        //         // dragging offset angle.
        //         -vAngle + offset + (this.dragStartAngle - (Math.PI / 2)));
        // }
    }

    onMoonMove(e) {
        if (e.target && e.target.name === 'moon' &&
            !this.state.isHoveringOnMoon &&
            !this.draggingEarth
        ) {
            this.setState({isHoveringOnMoon: true});
        }
        if (!e.target && this.state.isHoveringOnMoon) {
            this.setState({isHoveringOnMoon: false});
        }

        if (this.draggingMoon) {
            const newPosition = this.data.getLocalPosition(this.app.stage);

            // This angle starts at the center of the orbit. It's the
            // difference, in radians, between where the cursor was and
            // where it is now.
            let vAngle =
                -1 * Math.atan2(newPosition.y - this.orbitCenter.y,
                           newPosition.x - this.orbitCenter.x);

            // if (vAngle < 0) {
            //     vAngle = 2 * Math.PI + vAngle;
            // }
            this.props.onMoonAngleUpdate(vAngle);
        }
    }
    onMarsMove(e) {
        if (e.target && e.target.name === 'mars' &&
            !this.state.isHoveringOnMars &&
            !this.draggingEarth
        ) {
            this.setState({isHoveringOnMars: true});
        }
        if (!e.target && this.state.isHoveringOnMars) {
            this.setState({isHoveringOnMars: false});
        }

        if (this.draggingMars) {
            const newPosition = this.data.getLocalPosition(this.app.stage);

            const vAngle =
                -1 * Math.atan2(newPosition.y - this.orbitCenter.y,
                           newPosition.x - this.orbitCenter.x);

            this.props.onMarsAngleUpdate(vAngle);
        }
    }

    getMoonPos(phase) {
        return new PIXI.Point(
            this.props.radiusMoon * Math.cos(-phase) + this.orbitCenter.x,
            this.props.radiusMoon * Math.sin(-phase) + this.orbitCenter.y);   // this.radius used to be 200 * 2 for uppeer line as well
    }

    getMarsPos(phase) {
        return new PIXI.Point(
            this.props.radiusMars * Math.cos(-phase) + this.orbitCenter.x,
            this.props.radiusMars * Math.sin(-phase) + this.orbitCenter.y);   // this.radius used to be 200 * 2 for uppeer line as well
    }
}

MainView.propTypes = {
    observerAngle: PropTypes.number.isRequired,
    moonAngle: PropTypes.number.isRequired,
    marsAngle: PropTypes.number.isRequired,
    onObserverAngleUpdate: PropTypes.func.isRequired,
    onMoonAngleUpdate: PropTypes.func.isRequired,
    onMarsAngleUpdate: PropTypes.func.isRequired,
    showAngle: PropTypes.bool.isRequired,
    showTimeTickmarks: PropTypes.bool.isRequired,
    showLunarLandmark: PropTypes.bool.isRequired,
    stopAnimation: PropTypes.func.isRequired
};
