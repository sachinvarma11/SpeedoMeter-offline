import { Application } from '@nativescript/core';
import { Geolocation, enableLocationRequest } from '@nativescript/geolocation';

// Initialize location services when the application starts
Application.on(Application.launchEvent, async () => {
    try {
        const hasPermissions = await Geolocation.hasPermissions();
        if (!hasPermissions) {
            await Geolocation.requestPermissions();
        }
        await enableLocationRequest(true);
    } catch (err) {
        console.error('Error initializing location services:', err);
    }
});

Application.run({ moduleName: 'app-root' });