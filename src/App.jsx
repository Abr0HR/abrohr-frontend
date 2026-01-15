import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CompleteLandingPage from './pages/CompleteLandingPage';
import EmployeePortalLogin from './pages/EmployeePortalLogin';
import EmployeeRegistrationPage from './pages/EmployeeRegistrationPage';
import CompanyRegistrationPage from './pages/CompanyRegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PasswordResetPage from './pages/PasswordResetPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CompleteLandingPage />} />
        <Route path="/login" element={<EmployeePortalLogin />} />
        <Route path="/register" element={<EmployeeRegistrationPage />} />
        <Route path="/company-register" element={<CompanyRegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="*" element={<CompleteLandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
