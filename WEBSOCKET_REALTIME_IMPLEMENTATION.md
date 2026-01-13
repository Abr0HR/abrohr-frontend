# WebSocket & Real-Time Implementation Guide

## Overview
This guide covers implementing real-time features in AbrO HR using WebSocket technology. Current status: Starting implementation in Q1 2026.

## Architecture

### Tech Stack
- **Backend:** Node.js + Express + Socket.io
- **Frontend:** React + Socket.io-client + Redux
- **Message Queue:** Bull + Redis
- **Database:** PostgreSQL + change triggers

### System Architecture
```
Client (React + Socket.io) 
    ↓ WebSocket Connection (ws://)
    ↓ Handshake + Authentication
    ↓
Socket.io Server (Node.js)
    ↓ Event Processing
    ↓ Message Queue (Bull/Redis)
    ↓
API Server + Database (PostgreSQL)
    ↓ Database Triggers
    ↓ Change Notifications
    ↓
Back to Connected Clients (Real-time Sync)
```

## Phase 1: Backend Implementation (Weeks 1-2)

### 1.1 Install Dependencies

```bash
npm install socket.io express-jwt cors
npm install bull redis uuid
npm install --save-dev socket.io-client
```

### 1.2 Socket.io Server Setup

**File: backend/src/websocket/socketServer.js**

```javascript
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const redis = require('redis');

let io;
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Store connected users: { socketId: userId }
const connectedUsers = new Map();

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.companyId = decoded.companyId;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  // Connection event
  io.on('connection', (socket) => {
    const userId = socket.userId;
    connectedUsers.set(socket.id, userId);
    
    console.log(`User ${userId} connected`);
    
    // Join user-specific room
    socket.join(`user_${userId}`);
    // Join company room for broadcasts
    socket.join(`company_${socket.companyId}`);

    // Attendance Events
    socket.on('punch_in', handlePunchIn);
    socket.on('punch_out', handlePunchOut);
    socket.on('attendance_update', handleAttendanceUpdate);

    // Leave Requests
    socket.on('leave_request', handleLeaveRequest);
    socket.on('leave_approve', handleLeaveApprove);

    // Dashboard Updates
    socket.on('request_live_dashboard', handleLiveDashboard);

    // Disconnect
    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

module.exports = {
  initializeSocket,
  getIO,
  connectedUsers
};
```

### 1.3 Event Handlers

**File: backend/src/websocket/eventHandlers.js**

```javascript
const { getIO } = require('./socketServer');
const AttendanceService = require('../services/AttendanceService');
const NotificationService = require('../services/NotificationService');

async function handlePunchIn(socket, data) {
  try {
    const { employeeId, timestamp, location } = data;
    
    // Save to database
    const attendance = await AttendanceService.createPunchIn({
      employeeId,
      punchInTime: timestamp,
      location
    });

    // Notify managers
    const io = getIO();
    io.to(`manager_company_${socket.companyId}`)
      .emit('attendance_punch_in', {
        employeeId,
        timestamp,
        location,
        status: 'success'
      });

    // Send confirmation to user
    socket.emit('punch_in_confirmed', {
      id: attendance.id,
      timestamp
    });

  } catch (error) {
    socket.emit('error', { message: error.message });
  }
}

async function handlePunchOut(socket, data) {
  // Similar structure to handlePunchIn
}

async function handleLeaveRequest(socket, data) {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = data;
    
    const leaveRequest = await LeaveService.createRequest({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason
    });

    // Notify managers
    const io = getIO();
    io.to(`manager_company_${socket.companyId}`)
      .emit('leave_request_new', {
        id: leaveRequest.id,
        employeeId,
        leaveType,
        startDate,
        endDate
      });

  } catch (error) {
    socket.emit('error', { message: error.message });
  }
}

module.exports = {
  handlePunchIn,
  handlePunchOut,
  handleLeaveRequest
};
```

### 1.4 Server Integration

**File: backend/src/server.js (Modified)**

```javascript
const express = require('express');
const http = require('http');
const { initializeSocket } = require('./websocket/socketServer');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
initializeSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
```

## Phase 2: Frontend Implementation (Weeks 2-3)

### 2.1 Socket.io Client Setup

**File: frontend/src/services/WebSocketService.js**

```javascript
import io from 'socket.io-client';
import store from '../store';

let socket = null;

const WebSocketService = {
  connect: () => {
    const token = localStorage.getItem('authToken');
    const wsUrl = process.env.REACT_APP_WS_URL || 'http://localhost:5000';
    
    socket = io(wsUrl, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      store.dispatch({ type: 'SET_WS_CONNECTED', payload: true });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      store.dispatch({ type: 'SET_WS_CONNECTED', payload: false });
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      store.dispatch({ type: 'SET_WS_ERROR', payload: error });
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
    }
  },

  // Attendance Events
  punchIn: (data) => {
    socket.emit('punch_in', data);
  },

  punchOut: (data) => {
    socket.emit('punch_out', data);
  },

  // Listen to events
  onPunchInConfirmed: (callback) => {
    socket.on('punch_in_confirmed', callback);
  },

  onAttendanceUpdate: (callback) => {
    socket.on('attendance_update', callback);
  },

  onLeaveRequest: (callback) => {
    socket.on('leave_request_new', callback);
  },

  getSocket: () => socket
};

export default WebSocketService;
```

### 2.2 React Component Integration

**File: frontend/src/components/EmployeeAttendance.jsx**

```javascript
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import WebSocketService from '../services/WebSocketService';

function EmployeeAttendance({ employeeId }) {
  const [status, setStatus] = useState('not_marked');
  const [punchInTime, setPunchInTime] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect to WebSocket
    WebSocketService.connect();

    // Listen for punch in confirmation
    WebSocketService.onPunchInConfirmed((data) => {
      setPunchInTime(data.timestamp);
      setStatus('marked');
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: { type: 'success', message: 'Punch in recorded' }
      });
    });

    // Listen for real-time attendance updates
    WebSocketService.onAttendanceUpdate((data) => {
      if (data.employeeId === employeeId) {
        setPunchInTime(data.punchInTime);
        setStatus('updated');
      }
    });

    return () => {
      WebSocketService.disconnect();
    };
  }, [employeeId]);

  const handlePunchIn = async () => {
    const location = await getGeolocation();
    WebSocketService.punchIn({
      employeeId,
      timestamp: new Date(),
      location
    });
  };

  return (
    <div className="attendance-card">
      <h2>Attendance</h2>
      <p>Status: {status}</p>
      {punchInTime && <p>Punch In: {punchInTime}</p>}
      <button onClick={handlePunchIn}>Punch In</button>
    </div>
  );
}

export default EmployeeAttendance;
```

## Phase 3: Message Queue & Persistence (Weeks 3-4)

### 3.1 Bull Queue Setup

**File: backend/src/queue/attendanceQueue.js**

```javascript
const Bull = require('bull');
const redis = require('redis');

const attendanceQueue = new Bull('attendance', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Process punch in events
attendanceQueue.process('punch_in', async (job) => {
  const { employeeId, timestamp, location } = job.data;
  
  // Save to database
  const attendance = await Attendance.create({
    employeeId,
    punchInTime: timestamp,
    location
  });

  // Notify via WebSocket
  const io = getIO();
  io.to(`company_${job.data.companyId}`)
    .emit('attendance_punch_in', attendance);

  return { success: true, id: attendance.id };
});

// Queue failed job retry
attendanceQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
  // Implement retry logic
});

module.exports = attendanceQueue;
```

## Testing Checklist

- [ ] WebSocket connection establishes with valid token
- [ ] Connection rejected with invalid token
- [ ] Punch in event sends and updates database
- [ ] Real-time notification to managers
- [ ] Leave request creates and notifies
- [ ] Dashboard updates in real-time
- [ ] Reconnection works after disconnect
- [ ] Performance under 100+ concurrent users
- [ ] Mobile client connects successfully
- [ ] Offline queuing (future feature)

## Performance Metrics

**Targets for Q1 2026:**
- Real-time update latency: <500ms
- Connection establishment: <2 seconds
- Concurrent connections: Support 1000+
- Message throughput: 100+ events/second
- Server memory: <500MB (Socket.io)

## Deployment

1. Deploy Redis instance
2. Update environment variables
3. Deploy backend with Socket.io
4. Update frontend with WebSocket client
5. Load testing and optimization
6. Production monitoring setup

---

## Status: Starting Week 1 of Implementation

**Next Steps:**
1. Set up Redis and Bull
2. Implement Socket.io server
3. Create event handlers
4. Frontend Socket.io client
5. Testing and debugging
