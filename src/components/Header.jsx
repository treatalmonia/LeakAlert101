
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = ({ unreadNotifications = 0 }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md shadow-lg"
    >
      <Link to="/" className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        >
          <img-replace alt="LeakAlert App Logo" className="h-10 w-10" />
        </motion.div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
          LeakAlert
        </span>
      </Link>
      
      <div className="relative">
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
            <Bell className="h-6 w-6" />
            {unreadNotifications > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
                className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </motion.span>
            )}
          </Button>
        </Link>
      </div>
    </motion.header>
  );
};

export default Header;
