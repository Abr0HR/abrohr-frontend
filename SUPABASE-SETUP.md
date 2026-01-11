# 🚀 AbrO HR - Supabase Cloud Implementation Guide

## Overview
Supabase is an open-source Firebase alternative that provides a complete backend solution with PostgreSQL database, authentication, file storage, and real-time capabilities.

**Why Supabase for AbrO HR:**
- ✅ 100% Open Source
- ✅ FREE tier (500MB database, 1GB storage)
- ✅ PostgreSQL-based (enterprise-grade)
- ✅ Real-time capabilities
- ✅ Built-in Authentication
- ✅ Auto-generated APIs (REST/GraphQL)
- ✅ Edge Functions (serverless)
- ✅ File Storage
- ✅ No vendor lock-in

---

## SETUP INSTRUCTIONS

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Create new project:
   - Project name: "abrohr-db"
   - Database password: (secure password)
   - Region: Choose nearest to you
   - Free tier selected

### Step 2: Initialize Database
1. Go to SQL Editor in Supabase Dashboard
2. Create tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  department VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES users(id),
  clock_in_time TIMESTAMP,
  clock_out_time TIMESTAMP,
  date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, date)
);

-- Leave requests table
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES users(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approver_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  theme VARCHAR(50) DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  language VARCHAR(50) DEFAULT 'english',
  timezone VARCHAR(100) DEFAULT 'UTC',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 3: Configure Authentication
1. Go to Authentication > Providers
2. Enable Email/Password
3. Go to Auth > Policies
4. Create RLS policies for security:

```sql
-- Users can read own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" 
ON users FOR SELECT 
USING (auth.uid()::text = id::text OR role = 'employer');

-- Employees can read own attendance
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own attendance" 
ON attendance FOR SELECT 
USING (employee_id = auth.uid());

CREATE POLICY "Employers can read all attendance" 
ON attendance FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE id = auth.uid() AND role = 'employer'
));
```

### Step 4: Get API Keys
1. Go to Settings > API
2. Copy:
   - **SUPABASE_URL**: Project URL
   - **SUPABASE_ANON_KEY**: Anon public key
   - **SUPABASE_SERVICE_ROLE_KEY**: Service role key (private)

### Step 5: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 6: Create Environment File
Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 7: Create Supabase Client Helper
Create `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export const signUp = async (email, password) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// CRUD operations
export const getAttendance = async (employeeId) => {
  return await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false });
};

export const addAttendance = async (employeeId, clockInTime) => {
  return await supabase
    .from('attendance')
    .insert([
      {
        employee_id: employeeId,
        clock_in_time: clockInTime,
        status: 'present'
      }
    ]);
};

export const updateAttendance = async (id, clockOutTime) => {
  return await supabase
    .from('attendance')
    .update({ clock_out_time: clockOutTime })
    .eq('id', id);
};
```

### Step 8: Update App.jsx to use Supabase

Replace mock authentication with Supabase:

```javascript
import { signIn, signOut } from './lib/supabase';

const handleLogin = async (e) => {
  e.preventDefault();
  const { data, error } = await signIn(email, password);
  if (error) {
    setLoginError(error.message);
  } else {
    setIsLoggedIn(true);
    // Fetch user data from Supabase
  }
};

const handleLogout = async () => {
  await signOut();
  setIsLoggedIn(false);
};
```

---

## FREE TIER LIMITS

| Resource | Limit |
|----------|-------|
| Database Size | 500 MB |
| File Storage | 1 GB |
| Monthly Active Users | Unlimited |
| Database Connections | 10 concurrent |
| API Requests | Unlimited |
| Realtime Connections | 200 concurrent |
| Edge Functions Invocations | 500K/month free |

---

## SECURITY BEST PRACTICES

✅ Use environment variables for keys  
✅ Enable Row Level Security (RLS)  
✅ Use service role key only on backend  
✅ Validate all input on server  
✅ Use HTTPS only  
✅ Implement rate limiting  
✅ Regular backups (enabled by default)  
✅ Monitor for unusual activity  

---

## DEPLOYMENT CHECKLIST

- [ ] Supabase project created
- [ ] Database tables set up
- [ ] Authentication configured
- [ ] RLS policies enabled
- [ ] API keys obtained
- [ ] Environment variables set
- [ ] Supabase client installed
- [ ] Helper functions created
- [ ] App.jsx updated
- [ ] Testing completed
- [ ] Production environment configured

---

## NEXT STEPS

1. Create account at supabase.com
2. Follow setup steps 1-7
3. Test authentication
4. Implement attendance tracking
5. Add leave management
6. Deploy to production

---

**Status**: Ready for Implementation  
**Last Updated**: January 2026  
**Maintainer**: AbrO HR Development Team
