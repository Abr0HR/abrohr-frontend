import React, { useState } from 'react';
import CompleteLandingPage from './pages/CompleteLandingPage';
import EmployeePortalLogin from './pages/EmployeePortalLogin';
import EmployeeRegistrationPage from './pages/EmployeeRegistrationPage';
import CompanyRegistrationPage from './pages/CompanyRegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PasswordResetPage from './pages/PasswordResetPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [resetEmail, setResetEmail] = useState('');
  
  const handleNavigate = (page, email = '') => {
    setCurrentPage(page);
    if (email) setResetEmail(email);
    window.scrollTo(0, 0);
  };

  // Router logic based on current page and URL
  React.useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/register') {
      setCurrentPage('employee-register');
    } else if (path === '/company-register') {
      setCurrentPage('company-register');
    } else if (path === '/forgot-password') {
      setCurrentPage('forgot-password');
    } else if (path === '/reset-password') {
      const email = params.get('email');
      setCurrentPage('reset-password');
      if (email) setResetEmail(email);
    } else {
      setCurrentPage('landing');
    }
  }, []);

  // Render appropriate page
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <EmployeePortalLogin />;
      case 'employee-register':
        return <EmployeeRegistrationPage />;
      case 'company-register':
        return <CompanyRegistrationPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'reset-password':
        return <PasswordResetPage />;
      case 'landing':
      default:
        return <CompleteLandingPage />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
