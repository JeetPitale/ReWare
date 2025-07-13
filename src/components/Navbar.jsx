import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="w-full py-3 px-6 flex justify-between items-center bg-white shadow-md sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-indigo-800">MyApp</h1>
      <div className="space-x-6">
        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-700 font-medium">Dashboard</Link>
        <Link to="/admin" className="text-gray-700 hover:text-indigo-700 font-medium">Admin</Link>

        <Link to="/login" className="text-gray-700 hover:text-indigo-700 font-medium">Login</Link>
        <Link to="/signup" className="text-white bg-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-800 transition-all">Sign Up</Link>
      </div>
    </div>
  );
};

export default Navbar;
