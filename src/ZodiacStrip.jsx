import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';

const getPlanetPos = function(radius, phase) {
    return new PIXI.Point(
        // these magic numbers come from this.orbitCenter
        radius * Math.cos(-phase) + 600,
        radius * Math.sin(-phase) + 460);
};

export default class ZodiacStrip extends React.Component {
    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);

        this.targetPlanetLongitude = 0;
        this.sunLongitude = 0;
    }

    render() {
        return (
            <div className="ZodiacStrip"
                ref={(thisDiv) => {this.el = thisDiv;}} />
        );
    }

    componentDidMount() {
        this.app = new PIXI.Application({
            width: 600,
            height: 197,
            backgroundColor: 0x241B23,
            antialias: true,
        });

        this.el.appendChild(this.app.view);

        const me = this;
        const stage = new PIXI.Container();
        this.app.stage.addChild(stage);

        const zodiacStrip = new PIXI.Sprite(
            PIXI.Texture.from('img/zodiac-strip.png')
        );

        zodiacStrip.y += 50;
        stage.addChild(zodiacStrip);

        me.targetPlanetZodiacContainer = me.drawTargetPlanetZodiac();
        me.sunZodiacContainer = me.drawSunZodiac();

        me.directLine = me.drawLine();
        me.wrapAroundLine = me.drawLine();

        me.angleText = me.drawAngleText();
        me.angleDirectionText = me.drawAngleDirectionText();
        me.sunName = me.drawPlanetText('Sun', me.sunZodiacContainer.x, me.sunZodiacContainer.y);
        me.targetName = me.drawPlanetText('Planet', me.targetPlanetZodiacContainer.x, me.targetPlanetZodiacContainer.y);
        me.zodiacText = me.drawZodiac();

        me.start();
    }

    drawLine() {
        const g = new PIXI.Graphics();
        g.visible = false;

        g.clear();
        g.lineStyle(2, 0xe8c3c3);
        g.beginFill(0x99c9ac, 0.7);  // 0xffe200

        this.app.stage.addChild(g);
        return g;
    }

    drawPlanetText(name, x, y) {
        const planetText = new PIXI.Text(name, {
            fontFamily: 'Garamond',
            fontSize: 14,
            // fontWeight: 'bold',
            fill: 0xe4d1a0, // butter
            // fill: 0xFFD700, // gold
        });

        // angleText.rotation = degToRad(-90);
        planetText.resolution = 3;
        planetText.anchor.set(0.5);
        planetText.position.x = x;
        planetText.position.y = y - 60;
        this.app.stage.addChild(planetText);

        return planetText;

    }

    drawAngleText() {
        const angleText = new PIXI.Text('Angle', {
            fontFamily: 'Garamond',
            fontSize: 42,
            fill: 0xe4d1a0,  // butter
            // fill: 0xFFD700, // gold
        });

        angleText.resolution = 2;
        angleText.anchor.set(0.5);
        angleText.position.x = 300;
        angleText.position.y = 175;
        this.app.stage.addChild(angleText);

        return angleText;
    }

    drawAngleDirectionText() {
        const angleDirectionText = new PIXI.Text('W', {
            fontFamily: 'Garamond',
            fontSize: 42,
            fill: 0xe4d1a0,
        });

        angleDirectionText.resolution = 2;
        angleDirectionText.anchor.set(0.5);
        angleDirectionText.position.x = 375;
        angleDirectionText.position.y = 175;
        this.app.stage.addChild(angleDirectionText);

        return angleDirectionText;
    }

    drawZodiac() {
        const zodiacText = new PIXI.Text('Zodiac Strip', {
            fontFamily: 'Garamond',
            fontSize: 24,
            // fontWeight: 'bold',
            fill: 0xe4d1a0, // butter
            // fill: 0xFFD700, // gold
        });

        zodiacText.resolution = 2;
        zodiacText.anchor.set(0.5);
        zodiacText.position.x = 300;
        zodiacText.position.y = 15;
        this.app.stage.addChild(zodiacText);

        return zodiacText;
    }

    drawSunZodiac() {

        const sunZodiacContainer = new PIXI.Container();
        sunZodiacContainer.name = 'sunZodiac';
        sunZodiacContainer.position = new PIXI.Point(600 / 4, 48.5 + 50);

        const sunZodiac = new PIXI.Sprite(PIXI.Texture.from('img/sun-circle.png'));
        sunZodiac.anchor.set(0.5);
        sunZodiac.width = 20;
        sunZodiac.height = 20;
        sunZodiacContainer.addChild(sunZodiac);

        this.app.stage.addChild(sunZodiacContainer);

        return sunZodiacContainer;

    }

    drawTargetPlanetZodiac() {

        const targetPlanetContainer = new PIXI.Container();
        targetPlanetContainer.name = 'targetPlanetZodiac';
        targetPlanetContainer.position = new PIXI.Point(3 * 600 / 4, 48.5 + 50);

        const targetPlanetImage = new PIXI.Sprite(PIXI.Texture.from('img/grey-circle.png'));
        targetPlanetImage.anchor.set(0.5);
        targetPlanetImage.width = 15;
        targetPlanetImage.height = 15;
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
        cancelAnimationFrame(this.frameId);
    }

    getElongationAngle() {
        let observerPos = getPlanetPos(this.props.radiusObserverPlanet, this.props.observerPlanetAngle);
        let targetPos = getPlanetPos(this.props.radiusTargetPlanet, this.props.targetPlanetAngle);
        let sunPos = new PIXI.Point(0, 0);

        observerPos.x -= 600;
        observerPos.y -= 460;

        observerPos.y *= -1;

        targetPos.x -= 600;
        targetPos.y -= 460;

        targetPos.y *= -1;
        this.updateZIndex(observerPos, targetPos);

        let targetPlanetAngle = Math.atan2(targetPos.y - observerPos.y, targetPos.x - observerPos.x);
        let sunAngle = Math.atan2(sunPos.y - observerPos.y, sunPos.x - observerPos.x);

        this.targetPlanetLongitude = targetPlanetAngle;
        this.sunLongitude = sunAngle;

        let holdSunAng = sunAngle;
        let holdTargetPlanetAng = targetPlanetAngle;

        if (-Math.PI < sunAngle && sunAngle < 0) {
            sunAngle += 2 * Math.PI;
        }

        if (-Math.PI < targetPlanetAngle && targetPlanetAngle < 0) {
            targetPlanetAngle += 2 * Math.PI;
        }

        let elongationAngle = targetPlanetAngle - sunAngle;

        if (elongationAngle < 0) {
            elongationAngle += 2 * Math.PI;
        }

        let propsElongAngle = elongationAngle;

        if (propsElongAngle > Math.PI) {
            let temp = propsElongAngle - Math.PI;
            propsElongAngle -= temp * 2;
        }

        this.props.updateAngles(holdSunAng, holdTargetPlanetAng, propsElongAngle);

        return elongationAngle;
    }

    getDistance(targetPos, observerPos) {
        let diffX = Math.pow((targetPos.x - observerPos.x), 2);
        let diffY = Math.pow((targetPos.y - observerPos.y), 2);

        return Math.pow((diffX + diffY), 0.5);
    }

    updateLine(elongationAngle) {
        this.wrapAroundLine.clear();
        this.directLine.clear();
        let downShift = -40;
        let xS = 17;

        this.directLine.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y - downShift);
        this.directLine.visible = true;
        this.directLine.lineStyle(2, 0xa64e4e);

        this.wrapAroundLine.visible = false;
        this.wrapAroundLine.lineStyle(2, 0xa64e4e);

        let targetX = this.targetPlanetZodiacContainer.x;
        let sunX = this.sunZodiacContainer.x;

        if (elongationAngle >= 180) {

            if (sunX < targetX) {
                this.directLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - downShift);
            } else if (sunX > targetX) {
                this.wrapAroundLine.visible = true;
                this.directLine.lineTo(600, this.targetPlanetZodiacContainer.y - downShift);
                this.wrapAroundLine.moveTo(0, this.sunZodiacContainer.y - downShift);
                this.wrapAroundLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - downShift);
            }
            let size = Math.abs(sunX - targetX);
            this.drawElongationArrow(this.directLine, -xS, 1, size);
            this.drawElongationArrow(this.directLine, -xS, -1, size);
        } else if (elongationAngle < 180) {
            if (sunX > targetX) {
                this.directLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - downShift);
            } else if (sunX < targetX) {
                this.wrapAroundLine.visible = true;
                this.directLine.lineTo(0, this.targetPlanetZodiacContainer.y - downShift);
                this.wrapAroundLine.moveTo(600, this.sunZodiacContainer.y - downShift);
                this.wrapAroundLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - downShift);
            }
            let size = Math.abs(sunX - targetX);
            this.drawElongationArrow(this.directLine, xS, -1, size);
            this.drawElongationArrow(this.directLine, xS, 1, size);
        }

        // Does bottom vertical line for target planet
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y + 15);
        this.directLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y + 57);

        // Does bottom vertical line for sun
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y + 15);
        this.directLine.lineTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y + 57);

        // Does top vertical line for target planet
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - 15);
        this.directLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - 35);

        // Does top vertical line for sun
        this.directLine.lineStyle(2, 0xa64e4e);
        this.directLine.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y - 15);
        this.directLine.lineTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y - 50);

        this.sunName.x = this.sunZodiacContainer.x;
        this.sunName.y = this.sunZodiacContainer.y - 60;

        this.targetName.x = this.targetPlanetZodiacContainer.x;
        this.targetName.y = this.targetPlanetZodiacContainer.y - 45;
    }

    drawElongationArrow(line, xShift, yShift, size) {
        let actualXShift = xShift;
        let thicc = 2.0;
        let downShift = -40;
        if (size < 30){
            actualXShift = size / 30 * xShift;
            thicc = (size / 30) * 2.0;
        }
        line.lineStyle(thicc, 0xa64e4e);
        line.moveTo(this.targetPlanetZodiacContainer.x + actualXShift, this.targetPlanetZodiacContainer.y - downShift + (yShift * 7));
        line.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y - downShift+ (-1 * yShift));
    }

    updateText(newAngle) {
        this.angleText.text = newAngle;
    }

    updateDirection(direction) {
        this.angleDirectionText.text = direction;
    }

    updateZodiacBodyPos(longitude, body, width) {
     	let angle = longitude / (2 * Math.PI);

        if (longitude >= -Math.PI && longitude < 0) {
            angle = longitude + (2 * Math.PI);
            angle /= (2 * Math.PI);
        }

        if (angle > 0.75 && angle < 1.0) {
            angle -= 1;
        }

        angle *= -1;
        body.x = 450 + (angle * (600 + width));
    }

    updateZIndex(observer, target) {

        if (this.props.radiusObserverPlanet < this.props.radiusTargetPlanet) {
            this.app.stage.setChildIndex(this.sunZodiacContainer, 2);
            this.app.stage.setChildIndex(this.targetPlanetZodiacContainer, 1);

            return;
        }

        let distObsTarget = this.getDistance(observer, target);
        let distObsSun = this.getDistance(observer, new PIXI.Point(0, 0));

        if (distObsTarget > distObsSun) {
            this.app.stage.setChildIndex(this.sunZodiacContainer, 2);
            this.app.stage.setChildIndex(this.targetPlanetZodiacContainer, 1);
        } else {
            this.app.stage.setChildIndex(this.sunZodiacContainer, 1);
            this.app.stage.setChildIndex(this.targetPlanetZodiacContainer, 2);
        }
    }

    animate() {
        let elongationAngle = this.getElongationAngle();

        // The 0s are for the width value of the body
        this.updateZodiacBodyPos(this.sunLongitude, this.sunZodiacContainer, 0);  // should be 20
        this.updateZodiacBodyPos(this.targetPlanetLongitude, this.targetPlanetZodiacContainer, 0);  // should be 15

        let num = elongationAngle * 180 / Math.PI;
        this.updateLine(num);

        let direction = 'E';
        if (num > 180) {
            let temp = num - 180;
            num -= temp * 2;
            direction = 'W ';
        }

        if (num == 0 || num == 180) {
            direction = '';
        }

        let textNum = String(" " + num.toFixed(0)).slice(-6);
        textNum += '°';

        this.updateText(textNum);
        this.updateDirection(direction);

        this.frameId = requestAnimationFrame(this.animate);

    }
}

// These are all the parameters that MUST be passed
// Into ZodiacStrip by main.jsx
ZodiacStrip.propTypes = {
    radiusObserverPlanet: PropTypes.number.isRequired,
    observerPlanetAngle: PropTypes.number.isRequired,
    radiusTargetPlanet: PropTypes.number.isRequired,
    targetPlanetAngle: PropTypes.number.isRequired,

    updateAngles: PropTypes.func.isRequired
};
