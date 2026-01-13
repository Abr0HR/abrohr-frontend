# AbrO HR Mobile App - Architecture & Development Plan

**Timeline:** Phase 2 (Q2-Q3 2026)
**Current Status:** Architecture Design Phase
**Target Launch:** April 2026 (Beta), June 2026 (Production)

## Executive Summary

The mobile app is critical for Phase 2 success, enabling employees to:
- Check-in/out from anywhere
- View attendance records
- Request leaves
- Receive real-time notifications
- Work offline

## Technical Stack

### Frontend Framework
- **React Native** - Cross-platform (iOS/Android)
- **Expo** - Development and build management
- **Redux** - State management
- **React Navigation** - Navigation framework
- **React Native Paper** - UI components

### Backend Integration
- **Axios** - HTTP requests
- **Socket.io-client** - Real-time updates
- **AsyncStorage** - Local data persistence
- **NetInfo** - Network detection

### Key Libraries
```json
{
  "dependencies": {
    "react-native": "0.71.x",
    "expo": "^48.0.0",
    "redux": "^4.2.0",
    "react-redux": "^8.0.0",
    "react-native-paper": "^5.0.0",
    "react-navigation": "^6.0.0",
    "axios": "^1.3.0",
    "socket.io-client": "^4.5.0",
    "@react-native-community/async-storage": "^1.12.0",
    "@react-native-community/netinfo": "^9.0.0",
    "react-native-geolocation-service": "^5.3.0",
    "react-native-gesture-handler": "^2.9.0",
    "react-native-reanimated": "^2.13.0"
  }
}
```

## Project Structure

```
mobile-app/
├── src/
│   ├── screens/          # Screen components
│   │   ├── auth/         # Login, signup screens
│   │   ├── home/         # Dashboard
│   │   ├── attendance/   # Check-in/out
│   │   ├── leaves/      # Leave requests
│   │   ├── profile/     # User profile
│   │   └── settings/    # App settings
│   ├── components/       # Reusable components
│   ├── services/        # API, WebSocket services
│   ├── store/           # Redux store
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Helper functions
│   ├── navigation/      # Navigation config
│   └── App.js           # Root component
├── app.json           # Expo config
├── package.json
└── eas.json           # EAS build config
```

## Core Features - Phase 2 MVP

### 1. Authentication
```javascript
// Screen: LoginScreen.js
- Email + Password login
- Error handling
- Biometric login (fingerprint)
- Secure token storage
```

### 2. Dashboard
```javascript
// Screen: HomeScreen.js
Features:
- Attendance status (checked in/out)
- Quick punch button
- Leave balance
- Pending leaves
- Today's schedule
- Recent attendance history
```

### 3. Attendance Tracking
```javascript
// Screen: AttendanceScreen.js
Features:
- Geolocation capture
- Real-time punch-in/out with timestamp
- Location history
- Offline punch (sync when online)
- Photo verification
- Attendance history (last 30 days)
```

### 4. Leave Management
```javascript
// Screen: LeaveScreen.js
Features:
- View leave balance
- Request new leave
- Select date range
- Choose leave type (sick, personal, etc.)
- Add reason/notes
- View pending/approved leaves
- Leave history
```

### 5. Profile & Settings
```javascript
// Screen: ProfileScreen.js
Features:
- View employee information
- Edit profile (if enabled)
- Notification preferences
- App settings
- Logout
```

## Key Implementation Details

### Offline Capability
```javascript
// offline/OfflineQueue.js
class OfflineQueue {
  async addAction(action, data) {
    // Save to AsyncStorage
    const queue = await this.getQueue();
    queue.push({ action, data, timestamp });
    await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
  }

  async syncWhenOnline() {
    // Monitor network connectivity
    // Sync queued actions when online
    // Implement retry logic
  }
}
```

### Geolocation Integration
```javascript
// services/LocationService.js
import Geolocation from 'react-native-geolocation-service';

const getLocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        // Verify accuracy (within 100m of office)
        resolve({ latitude, longitude, accuracy });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );
  });
};
```

### Real-Time WebSocket Connection
```javascript
// services/WebSocketService.js
class WebSocketService {
  connect() {
    this.socket = io(API_URL, {
      auth: {
        token: this.getAuthToken()
      },
      reconnection: true
    });

    this.socket.on('attendance_updated', (data) => {
      store.dispatch(updateAttendance(data));
    });
  }
}
```

### Biometric Authentication
```javascript
// services/BiometricService.js
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const enableBiometric = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  
  if (compatible && enrolled) {
    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      // Proceed with login
    }
  }
};
```

## Development Timeline

### Week 1-2: Project Setup
- [ ] Initialize React Native project (Expo)
- [ ] Set up navigation structure
- [ ] Configure Redux store
- [ ] Setup development environment

### Week 3-4: Core Screens
- [ ] Authentication screens (Login)
- [ ] Dashboard/Home screen
- [ ] Navigation integration
- [ ] API service integration

### Week 5-6: Features
- [ ] Attendance check-in/out
- [ ] Leave request system
- [ ] Profile screen
- [ ] Real-time updates (WebSocket)

### Week 7-8: Advanced Features
- [ ] Geolocation integration
- [ ] Offline mode
- [ ] Biometric login
- [ ] Push notifications

### Week 9-10: Testing & Polish
- [ ] Unit testing
- [ ] Integration testing
- [ ] Bug fixes
- [ ] Performance optimization

### Week 11-12: Deployment
- [ ] Build for iOS (TestFlight)
- [ ] Build for Android (Google Play Beta)
- [ ] Create app store listings
- [ ] Submit for review

## Testing Strategy

### Unit Tests (Jest)
```javascript
// __tests__/services/AttendanceService.test.js
describe('AttendanceService', () => {
  it('should punch in successfully', async () => {
    const result = await AttendanceService.punchIn({
      latitude: 28.5355,
      longitude: 77.3910
    });
    expect(result.status).toBe('success');
  });
});
```

### Integration Tests (Detox)
```javascript
// e2e/firstTest.e2e.js
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully', async () => {
    await element(by.id('email')).typeText('test@abrohr.com');
    await element(by.id('password')).typeText('password123');
    await element(by.label('Sign In')).multiTap();
    await waitFor(element(by.text('Home'))).toBeVisible().withTimeout(5000);
  });
});
```

## Deployment Configuration

### EAS Build Setup
```json
{
  "build": {
    "production": {
      "node": "18.0.0",
      "npm": "9.0.0",
      "env": {
        "REACT_APP_API_URL": "https://api.abrohr.com",
        "REACT_APP_WS_URL": "wss://api.abrohr.com"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "track": "beta"
      },
      "ios": {
        "testflightGroup": "Beta Testers"
      }
    }
  }
}
```

## Performance Targets

- App startup time: <3 seconds
- Punch-in latency: <1 second
- Offline sync time: <10 seconds when online
- Bundle size: <50MB
- Memory usage: <200MB
- Battery impact: <5% per hour usage

## Security Considerations

1. **Token Storage**
   - Use Secure Store for auth tokens
   - Implement token refresh
   - Auto-logout after 24 hours inactivity

2. **Data Protection**
   - Encrypt sensitive data at rest
   - HTTPS only communication
   - Certificate pinning

3. **Biometric Security**
   - Fallback to password if unavailable
   - Verify biometric data server-side

## Monitoring & Analytics

```javascript
// Monitor app crashes
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableInExpoDevelopment: true
});

// Track events
import { Analytics } from '@react-native-firebase/analytics';

const analytics = new Analytics();
analytics.logEvent('punch_in', { location: 'office' });
```

## Success Metrics

- **Downloads:** 10K+ in first month
- **Daily Active Users (DAU):** 60%+ of registered employees
- **Check-in Rate:** 90%+ through mobile
- **Crash Rate:** <0.5%
- **User Rating:** 4.5+ stars
- **Offline Usage:** 30%+ of punches

## Next Steps

1. Set up development environment
2. Create project repository
3. Build authentication screens
4. Integrate with backend API
5. Implement offline queue
6. Begin internal testing

---

**Status:** Ready for development start
**Target Completion:** June 2026
**Team Size:** 1 React Native Developer (+ support from web team)
