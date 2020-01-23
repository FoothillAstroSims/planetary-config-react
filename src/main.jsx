import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './MainView';
import ZodiacStrip from './ZodiacStrip';
import {RangeStepInput} from 'react-range-step-input';
import {degToRad, forceNumber} from './utils';

class PlanetaryConfigSim extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            /*
             * observerAngle refers to the angle of the observer on
             * the MainView. This is effectively the sun's position in
             * the sky.
             */
            observerAngle: Math.PI / 2,
            moonAngle: 0,//-Math.PI,
            marsAngle: 0,//-Math.PI,
            radiusMars: 80 * 2,
            radiusMoon: 150 * 2,
            multiplier:  Math.pow((160 / 300), 1.5),
            isPlaying: false,
            animationRate: 2,
            showAngle: false,
            showLunarLandmark: false,
            showTimeTickmarks: false,

            celestialSphereIsHidden: false,
            moonPhaseViewIsHidden: false
        };
        this.state = this.initialState;
        this.raf = null;

        // The moon's synodic period
        this.synodicPeriod = 29.530589;
        this.handleInputChange = this.handleInputChange.bind(this);

        this.stopAnimation = this.stopAnimation.bind(this);

        this.celestialSphereRef = React.createRef();
    }

    render() {
        let startBtnText = 'Play animation';
        if (this.state.isPlaying) {
            startBtnText = 'Pause Animation';
        }
        return <React.Fragment>
            <nav className="navbar navbar-expand-md navbar-light bg-light d-flex justify-content-between">
                <span className="navbar-brand mb-0 h1">Planetary Configurations Simulator</span>

                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={this.onResetClick.bind(this)}>Reset</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" data-toggle="modal" data-target="#helpModal">Help</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" data-toggle="modal" data-target="#aboutModal">About</a>
                    </li>
                </ul>
            </nav>
            <div className="row mt-2">
                <div className="col-8">
                    <MainView
                        observerAngle={this.state.observerAngle}
                        moonAngle={this.state.moonAngle}
                        marsAngle={this.state.marsAngle}
                        radiusMars={this.state.radiusMars}
                        radiusMoon={this.state.radiusMoon}
                        showAngle={this.state.showAngle}
                        showLunarLandmark={this.state.showLunarLandmark}
                        showTimeTickmarks={this.state.showTimeTickmarks}
                        onObserverAngleUpdate={this.onObserverAngleUpdate.bind(this)}
                        onMoonAngleUpdate={this.onMoonAngleUpdate.bind(this)}
                        onMarsAngleUpdate={this.onMarsAngleUpdate.bind(this)}
                        stopAnimation={this.stopAnimation}
                    />
                </div>
                <div className="rowx">
                    <div className="col">
                        <h4>Orbit Sizes</h4>
                        <form className="form-inline">
                            <label htmlFor="radMoonRange">Radius of moon's orbit</label>
                            <RangeStepInput name="radiusMoon"
                                    className="form-control-range ml-2"
                                    value={this.state.radiusMoon}
                                    onChange={this.onMoonRadiusChange.bind(this)}
                                    step={10}
                                    min={50} max={500} />
                        </form>
                        <form className="form-inline">
                            <label htmlFor="radMarsRange">Radius of Earth's orbit</label>
                            <RangeStepInput name="radiusMars"
                                    className="form-control-range ml-2"
                                    value={this.state.radiusMars}
                                    onChange={this.onMarsRadiusChange.bind(this)}
                                    step={10}
                                    min={50} max={500} />
                        </form>


                    </div>
                    <div className="col">
                        <h4>Animation Control</h4>
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
                                    min={3} max={10} />
                        </form>
                        
                    </div>
                </div>
                <div className="bot">
                    <h3>zodiac strip</h3>
                    {
                        <ZodiacStrip />
                    }
                </div>
            </div>
        </React.Fragment>;
    }

    // incrementAngle(n, inc) {
    //     const newAngle = n + inc;
    //     if (newAngle > Math.PI * 2) {
    //         return newAngle - Math.PI * 2;
    //     }
    //     return newAngle;
    // }
    // decrementAngle(n, dec) {
    //     const newAngle = n - dec;
    //     if (newAngle < 0) {
    //         return newAngle + Math.PI * 2;
    //     }
    //     return newAngle;
    // }
    incrementMoonAngle(n, inc) {
        const newAngle = n + inc;
        // if (newAngle > Math.PI) {
        //     return newAngle - Math.PI * 2;
        // }
        return newAngle;
    }
    incrementMarsAngle(n, inc) {
        const newAngle = (1 / this.state.multiplier) * this.state.moonAngle;
        // if (newAngle > Math.PI) {
        //     return newAngle - Math.PI * 2;
        // }
        return newAngle;
    }
    decrementMoonAngle(n, dec) {
        const newAngle = n - dec;
        if (newAngle < -Math.PI) {
            return newAngle + Math.PI * 2;
        }
        return newAngle;
    }
    animate() {
        const me = this;
        this.setState(prevState => ({
            // observerAngle: me.incrementAngle(
            //     prevState.observerAngle,
            //     0.03 * this.state.animationRate),
            marsAngle: me.incrementMarsAngle(
                prevState.marsAngle,
                0.010 * this.state.animationRate),
            moonAngle: me.incrementMoonAngle(
                prevState.moonAngle,
                0.010 * this.state.animationRate)
        }));
        this.raf = requestAnimationFrame(this.animate.bind(this));
    }
    onStartClick() {
        if (!this.state.isPlaying) {
            this.raf = requestAnimationFrame(this.animate.bind(this));
            this.setState({isPlaying: true});
        } else {
            this.stopAnimation();
            this.setState({isPlaying: false});
        }
    }
    onObserverAngleUpdate(newAngle) {
        this.stopAnimation();
        this.setState({
            isPlaying: false,
            observerAngle: newAngle
        });
    }
    onMoonAngleUpdate(newAngle) {
        this.stopAnimation();
        let diff = 0;
        let newAng = newAngle;
        let prevMoonAng = this.state.moonAngle;

        if (newAng >= (Math.PI / 2) && newAng <= Math.PI && prevMoonAng >= -Math.PI && prevMoonAng <= (-Math.PI / 2)) {
            diff = -(Math.abs(newAng - Math.PI) + Math.abs(-Math.PI - prevMoonAng));
        } else if (prevMoonAng >= (Math.PI / 2) && prevMoonAng <= Math.PI && newAng >= -Math.PI && newAng <= (-Math.PI / 2)) {
            diff = (Math.abs(prevMoonAng - Math.PI) + Math.abs(-Math.PI - newAng));
        } else {
            diff = newAng - this.state.moonAngle;
        }
        
        diff *= this.state.multiplier;
        let newMars = (this.state.marsAngle + diff); 

        this.setState({
            isPlaying: false,
            moonAngle: newAngle,
            marsAngle: newMars
        });
    }

    onMarsAngleUpdate(newAngle) {
        this.stopAnimation();
        let diff = 0;
        let newAng = newAngle;
        let prevMoonAng = this.state.marsAngle;
        // if (newAngle < 0) {
        //     newAng = 2 * Math.PI + newAngle;
        // }
        if (newAng >= (Math.PI / 2) && newAng <= Math.PI && prevMoonAng >= -Math.PI && prevMoonAng <= (-Math.PI / 2)) {
            diff = -(Math.abs(newAng - Math.PI) + Math.abs(-Math.PI - prevMoonAng));
        } else if (prevMoonAng >= (Math.PI / 2) && prevMoonAng <= Math.PI && newAng >= -Math.PI && newAng <= (-Math.PI / 2)) {
            diff = (Math.abs(prevMoonAng - Math.PI) + Math.abs(-Math.PI - newAng));
        } else {
            diff = newAng - this.state.marsAngle;
        }
        
       diff *= (1 / this.state.multiplier);
       let newMoon = (this.state.moonAngle + diff); 

       this.setState({
            isPlaying: false,
            marsAngle: newAngle,
            moonAngle: newMoon
        });
    }

    onAnimationRateChange(e) {
        this.setState({
            animationRate: forceNumber(e.target.value)
        });
    }

    onMoonRadiusChange(e) {
        let newMoonRad = forceNumber(e.target.value);
        // let newMultiplier = Math.pow((this.state.radiusMars / newMoonRad), 1.5);
        this.setState({
            radiusMoon: forceNumber(e.target.value),
            // multiplier: newMultiplier
        });
        // this.changeMultiplier.bind(this);
    }

    onMarsRadiusChange(e) {
        let newMarsRad = forceNumber(e.target.value);
        // let newMultiplier = Math.pow((newMarsRad / this.state.radiusMoon), 1.5);
        this.setState({
            radiusMars: newMarsRad,
            // multiplier: newMultiplier
        });
        // this.changeMultiplier.bind(this);
    }

    // We need to refactor the aboove 2 functions to just call this one
    // changeMultiplier() {
    //     console.log("changing multiplier");
    //     let newMultiplier = Math.pow((this.state.radiusMars / this.state.radiusMoon), 1.5);
    //     this.setState({
    //         multiplier: newMultiplier
    //     });
    //     console.log(multiplier);
    // }

    
    getMoonObserverPos(observerAngle, moonAngle) {
        return observerAngle + Math.PI - moonAngle;
    }

    // getMarsObserverPos(observerAngle, marsAngle) {
    //     return observerAngle + Math.PI - marsAngle;
    // }

    // TODO: can probably refactor this into something better
    onDecrementDay() {
    }

    onIncrementDay() {
    }
    onDecrementHour() {
    }
    onIncrementHour() {
    }
    onDecrementMinute() {
    }
    onIncrementMinute() {
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ?
                      target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    stopAnimation() {
        cancelAnimationFrame(this.raf);
    }
    onResetClick(e) {
        e.preventDefault();
        this.stopAnimation();
        this.setState(this.initialState);

        // Reset the orbitControls camera
        if (this.celestialSphereRef && this.celestialSphereRef.current) {
            this.celestialSphereRef.current.onResetClicked();
        }
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<PlanetaryConfigSim />, domContainer);
