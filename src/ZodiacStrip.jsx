import React from 'react';
// import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';
// import { degToRad, radToDeg, roundToOnePlace } from './utils';

export default class ZodiacStrip extends React.Component {
    constructor(props) {
        super(props);
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
            height: 97,
            backgroundColor: 0xcccccc,
            antialias: true,

            // as far as I know the ticker isn't necessary at the
            // moment.
            sharedTicker: true
        });

        this.el.appendChild(this.app.view);

        const stage = new PIXI.Container();
        this.app.stage.addChild(stage);

        const zodiacStrip = new PIXI.Sprite(PIXI.Texture.from('img/zodiac-strip.png'));
        // zodiacStrip.anchor.set(0.5);
        // zodiacStrip.x = 200;
        // zodiacStrip.y = 200;
        stage.addChild(zodiacStrip);

        const sunImage = new PIXI.Sprite(PIXI.Texture.from('img/sun.png'));
        sunImage.anchor.set(0.5);
        sunImage.width = 50;
        sunImage.height = 50;
        sunImage.x = 500;
        sunImage.y = 62.5;
        stage.addChild(sunImage);

        const moonImage = new PIXI.Sprite(PIXI.Texture.from('img/mars.png'));
        moonImage.anchor.set(0.5);
        moonImage.width = 25;
        moonImage.height = 25;
        moonImage.x = 300;
        moonImage.y = 62.5;
        stage.addChild(moonImage);

        // this.start();
    }
    /*
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
    animate() {
        this.frameId = requestAnimationFrame(this.animate);
    }
    */
}