import { Geolocation } from '@nativescript/geolocation';

export class SpeedUtil {
    static mpsToMph(mps: number): number {
        return mps * 2.23694;
    }

    static mpsToKmh(mps: number): number {
        return mps * 3.6;
    }

    static async checkLocationServices(): Promise<boolean> {
        try {
            const hasPermissions = await Geolocation.hasPermissions();
            if (!hasPermissions) {
                await Geolocation.requestPermissions();
            }

            const isEnabled = await Geolocation.isEnabled();
            if (!isEnabled) {
                await Geolocation.enableLocationRequest(true);
            }

            return true;
        } catch (error) {
            console.error('Error checking location services:', error);
            return false;
        }
    }
}