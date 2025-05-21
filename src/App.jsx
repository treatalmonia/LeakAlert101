import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LeakReportPage from '@/pages/LeakReportPage';
import LoginPage from '@/pages/LoginPage';
import RegistrationPage from '@/pages/RegistrationPage';
import MapPage from '@/pages/MapPage';
import HelpPage from '@/pages/HelpPage'; 
import NotificationsPage from '@/pages/NotificationsPage';
import { Toaster } from '@/components/ui/toaster';

const App = () => {
  // For simplicity, assuming a user is not authenticated by default
  // In a real app, this would come from auth context or similar
  const isAuthenticated = false; 

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        
        <Route 
          path="/report-leak" 
          element={<LeakReportPage /> } // Changed from protected for now, assuming anon reports
        />
        
        <Route path="/map" element={<MapPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/forgot-password" element={<StubPage title="Forgot Password" description="Password recovery functionality coming soon." />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
};

const StubPage = ({ title, description = "This page is under construction." }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center p-4 pt-20">
    <h1 className="text-4xl font-bold mb-4 text-yellow-400">{title}</h1>
    <p className="text-lg text-slate-300 text-center max-w-md">{description}</p>
    <img-replace alt="Under construction or relevant illustration" className="w-64 h-64 mt-8 rounded-lg shadow-xl"/>
    <Link to="/" className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-all transform hover:scale-105 shadow-lg">
      Go to Homepage
    </Link>
     <footer className="text-center py-8 text-slate-500 text-sm mt-auto">
      <p>&copy; {new Date().getFullYear()} LeakAlert. All rights reserved.</p>
    </footer>
  </div>
);
export default App;