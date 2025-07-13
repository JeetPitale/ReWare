// src/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { FiLoader } from 'react-icons/fi';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#22333B] flex flex-col justify-center items-center text-white">
        <FiLoader className="animate-spin text-4xl mb-4" />
        <p>Checking authentication status...</p>
      </div>
    );
  }

  if (currentUser) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;