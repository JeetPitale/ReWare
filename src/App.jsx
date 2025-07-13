// src/App.jsx

import React from 'react';
// We import BrowserRouter and other components needed for routing setup
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// Ensure AnimatePresence is imported if you are using framer-motion
// import { AnimatePresence } from 'framer-motion'; 

import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// A helper component to handle the root URL redirection (/)
const HomeRedirect = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    // Return null or a loading indicator while AuthContext is loading
    return null; 
  }

  // If authenticated, redirect to Dashboard. Otherwise, redirect to Login.
  return currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

// AppRoutes component: This component must be placed inside the <Router> context 
// to use routing hooks like useLocation().
const AppRoutes = () => {
  // We can use useLocation() here because AppRoutes is rendered inside <Router> in the App component.
  const location = useLocation();

  return (
    // Note: If you want to use AnimatePresence for transitions, you can wrap Routes here
    // <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes using PrivateRoute */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } 
        />
        
        {/* Default redirect for the root URL */}
        <Route path="/" element={<HomeRedirect />} />
      </Routes>
    // </AnimatePresence>
  );
};

// App component: This sets up the Router and AuthProvider.
const App = () => {
  return (
    // The BrowserRouter (aliased as Router) is the context provider for all routing hooks.
    <Router>
      <AuthProvider>
        <AppRoutes /> {/* AppRoutes is now inside the Router context */}
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      </AuthProvider>
    </Router>
  );
};

export default App;