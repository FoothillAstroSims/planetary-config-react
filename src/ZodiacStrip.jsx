import React from 'react';
import * as PIXI from 'pixi.js';

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

        this.tpa = 0;
        this.sa = 0;
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

        const me = this;
        this.app.loader.load((loader, resources) => {
            me.resources = resources;

            const stage = new PIXI.Container();
            this.app.stage.addChild(stage);

            const zodiacStrip = new PIXI.Sprite(
		        PIXI.Texture.from('img/zodiac-strip.png')
	        );

            zodiacStrip.y += 50;
            stage.addChild(zodiacStrip);

            me.targetPlanetZodiacContainer = me.drawTargetPlanetZodiac();

            me.sunZodiacContainer = me.drawSunZodiac();
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
        g.lineStyle(2, 0x00FFD2);
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
        angleText.position.x = 240;
        angleText.position.y = 150;
        this.app.stage.addChild(angleText);
        return angleText;
    }
    drawZodiac() {
        const zodiacText = new PIXI.Text('Zodiac Strip with Constellations', {
            fontFamily: 'Arial',
            fontSize: 30,
            // fontWeight: 'bold',
            fill: 0x39696, //0xffff80,
            align: 'center'
        });

        // angleText.rotation = degToRad(-90);
        zodiacText.position.x = 100;
        zodiacText.position.y = 7;
        this.app.stage.addChild(zodiacText);
        return zodiacText;
    }
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
    drawTargetPlanetZodiac() {

        const targetPlanetContainer = new PIXI.Container();
        targetPlanetContainer.name = 'targetPlanetZodiac';
        targetPlanetContainer.position = new PIXI.Point(3 * 600 / 4, 48.5 + 50);

        const targetPlanetImage = new PIXI.Sprite(PIXI.Texture.from('img/mars.png'));
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

        let observerPos = getPlanetPos(this.props.radiusObserverPlanet, this.props.observerPlanetAngle);
        let targetPos = getPlanetPos(this.props.radiusTargetPlanet, this.props.targetPlanetAngle);
        let sunPos = new PIXI.Point(0, 0); 

        observerPos.x -= 600;
        observerPos.y -= 460;

        observerPos.y *= -1;
        
        targetPos.x -= 600;
        targetPos.y -= 460;

        targetPos.y *= -1;

        let targetPlanetAngle = Math.atan2(targetPos.y - observerPos.y, targetPos.x - observerPos.x);
        let sunAngle = Math.atan2(sunPos.y - observerPos.y, sunPos.x - observerPos.x);


        this.tpa = targetPlanetAngle;
        this.sa = sunAngle;

        if (-Math.PI < sunAngle && sunAngle < 0) {
            sunAngle += 2 * Math.PI;
        }

        if (-Math.PI < targetPlanetAngle && targetPlanetAngle < 0) {
            targetPlanetAngle += 2 * Math.PI;
        }

        let elongAngle = targetPlanetAngle - sunAngle;
        
        let e = elongAngle * 180 / Math.PI;
        let s = sunAngle * 180 / Math.PI;
        let t = targetPlanetAngle * 180 / Math.PI;

        if (elongAngle < 0) {
            elongAngle += 2 * Math.PI;
        }

        //console.log("Earth position: ", observerPos, "Target position: ", targetPos, "Sun Position: ", sunPos);
        //console.log("Elongation Angle: ", e, "Sun Angle: ", s, "Target Planet Angle: ", t);
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
        this.g.lineStyle(2, 0x00f2ff);
        this.g.beginFill(0x00f2ff, 0.7);

        this.g.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y);

    }
    updateText(newAngle) {
        this.text.text = newAngle + '°';
    }
    animate() {

       // let a1 = -1 * this.props.observerPlanetAngle;

       // let angle = a1 / (2 * Math.PI); 
       // 
       // if (a1 >= -Math.PI && a1 < 0) {
       //     angle = a1 + (2 * Math.PI);
       //     angle /= (2 * Math.PI);
       // }
    
       // if (angle > 0.75 && angle < 1.0) {
       //     angle -= 1;
       // }


    	let angle = this.sa / (2 * Math.PI); 
        
        if (this.sa >= -Math.PI && this.sa < 0) {
            angle = this.sa + (2 * Math.PI);
            angle /= (2 * Math.PI);
        }
    
        if (angle > 0.75 && angle < 1.0) {
            angle -= 1;
        }

        angle *= -1;

    	let angle2 = this.tpa / (2 * Math.PI); 
        
        if (this.tpa >= -Math.PI && this.tpa < 0) {
            angle2 = this.tpa + (2 * Math.PI);
            angle2 /= (2 * Math.PI);
        }
    
        if (angle2 > 0.75 && angle2 < 1.0) {
            angle2 -= 1;
        }

        angle2 *= -1;


        let elongAngle = this.getElongationAngle() / (2 * Math.PI);

        // console.log('111tp angle: ', this.tpa * 180 / Math.PI, 's angle: ', this.sa * 180 / Math.PI);

        this.sunZodiacContainer.position.x = 450 + angle * 600;
        this.targetPlanetZodiacContainer.x = 450 + angle2 * 600;
        
        if (this.targetPlanetZodiacContainer.x > 600) {
            this.targetPlanetZodiacContainer.x -= 600;            
        }

        this.updateAngle(elongAngle);

        let num = Math.round(this.getElongationAngle() * 180 / Math.PI * 10) / 10;

        let direction = ' E';
        if (num > 180) {
            let temp = num - 180;
            num -= temp * 2;
            direction = ' W ';
        }

        let textNum = Number(Math.round(num +'e2')+'e-2');
        textNum += direction;

        this.updateText(textNum);

    	this.frameId = requestAnimationFrame(this.animate);

    }
}

// ZodiacStrip.propTypes = {
//     deltaAngle: Proptypes.number.isRequired,
//     getElongationAngle: Proptypes.func.isRequired
// };

