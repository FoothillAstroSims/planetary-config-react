// hello and welcome friends.
// This code is quite hideous, and
// is in need of some major refactoring

// Tbh, most of it can be understood if you
// think about it for a couple min.

// But if you need clarification, just PM me
// on discord

// - sudo-safi

import React from 'react';
// import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';
// import { degToRad, radToDeg, roundToOnePlace } from './utils';

const getPlanetPos = function(radius, phase) {
    return new PIXI.Point(
        radius * Math.cos(-phase) + 600,
        radius * Math.sin(-phase) + 460); // these magic numbers come from this.orbitCenter
}


export default class ZodiacStrip extends React.Component {
    constructor(props) {
        super(props);        

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);

    }
    render()  {
        return (
            <div className="ZodiacStrip" 
                ref={(thisDiv) => {this.el = thisDiv}} />
        );
    }

    componentDidMount() {
        this.app = new PIXI.Application({
            width: 600,
            height: 197,
            backgroundColor: 0x231f20,
            antialias: true,
        });

        this.el.appendChild(this.app.view);

        // Loads all the images
        this.app.loader.add('targetPlanet', 'img/mars.png')
            .add('sunZodiac', 'img/sun.png');

        const me = this;
        this.app.loader.load((loader, resources) => {
            me.resources = resources;

            const stage = new PIXI.Container();
            this.app.stage.addChild(stage);

            const zodiacStrip = new PIXI.Sprite(
		        PIXI.Texture.from('img/zodiac-strip.png')
	        );

            zodiacStrip.y += 50;
            console.log("posiiton of the sprite:", zodiacStrip.y);
            stage.addChild(zodiacStrip);

            me.sunZodiacContainer = me.drawSunZodiac(resources.sun);
            me.targetPlanetZodiacContainer = me.drawTargetPlanetZodiac(
                resources.targetPlanet);
            me.g = me.drawLine();
            me.text = me.drawText();
            me.zodiacText = me.drawZodiac(); 
            me.start();
        });
    }

    drawLine() {
        const g = new PIXI.Graphics();
        g.visible = false;

        g.clear();
        g.lineStyle(6, 0xffe040);
        g.beginFill(0xffe200, 0.7);

        this.app.stage.addChild(g);
        return g;
    }

    drawText() {
        const angleText = new PIXI.Text('Angle', {
            fontFamily: 'Arial',
            fontSize: 45,
            fontWeight: 'bold',
            fill: 0x39696, //0xffff80,
            align: 'center'
        });

        // angleText.rotation = degToRad(-90);
        angleText.position.x = 255;
        angleText.position.y = 150;
        this.app.stage.addChild(angleText);
        return angleText;
    }

    drawZodiac() {
        const zodiacText = new PIXI.Text('Zodiac Strip', {
            fontFamily: 'Arial',
            fontSize: 30,
            // fontWeight: 'bold',
            fill: 0x39696, //0xffff80,
            align: 'center'
        });

        // angleText.rotation = degToRad(-90);
        zodiacText.position.x = 0;
        zodiacText.position.y = 0;
        this.app.stage.addChild(zodiacText);
        return zodiacText;
    }

    // Uncomment and modify to draw east and then add support to draw west
//    drawEastAndWest() {
//        const east = new PIXI.Text('East', {
//            fontFamily: 'Arial',
//            fontSize: 28 * 2,
//            fontWeight: 'bold',
//            fill: 0xffff80,
//            align: 'center'
//        });
//        east.rotation = degToRad(-90);
//        east.position.x = 14 * 2;
//        east.position.y = 270 * 2;
//        this.app.stage.addChild(east);
//    }

    drawSunZodiac() {

        const sunZodiacContainer = new PIXI.Container();
        sunZodiacContainer.name = 'sunZodiac';
        sunZodiacContainer.position = new PIXI.Point(600 / 4, 48.5 + 50);

        const sunZodiac = new PIXI.Sprite(PIXI.Texture.from('img/sun.png'));
        sunZodiac.anchor.set(0.5);
        sunZodiac.width = 40;
        sunZodiac.height = 40;
        sunZodiacContainer.addChild(sunZodiac);
        
        this.app.stage.addChild(sunZodiacContainer);
        return sunZodiacContainer;

    }

    drawTargetPlanetZodiac(targetPlanetResource) {

        const targetPlanetContainer = new PIXI.Container();
        targetPlanetContainer.name = 'targetPlanetZodiac';
        targetPlanetContainer.position = new PIXI.Point(3 * 600 / 4, 48.5 + 50);

        const targetPlanetImage = new PIXI.Sprite(targetPlanetResource.texture);
        targetPlanetImage.anchor.set(0.5);
        targetPlanetImage.width = 30;
        targetPlanetImage.height = 30;
        targetPlanetContainer.addChild(targetPlanetImage);
        
        this.app.stage.addChild(targetPlanetContainer);
        return targetPlanetContainer;
    }
    
    
    componentWillUnmount() {
        this.app.stop();
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    } 

    stop() {
        cancelAnimationFrame(this.frameId)
    } 

    getElongationAngle() {
        let targetPos = getPlanetPos(this.props.radiusTargetPlanet, this.props.targetPlanetAngle);
        let observerPos = getPlanetPos(this.props.radiusObserverPlanet, this.props.observerPlanetAngle);

        let distBetweenObserverAndTarget = this.getDistance(targetPos, observerPos);

        let elongAngle = Math.pow(distBetweenObserverAndTarget, 2)
                            + Math.pow(this.props.radiusObserverPlanet, 2)
                            - Math.pow(this.props.radiusTargetPlanet, 2);
        elongAngle /= (2 * this.props.radiusObserverPlanet * distBetweenObserverAndTarget);
        elongAngle = Math.acos(elongAngle);
        
        let a1 = this.props.radiusTargetPlanet - this.props.radiusObserverPlanet;
        let a2 = this.props.radiusTargetPlanet - this.props.radiusObserverPlanet;

        // console.log(a1, a2);

        // console.log("Elongation angle: ", elongAngle);
        return elongAngle;
    }

    getDistance(targetPos, observerPos) {
        let diffX = Math.pow((targetPos.x - observerPos.x), 2);
        let diffY = Math.pow((targetPos.y - observerPos.y), 2);

        return Math.pow((diffX + diffY), 0.5);
    }

    updateAngle(elongationAngle) {

        this.g.clear();
        this.g.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y);
        this.g.visible = true;
        this.g.lineStyle(6, 0xffe040);
        this.g.beginFill(0xffe200, 0.7);

        this.g.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y);

    }

    updateText(newAngle) {
        this.text.text = newAngle + '°';
    }

    animate() {

    	let angle = this.props.observerPlanetAngle / (2 * Math.PI); 
        
        if (this.props.observerPlanetAngle >= -Math.PI && this.props.observerPlanetAngle < 0) {
            angle = this.props.observerPlanetAngle + (2 * Math.PI);
            angle /= (2 * Math.PI);
        }
    
        if (angle > 0.75 && angle < 1.0) {
            angle -= 1;
        }
    
        let elongAngle = this.getElongationAngle() / (2 * Math.PI);

        this.sunZodiacContainer.position.x = 150 + angle * 600;
        this.targetPlanetZodiacContainer.x = this.sunZodiacContainer.position.x + elongAngle * 600;

        if (this.targetPlanetZodiacContainer.x > 600) {
            this.targetPlanetZodiacContainer.x -= 600;            
        }

        this.updateAngle(elongAngle);

        let num = Math.round(this.getElongationAngle() * 180 / Math.PI * 10) / 10;

        let textNum = Number(Math.round(num +'e2')+'e-2');
        this.updateText(textNum);

    	this.frameId = requestAnimationFrame(this.animate);

    }
}

// ZodiacStrip.propTypes = {
//     deltaAngle: Proptypes.number.isRequired,
//     getElongationAngle: Proptypes.func.isRequired
// };

