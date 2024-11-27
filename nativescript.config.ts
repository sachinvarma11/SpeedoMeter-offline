import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.speedometer',
  appPath: 'app',
  appResourcesPath: '../../tools/assets/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    permissions: [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION'
    ]
  },
  ios: {
    disclosureNames: {
      "NSLocationWhenInUseUsageDescription": "This app needs access to location services to show your current speed.",
      "NSLocationAlwaysUsageDescription": "This app needs access to location services to show your current speed.",
      "NSLocationAlwaysAndWhenInUseUsageDescription": "This app needs access to location services to show your current speed."
    }
  }
} as NativeScriptConfig;