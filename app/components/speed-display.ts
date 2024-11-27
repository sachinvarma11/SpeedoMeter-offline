import { EventData, Page, Observable, Application } from '@nativescript/core';
import { Geolocation, getCurrentLocation, Location } from '@nativescript/geolocation';
import { SpeedUtil } from '../utils/speed';

export class SpeedDisplayModel extends Observable {
    private _speed: string = '0';
    private _unit: string = 'MPH';
    private _statusMessage: string = 'Initializing GPS...';
    private _isMetric: boolean = false;
    private _watchId: number;

    constructor() {
        super();
        
        // Initialize location monitoring
        setTimeout(() => {
            this.initializeGeolocation();
        }, 1000);

        Application.on(Application.suspendEvent, () => {
            this.cleanupGeolocation();
        });

        Application.on(Application.resumeEvent, () => {
            this.initializeGeolocation();
        });
    }

    get speed(): string {
        return this._speed;
    }

    get unit(): string {
        return this._unit;
    }

    get statusMessage(): string {
        return this._statusMessage;
    }

    get toggleButtonText(): string {
        return `Switch to ${this._isMetric ? 'MPH' : 'KM/H'}`;
    }

    async initializeGeolocation() {
        try {
            const hasPermissions = await Geolocation.hasPermissions();
            if (!hasPermissions) {
                await Geolocation.requestPermissions();
            }

            const isEnabled = await Geolocation.isEnabled();
            if (!isEnabled) {
                await Geolocation.enableLocationRequest(true);
            }

            this.startWatchingLocation();
        } catch (error) {
            console.error('Location initialization error:', error);
            this._statusMessage = 'Error: Unable to access GPS';
            this.notifyPropertyChange('statusMessage', this._statusMessage);
        }
    }

    startWatchingLocation() {
        if (this._watchId) {
            Geolocation.clearWatch(this._watchId);
        }

        const options = {
            desiredAccuracy: 3,
            updateDistance: 1,
            minimumUpdateTime: 100
        };

        this._watchId = Geolocation.watchLocation(
            (location: Location) => {
                if (location && typeof location.speed === 'number') {
                    const speedMps = Math.max(0, location.speed);
                    const convertedSpeed = this._isMetric 
                        ? SpeedUtil.mpsToKmh(speedMps)
                        : SpeedUtil.mpsToMph(speedMps);
                    
                    this._speed = Math.round(convertedSpeed).toString();
                    this._statusMessage = '';
                    
                    this.notifyPropertyChange('speed', this._speed);
                    this.notifyPropertyChange('statusMessage', this._statusMessage);
                }
            },
            (error) => {
                console.error('Location watch error:', error);
                this._statusMessage = `Error: ${error.message}`;
                this.notifyPropertyChange('statusMessage', this._statusMessage);
            },
            options
        );
    }

    toggleUnit() {
        this._isMetric = !this._isMetric;
        this._unit = this._isMetric ? 'KM/H' : 'MPH';
        
        this.notifyPropertyChange('unit', this._unit);
        this.notifyPropertyChange('toggleButtonText', this.toggleButtonText);
    }

    cleanupGeolocation() {
        if (this._watchId) {
            Geolocation.clearWatch(this._watchId);
            this._watchId = null;
        }
    }

    onUnloaded() {
        this.cleanupGeolocation();
        Application.off(Application.suspendEvent);
        Application.off(Application.resumeEvent);
    }
}

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new SpeedDisplayModel();
}