{/* <div className="row">

    <div className="col">
        <h4>Animation and Time Controls</h4>
        <button type="button" className="btn btn-primary btn-sm"
                onClick={this.onStartClick.bind(this)}>
            {startBtnText}
        </button>
        <form className="form-inline">
            <label htmlFor="diamRange">Animation rate:</label>
            <RangeStepInput name="animationRate"
                    className="form-control-range ml-2"
                    value={this.state.animationRate}
                    onChange={this.onAnimationRateChange.bind(this)}
                    step={0.1}
                    min={0.1} max={5} />
        </form>
    </div>

    <div className="col">
        Increment animation:
        <form className="form container increment-area">
            <div className="row">
                <div className="col">
                    <div className="form-group text-right">
                        <label>Day:</label>
                    </div>
                    <div className="form-group text-right">
                        <label>Hour:</label>
                    </div>
                    <div className="form-group text-right">
                        <label>Minute:</label>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <button
                            type="button"
                            onClick={this.onDecrementDay.bind(this)}
                            className="btn btn-outline-primary btn-sm">-</button>
                        <button
                            type="button"
                            onClick={this.onIncrementDay.bind(this)}
                            className="btn btn-outline-primary btn-sm ml-1">+</button>
                    </div>
                    <div className="form-group">
                        <button
                            type="button"
                            onClick={this.onDecrementHour.bind(this)}
                            className="btn btn-outline-primary btn-sm">-</button>
                        <button
                            type="button"
                            onClick={this.onIncrementHour.bind(this)}
                            className="btn btn-outline-primary btn-sm ml-1">+</button>
                    </div>
                    <div className="form-group">
                        <button
                            type="button"
                            onClick={this.onDecrementMinute.bind(this)}
                            className="btn btn-outline-primary btn-sm">-</button>
                        <button
                            type="button"
                            onClick={this.onIncrementMinute.bind(this)}
                            className="btn btn-outline-primary btn-sm ml-1">+</button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div className="col">
        <h4>Diagram Options</h4>
        <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input"
                    name="showAngle"
                    onChange={this.handleInputChange}
                    checked={this.state.showAngle}
                    id="showAngleToggle" />
            <label className="custom-control-label"
                    htmlFor="showAngleToggle">
                Show angle
            </label>
        </div>
        <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input"
                    name="showLunarLandmark"
                    onChange={this.handleInputChange}
                    checked={this.state.showLunarLandmark}
                    id="showLunarLandmarkToggle" />
            <label className="custom-control-label" htmlFor="showLunarLandmarkToggle">
                Show lunar landmark
            </label>
        </div>
        <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input"
                    name="showTimeTickmarks"
                    onChange={this.handleInputChange}
                    checked={this.state.showTimeTickmarks}
                    id="showTimeTickmarksToggle" />
            <label className="custom-control-label" htmlFor="showTimeTickmarksToggle">
                Show time tickmarks
            </label>
        </div>
    </div>

</div>





// import React from 'react';
// import PropTypes from 'prop-types';
// import * as PIXI from 'pixi.js';
// import {
//     forceNumber, degToRad, getPercentIlluminated,
//     roundToOnePlace, getPhaseSlot, getTimeSinceNewMoon, formatInterval
// } from './utils';

// export default class MoonPhaseView extends React.Component {
//     constructor(props) {
//         super(props);

//         this.id = 'MoonPhaseView'
//         this.moon = null;
//         this.radius = 100.5;

//         // width: 228, height: 215
//         this.center = new PIXI.Point(228 / 2, 215 / 2);
//     }
//     render() {
//         const phaseSlot = getPhaseSlot(this.props.moonAngle);
//         const timeSinceNewMoon = Math.round(
//             getTimeSinceNewMoon(this.props.moonAngle));
//         return <div>
//             <div style={{
//                 visibility: this.props.isHidden ? 'hidden' : 'visible'
//             }}>
//                 <select className="form-control form-control-sm"
//                         onChange={this.onMoonAngleUpdate.bind(this)}
//                         value={phaseSlot}>
//                     <option value={180}>New Moon</option>
//                     <option value={-135}>Waxing Crescent</option>
//                     <option value={-90}>First Quarter</option>
//                     <option value={-45}>Waxing Gibbous</option>
//                     <option value={0}>Full Moon</option>
//                     <option value={45}>Waning Gibbous</option>
//                     <option value={90}>Third Quarter</option>
//                     <option value={135}>Waning Crescent</option>
//                 </select>
//                 <div className="mt-1"
//                      ref={(thisDiv) => {this.el = thisDiv}} />
//                 <div className="text-center">
//                     {
//                         roundToOnePlace(getPercentIlluminated(
//                             this.props.moonAngle - Math.PI))
//                     }% illuminated
//                 </div>
//                 <div className="text-center">Time since new moon:</div>
//                 <div className="text-center">
//                     {formatInterval(timeSinceNewMoon)}
//                 </div>
//             </div>
//             <div className="text-right">
//                 <button type="button"
//                         onClick={this.props.onHideShowToggle}
//                         className="btn btn-primary btn-sm">
//                     {this.props.isHidden ? 'Show' : 'Hide'}
//                 </button>
//             </div>
//         </div>;
//     }
//     componentDidMount() {
//         const me = this;

//         this.app = new PIXI.Application({
//             width: this.center.x * 2,
//             height: this.center.y * 2
//         });
//         this.el.appendChild(this.app.view);

//         this.app.loader.add('moon', 'img/moon.png');

//         this.app.loader.load((loader, resources) => {
//             me.moon = resources.moon;
//             me.draw();
//         });
//     }
//     componentDidUpdate(prevProps) {
//         if (prevProps.moonAngle !== this.props.moonAngle) {
//             this.drawPhase(this.leftShade, this.rightShade,
//                            this.convertPhase(this.props.moonAngle));
//         }
//         if (prevProps.showLunarLandmark !== this.props.showLunarLandmark) {
//             this.lunarLandmark.visible = this.props.showLunarLandmark;
//         }
//     }
//     draw() {
//         this.drawMoon(this.app);
//         this.drawShades(this.app);
//         this.drawPhase(this.leftShade, this.rightShade,
//                        this.convertPhase(this.props.moonAngle));
//         this.drawLunarLandmark(this.app);
//     }
//     drawMoon(app) {
//         const moon = new PIXI.Sprite(this.moon.texture);
//         app.stage.addChild(moon);
//     }
//     drawShades(app) {
//         this.leftShade = new PIXI.Graphics();
//         this.leftShade.pivot = this.center;
//         this.rightShade = new PIXI.Graphics();
//         this.rightShade.pivot = this.center;

//         this.leftShade.beginFill(0x000000, 0.7);
//         this.leftShade.arc(this.center.x * 2, this.center.y * 2,
//                            this.radius, Math.PI / 2, -Math.PI / 2);
//         this.leftShade.endFill();
//         app.stage.addChild(this.leftShade);

//         this.rightShade.beginFill(0x000000, 0.7);
//         this.rightShade.arc(this.center.x * 2, this.center.y * 2,
//                             this.radius, -Math.PI / 2, Math.PI / 2);
//         this.rightShade.endFill();
//         app.stage.addChild(this.rightShade);

//         // When the moon is a crescent, use the opposite shade to
//         // create a mask, with only the shade part of the moon clearly
//         // visible. So, sometimes there are actually two moons on the
//         // screen, you just can't tell.
//         const hiddenMoon = new PIXI.Sprite(this.moon.texture);
//         hiddenMoon.visible = false;
//         app.stage.addChild(hiddenMoon);
//         this.hiddenMoon = hiddenMoon;
//     }
//     drawPhase(leftShade, rightShade, phase) {
//         if (phase <= 0.5) {
//             //leftShade.rotation = 0;
//             //rightShade.rotation = 0;
//             const scale = 1 - (phase * 4);
//             leftShade.scale.x = 1;
//             leftShade.position.x = 0;
//             rightShade.scale.x = scale;
//             rightShade.position.x = this.center.x - (scale * this.center.x);

//             if (phase > 0.25) {
//                 this.hiddenMoon.mask = this.rightShade;
//                 this.hiddenMoon.visible = true;
//             } else {
//                 this.hiddenMoon.mask = null;
//                 this.hiddenMoon.visible = false;
//             }
//         } else {
//             const scale = -phase * 4 + 3;

//             rightShade.scale.x = 1;
//             rightShade.position.x = 0;

//             if (phase < 0.75) {
//                 this.hiddenMoon.mask = this.leftShade;
//                 this.hiddenMoon.visible = true;
//                 leftShade.scale.x = -scale;
//                 leftShade.position.x = this.center.x - (-scale * this.center.x);
//             } else {
//                 this.hiddenMoon.mask = null;
//                 this.hiddenMoon.visible = false;
//                 leftShade.scale.x = -scale;
//                 leftShade.position.x =  this.center.x - (-scale * this.center.x);
//                 rightShade.scale.x = 1;
//                 rightShade.position.x = 0;
//             }
//         }
//     }
//     /**
//      * Get the moonPhase value that's used by the rest of the system
//      * ready for the moon phase painter.
//      *
//      * moonPhase is offset by pi (its initial value is Math.PI, see
//      * initial state in main.jsx), and also divide it by 2 * pi
//      * because moonPhase is in radians and the moon phase painter
//      * expects the phase to be a number between 0 and 1.
//      */
//     convertPhase(moonPhase) {
//         const phase = (moonPhase - Math.PI) / (Math.PI * 2);
//         if (phase > 1) {
//             return 0;
//         }
//         if (phase < 0) {
//             return phase + 1;
//         }
//         return phase;
//     }
//     drawLunarLandmark(app) {
//         const g = new PIXI.Graphics();
//         g.lineStyle(1, 0x000000);
//         g.beginFill(0xff95ff);
//         g.drawCircle(this.center.x, this.center.y, 8);
//         g.visible = this.props.showLunarLandmark;
//         app.stage.addChild(g);
//         this.lunarLandmark = g;
//     }
//     onMoonAngleUpdate(e) {
//         this.props.onMoonAngleUpdate(
//             degToRad(forceNumber(e.target.value))
//         );
//     }
// }

// MoonPhaseView.propTypes = {
//     moonAngle: PropTypes.number.isRequired,
//     onMoonAngleUpdate: PropTypes.func.isRequired,
//     showLunarLandmark: PropTypes.bool.isRequired,

//     isHidden: PropTypes.bool.isRequired,
//     onHideShowToggle: PropTypes.func.isRequired
// }; */}
