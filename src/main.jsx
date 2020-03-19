import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './MainView';
import ZodiacStrip from './ZodiacStrip';
import { forceNumber } from './utils';

class PlanetaryConfigSim extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            targetFixed: true,
            observerPlanetAngle: 0,
            targetPlanetAngle: 0,
            radiusObserverPlanet: 1.00,
            radiusTargetPlanet: 2.40,
            radiusPixelObserver: 166.66,
            radiusPixelTarget: 400,
            maximumPixelRadius: 400,
            observerMultiplier: Math.pow(1.0, -1.5),
            targetMultiplier:  Math.pow(2.4, -1.5),
            animationRate: 1.5,
            targetAngle: 0,
            sunAngle: -Math.PI,
            elongationAngle: -Math.PI,
            optionObserver: 0,
            optionTarget: 0,
            observerName: 'observer planet',
            targetName: 'target planet',
            holdObserver: 1.00,
            holdTarget: 2.40,
            labelOrbits: true,
            showElongation: false,
            zoomOut: false,
            startBtnText: 'start animation',
            isPlaying: false,
            days: 0
        };

        this.state = this.initialState;
        this.raf = null;

        this.stopAnimation = this.stopAnimation.bind(this);
    }

    render() {
        return <React.Fragment>
            <nav className="navbar navbar-expand-md navbar-light bg-dark d-flex justify-content-between">
                <span className="navbar-brand mb-0 text-light h1">Planetary Configurations Simulator</span>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link text-light" href="#" onClick={this.onResetClick.bind(this)}>Reset</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="#" data-toggle="modal" data-target="#helpModal">Help</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="#" data-toggle="modal" data-target="#aboutModal">About</a>
                    </li>
                </ul>
            </nav>
            <div className="row mt-2">
                <div className="col-8">
                    <MainView
                        targetPlanetAngle={this.state.targetPlanetAngle}
                        observerPlanetAngle={this.state.observerPlanetAngle}
                        radiusTargetPlanet={this.state.radiusPixelTarget}
                        radiusObserverPlanet={this.state.radiusPixelObserver}
                        onTargetPlanetAngleUpdate={this.onTargetPlanetAngleUpdate.bind(this)}
                        onObserverPlanetAngleUpdate={this.onObserverPlanetAngleUpdate.bind(this)}
                        stopAnimation={this.stopAnimation}
                        targetAngle={this.state.targetAngle}
                        sunAngle={this.state.sunAngle}
                        elongationAngle={this.state.elongationAngle}
                        targetName={this.state.targetName}
                        observerName={this.state.observerName}
                        labelOrbits={this.state.labelOrbits}
                        showElongation={this.state.showElongation}
                        zoomOut={this.state.zoomOut}
                    />
                </div>
                <div className="rowx">
                    <div className="col">
                        <h4 id="text">Orbit Sizes</h4>
                        <div className="radiusText">
                            <label htmlFor="radObserverPlanetRange" id="text">Radius of observer planet's orbit (AU):</label>
                        </div>

                        <div className="observerInput">
                            <form onSubmit={this.onSubmitObserver.bind(this)}>
                                <input
                                    className="input"
                                    type="number"
                                    min={0.25}
                                    max={10.00}
                                    step={0.01}
                                    value={this.state.holdObserver}
                                    onChange={this.changeValObserver.bind(this)}
                                />
                            </form>
                        </div>

                        <div className="observerSlider">
                            <input
                                type="range"
                                min={0.25}
                                max={10.00}
                                step={0.01}
                                value={this.state.radiusObserverPlanet}
                                onChange={this.onObserverPlanetRadiusChange.bind(this)}
                            />
                        </div>

                        <div className="observerPresets">
                            <select className="form-control form-control-sm"
                                    onChange={this.onPresetSelectObserver.bind(this)}
                                    value={this.state.optionObserver}>
                                <option value={0} defaultValue>*preset*</option>
                                <option value={1}>Mercury</option>
                                <option value={2}>Venus</option>
                                <option value={3}>Earth</option>
                                <option value={4}>Mars</option>
                                <option value={5}>Jupiter</option>
                                <option value={6}>Saturn</option>
                                <option value={7}>Arbitrary Observer</option>
                            </select>
                        </div>

                        <div className="radiusText">
                            <label htmlFor="radTargetPlanetRange" id="text">Radius of target planet's orbit (AU):</label>
                        </div>
                        <div className="targetInput">
                            <form onSubmit={this.onSubmitTarget.bind(this)}>
                                <input
                                    className="input"
                                    type="number"
                                    min={0.25}
                                    max={10.00}
                                    step={0.01}
                                    value={this.state.holdTarget}
                                    onChange={this.changeValTarget.bind(this)}
                                />
                            </form>
                        </div>

                        <div className="targetSlider">
                            <input
                                type="range"
                                min={0.25}
                                max={10.00}
                                step={0.01}
                                value={this.state.radiusTargetPlanet}
                                onChange={this.onTargetPlanetRadiusChange.bind(this)}
                            />
                        </div>

                        <div className="targetPresets">
                            <select className="form-control form-control-sm"
                                    onChange={this.onPresetSelectTarget.bind(this)}
                                    value={this.state.optionTarget}>
                                <option value={0} defaultValue>*preset*</option>
                                <option value={1}>Mercury</option>
                                <option value={2}>Venus</option>
                                <option value={3}>Earth</option>
                                <option value={4}>Mars</option>
                                <option value={5}>Jupiter</option>
                                <option value={6}>Saturn</option>
                                <option value={7}>Arbitrary Target</option>
                            </select>
                        </div>
                    </div>

                    <div className="col">
                        <h4 id="text">Animation Control</h4>
                        <div className="animationText">
                            <label htmlFor="diamRange" id="text">Speed:</label>
                        </div>
                        <div className="animationSlider">
                            <input
                                type="range"
                                step={0.1}
                                min={0.1}
                                max={Math.PI}
                                value={this.state.animationRate}
                                onChange={this.onAnimationRateChange.bind(this)}
                            />
                        </div>
                        <div className="animationButton">
                            <button type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={this.onStartClick.bind(this)}>
                                {this.state.startBtnText}
                            </button>
                        </div>
                    </div>

                    <div className="controls">
                        <div className="custom-control custom-checkboxes">
                            <input type="checkbox"
                                   onChange={this.showOrbits.bind(this)}
                                   checked={this.state.labelOrbits}
                                   id="orbits-display"
                            />
                            <label className="" htmlFor="orbits-display" id="text">
                                Label Orbits
                            </label>
                        </div>

                        <div className="custom-control custom-checkbox">
                            <input type="checkbox"
                                   onChange={this.showElongationAngle.bind(this)}
                                   checked={this.state.showElongation}
                                   id="angle-display"
                            />
                            <label className="" htmlFor="angle-display" id="text">
                                Show Elongation Angle
                            </label>
                        </div>

                        <div className="custom-control custom-checkbox">
                            <input type="checkbox"
                                   onChange={this.displayZoomOut.bind(this)}
                                   checked={this.state.zoomOut}
                                   id="zoom-out-display"
                            />
                            <label className="" htmlFor="zoom-out-display" id="text">
                                Zoom Out to View Constellations
                            </label>
                        </div>
                    </div>

                    <div className="controls">
                        <div className="custom-control custom-checkboxes">
                            <p>Earth Days Elapsed: {this.state.days.toFixed(0).slice(-6)}</p>
                        </div>
                    </div>

                    <div className="survey">
                        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=n7L3RQCxQUyAT7NBighZStjAWTIFlutChq8ZZEGLLMdUNTJOMEw5TkRPWUExTUREQzRLR0FDV0FBVi4u"
                           target="_blank"
                           rel="noopener noreferrer">
                            <button type="button" className="btn btn-warning">Give us feedback!</button>
                        </a>
                    </div>

                </div>

                <div className="bot">
                    <ZodiacStrip
                        speed={this.state.animationRate}
                        observerPlanetAngle={this.state.observerPlanetAngle}
                        targetPlanetAngle={this.state.targetPlanetAngle}
                        radiusObserverPlanet={this.state.radiusPixelObserver}
                        radiusTargetPlanet={this.state.radiusPixelTarget}
                        isPlaying={this.state.isPlaying}
                        stopAnimation={this.stopAnimation}
                        updateAngles={this.updateAngles.bind(this)}
                    />
                </div>
            </div>
        </React.Fragment>;
    }

    incrementObserverPlanetAngle(n, inc) {
        const newAngle = n + (this.state.observerMultiplier * inc);
        if (newAngle > Math.PI) {
            return newAngle * -1;
        }
        return newAngle;
    }

    incrementTargetPlanetAngle(n, inc) {
        const newAngle = n + (this.state.targetMultiplier * inc);
        if (newAngle > Math.PI) {
            return newAngle * -1;
        }
        return newAngle;
    }

    incrementDays() {
        let ang = this.state.observerPlanetAngle;
        let elapsed = (ang / (2 * Math.PI)) * 365;
        if (ang < 0) {
            elapsed = ((2 * Math.PI + ang) / (2 * Math.PI)) * 365;
        }
        elapsed *= (1 / this.state.observerMultiplier);
        return elapsed;
    }

    animate() {
        const me = this;
        this.updateMultiplier();
        this.setState(prevState => ({
            observerPlanetAngle: me.incrementObserverPlanetAngle(prevState.observerPlanetAngle, 0.0115 * this.state.animationRate),
            targetPlanetAngle: me.incrementTargetPlanetAngle(prevState.targetPlanetAngle, 0.0115 * this.state.animationRate),
            days: me.incrementDays()
        }));

        this.raf = requestAnimationFrame(this.animate.bind(this));
    }

    onStartClick() {
        if (!this.state.isPlaying) {
            this.raf = requestAnimationFrame(this.animate.bind(this));
            this.setState({
                isPlaying: true,
                startBtnText: 'stop animation'
            });
        } else {
            this.stopAnimation();
            this.setState({
                isPlaying: false,
                startBtnText: 'start animation'
            });
        }
    }

    updateAngles(targetAng, sunAng, elongationAng) {
        this.setState({
            targetAngle: targetAng,
            sunAngle: sunAng,
            elongationAngle: elongationAng
        });
    }

    updateMultiplier() {
        let newObserver = Math.pow(this.state.radiusObserverPlanet, -1.5);
        let newTarget = Math.pow(this.state.radiusTargetPlanet, -1.5);

        this.setState({
            targetMultiplier: newTarget,
            observerMultiplier: newObserver,
        });
    }

    onObserverPlanetAngleUpdate(newAngle) {
        this.stopAnimation();
        let diff = 0;
        let newAng = newAngle;
        let prevObserverPlanetAng = this.state.observerPlanetAngle;

        if (newAng >= (Math.PI / 2) && newAng <= Math.PI && prevObserverPlanetAng >= -Math.PI
            && prevObserverPlanetAng <= (-Math.PI / 2)) {
            diff = -(Math.abs(newAng - Math.PI) + Math.abs(-Math.PI - prevObserverPlanetAng));
        } else if (prevObserverPlanetAng >= (Math.PI / 2) && prevObserverPlanetAng <= Math.PI
            && newAng >= -Math.PI && newAng <= (-Math.PI / 2)) {
            diff = (Math.abs(prevObserverPlanetAng - Math.PI) + Math.abs(-Math.PI - newAng));
        } else {
            diff = newAng - this.state.observerPlanetAngle;
        }

        this.updateMultiplier();
        diff *= this.state.targetMultiplier / this.state.observerMultiplier;
        let newTargetPlanet = (this.state.targetPlanetAngle + diff);
        if (newTargetPlanet >= Math.PI) {
            newTargetPlanet = -Math.PI;
        } else if (newTargetPlanet <= -Math.PI) {
            newTargetPlanet = Math.PI;
        }

        this.setState({
            isPlaying: false,
            observerPlanetAngle: newAngle,
            targetPlanetAngle: newTargetPlanet,
            days: this.incrementDays()
        });
    }

    onTargetPlanetAngleUpdate(newAngle) {
        this.stopAnimation();
        let diff = 0;
        let newAng = newAngle;
        let prevObserverPlanetAng = this.state.targetPlanetAngle;

        if (newAng >= (Math.PI / 2) && newAng <= Math.PI && prevObserverPlanetAng >= -Math.PI
            && prevObserverPlanetAng <= (-Math.PI / 2)) {
            diff = -(Math.abs(newAng - Math.PI) + Math.abs(-Math.PI - prevObserverPlanetAng));
        } else if (prevObserverPlanetAng >= (Math.PI / 2) && prevObserverPlanetAng <= Math.PI
            && newAng >= -Math.PI && newAng <= (-Math.PI / 2)) {
            diff = (Math.abs(prevObserverPlanetAng - Math.PI) + Math.abs(-Math.PI - newAng));
        } else {
            diff = newAng - this.state.targetPlanetAngle;
        }

        this.updateMultiplier();
        diff *= this.state.observerMultiplier / this.state.targetMultiplier;
        let newObserverPlanet = (this.state.observerPlanetAngle + diff);
        if (newObserverPlanet >= Math.PI) {
            newObserverPlanet = -Math.PI;
        } else if (newObserverPlanet <= -Math.PI) {
            newObserverPlanet = Math.PI;
        }

        this.setState({
            isPlaying: false,
            targetPlanetAngle: newAngle,
            observerPlanetAngle: newObserverPlanet,
            days: this.incrementDays()
        });
    }

    onAnimationRateChange(e) {
        this.setState({
            animationRate: forceNumber(e.target.value)
        });
    }

    onPresetSelectObserver(e) {
        let name = "";
        if (e.target.value == 0) {
            this.onObserverPlanetRadiusChange(1.00);
            name = "observer planet";
        } else if (e.target.value == 1) {
            this.onObserverPlanetRadiusChange(0.39);
            name = "observer (mercury)";
        } else if (e.target.value == 2) {
            this.onObserverPlanetRadiusChange(0.72);
            name = "observer (venus)";
        } else if (e.target.value == 3) {
            this.onObserverPlanetRadiusChange(1.00);
            name = "observer (earth)";
        } else if (e.target.value == 4) {
            this.onObserverPlanetRadiusChange(1.52);
            name = "observer (mars)";
        } else if (e.target.value == 5) {
            this.onObserverPlanetRadiusChange(5.20);
            name = "observer (jupiter)";
        } else if (e.target.value == 6) {
            this.onObserverPlanetRadiusChange(9.54);
            name = "observer (saturn)";
        } else {
            name = "observer planet";
        }

        this.setState({
            observerName: name,
            optionObserver: e.target.value
        });

    }

    onPresetSelectTarget(e) {
        let name = "";

        if (e.target.value == 0) {
            this.onTargetPlanetRadiusChange(2.40);
            name = "target planet";
        } else if (e.target.value == 1) {
            this.onTargetPlanetRadiusChange(0.39);
            name = "target (mercury)";
        } else if (e.target.value == 2) {
            this.onTargetPlanetRadiusChange(0.72);
            name = "target (venus)";
        } else if (e.target.value == 3) {
            this.onTargetPlanetRadiusChange(1.00);
            name = "target (earth)";
        } else if (e.target.value == 4) {
            this.onTargetPlanetRadiusChange(1.52);
            name = "target (mars)";
        } else if (e.target.value == 5) {
            this.onTargetPlanetRadiusChange(5.20);
            name = "target (jupiter)";
        } else if (e.target.value == 6) {
            this.onTargetPlanetRadiusChange(9.54);
            name = "target (saturn)";
        } else if (e.target.value == 7) {
            name = "target planet";
        }

        this.setState({
            targetName: name,
            optionTarget: e.target.value,
        });
    }

    onObserverPlanetRadiusChange(e, maxPix) {
        let au = 0;

        let maximumPixel = this.state.maximumPixelRadius;
        if (maxPix) {
            maximumPixel = maxPix;
        }

        if (typeof(e) === 'object') {
            au = e.target.value;
            this.setState({
                observerName: "observer planet",
                holdObserver: au,
            });
        } else {
            au = e;
            this.setState({
                holdObserver: au,
            });
        }

        if (au >= this.state.radiusTargetPlanet) {
            this.changeTarget(au, maximumPixel);
        } else {
            let ratio = (au / this.state.radiusTargetPlanet) * maximumPixel;
            this.setState({
                radiusPixelObserver: forceNumber(ratio),
                radiusObserverPlanet: forceNumber(au),
                radiusPixelTarget: maximumPixel,
            });
        }

        this.setState({
            optionObserver: 7,
        });

        this.updateMultiplier();
    }

    changeObserver(au, maximumPixel) {
        let ratio = (this.state.radiusObserverPlanet / au) * maximumPixel;

        this.setState({
            radiusTargetPlanet: forceNumber(au),
            radiusPixelObserver: forceNumber(ratio),
            radiusPixelTarget: maximumPixel,
        });
    }

    onTargetPlanetRadiusChange(e, maxPix) {
        let au = 0;

        let maximumPixel = this.state.maximumPixelRadius;
        if (maxPix) {
            maximumPixel = maxPix;
        }

        if (typeof(e) === 'object') {
            au = e.target.value;
            this.setState({
                targetName: "target planet",
                holdTarget: au,
            });
        } else {
            au = e;
            this.setState({
                holdTarget: au,
            });
        }

        if (au >= this.state.radiusObserverPlanet) {
            this.changeObserver(au, maximumPixel);
        } else {
            let ratio = (au / this.state.radiusObserverPlanet) * maximumPixel;
            this.setState({
                radiusPixelTarget: forceNumber(ratio),
                radiusTargetPlanet: forceNumber(au),
                radiusPixelObserver: maximumPixel,
            });
        }

        this.setState({
            optionTarget: 7
        });

        this.updateMultiplier();
    }

    changeTarget(au, maximumPixel) {
        let ratio = (this.state.radiusTargetPlanet / au) * maximumPixel;

        this.setState({
            radiusObserverPlanet: forceNumber(au),
            radiusPixelTarget: forceNumber(ratio),
            radiusPixelObserver: maximumPixel,
        });
    }

    showOrbits(e) {
        this.setState({
            labelOrbits: !this.state.labelOrbits
        });
    }

    showElongationAngle(e) {
        this.setState({
            showElongation: !this.state.showElongation
        });
    }

    displayZoomOut(e) {
        let newRad = 400;
        if (!this.state.zoomOut) {
            newRad = 175;
        }

        this.setState({
            zoomOut: !this.state.zoomOut,
            maximumPixelRadius: newRad,
        });

        this.onTargetPlanetRadiusChange(this.state.radiusTargetPlanet, newRad);
    }

    stopAnimation() {
        cancelAnimationFrame(this.raf);
    }

    onResetClick(e) {
        e.preventDefault();
        this.stopAnimation();
        this.setState(this.initialState);
    }

    onSubmitObserver(e) {
        e.preventDefault();
        this.onObserverPlanetRadiusChange(this.state.holdObserver);
    }

    onSubmitTarget(e) {
        e.preventDefault();
        this.onTargetPlanetRadiusChange(this.state.holdTarget);
    }

    changeValObserver(e) {
        let enteredValue = e.target.value;

        // This functionality ensures you cannoot
        // enter the same radius value for both
        // target and observer. But since the Prof didn't want it,
        // it's commented out for now.

        // let otherVal = this.state.holdTarget;
        // if (enteredValue == otherVal) {
        //     if (otherVal == 10.0) {
        //         enteredValue -= 0.01;
        //     } else {
        //         enteredValue += 0.01;
        //     }
        // }

        this.setState({holdObserver: enteredValue});
    }

    changeValTarget(e) {
        let enteredValue = e.target.value;

        // This functionality ensures you cannoot
        // enter the same radius value for both
        // target and observer. But since the Prof didn't want it,
        // it's commented out for now.

        // let otherVal = this.state.holdObserver;
        // if (enteredValue == otherVal) {
        //     if (otherVal == 10.0) {
        //         enteredValue -= 0.01;
        //     } else {
        //         enteredValue += 0.01;
        //     }
        // }

        this.setState({holdTarget: enteredValue});
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<PlanetaryConfigSim />, domContainer);
