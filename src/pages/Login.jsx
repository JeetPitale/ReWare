// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import auth from firebase.js

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      navigate('/dashboard'); 
    } catch (error) {
      toast.error(`Login Failed: ${error.message}`);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white via-[#004479] to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="backdrop-blur-md bg-white/10 border border-white/30 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4 text-white">
          <div className="relative">
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-transparent border border-gray-300 rounded-md px-4 pt-6 pb-2 focus:outline-none focus:border-white" 
            />
            <label className="absolute left-4 top-2 text-sm text-white/70 peer-focus:text-white transition-all">Email</label>
          </div>
          <div className="relative">
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-transparent border border-gray-300 rounded-md px-4 pt-6 pb-2 focus:outline-none focus:border-white" 
            />
            <label className="absolute left-4 top-2 text-sm text-white/70 peer-focus:text-white transition-all">Password</label>
          </div>
          <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded-md transition-all">Login</button>
          <p className="text-center text-sm mt-2">
            Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-500 font-medium">Sign Up</Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;