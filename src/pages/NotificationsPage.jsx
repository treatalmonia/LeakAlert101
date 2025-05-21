import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, BellOff, Trash2, CheckCircle, AlertTriangle, Settings2 } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';

const initialNotifications = [
  { id: 1, type: 'report', title: 'Leak Report Status Updated', message: 'Your leak report on J.C. Aquino Ave. is now marked as "In Progress".', time: 'Today, 10:15 AM', read: false, link: '/reports/123', icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
  { id: 2, type: 'service', title: 'Scheduled Water Interruption', message: 'Maintenance work in Barangay Libertad on May 23, 8AM–3PM. Expect temporary water service disruption.', time: 'Yesterday, 3:00 PM', read: true, icon: <Settings2 className="h-5 w-5 text-blue-500" /> },
  { id: 3, type: 'emergency', title: 'Emergency Alert!', message: 'Major leak detected in Barangay Ampayon. Please avoid the area while crews respond.', time: '5 minutes ago', read: false, special: true, icon: <AlertTriangle className="h-5 w-5 text-red-500" /> },
  { id: 4, type: 'report', title: 'Report Resolved', message: 'Your report for Brgy. San Vicente has been resolved. Thank you for your contribution!', time: '2 days ago', read: true, link: '/reports/120', icon: <CheckCircle className="h-5 w-5 text-gray-500" /> },
];

const NotificationsPage = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const handleClearAll = () => {
    setNotifications([]);
    toast({ title: 'All notifications cleared.' });
  };

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast({ title: 'Notification deleted.' });
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'all') return true;
    return notif.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      <Header unreadNotifications={notifications.filter(n => !n.read).length} />
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md shadow-lg mt-16 sm:mt-0"
      >
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-yellow-400">Notifications</h1>
        <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700/50 px-2" onClick={handleClearAll} disabled={notifications.length === 0}>
          <Trash2 className="h-5 w-5 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Clear All</span>
        </Button>
      </motion.header>

      <main className="flex-grow pt-32 sm:pt-20 p-4 md:p-6 lg:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-slate-800/70 border border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">All</TabsTrigger>
            <TabsTrigger value="report" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Report Updates</TabsTrigger>
            <TabsTrigger value="service" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Service</TabsTrigger>
            <TabsTrigger value="emergency" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Emergency</TabsTrigger>
          </TabsList>
        </Tabs>

        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <BellOff className="h-24 w-24 mx-auto text-slate-500 mb-6 animate-pulse" />
              <h2 className="text-3xl font-semibold text-slate-300 mb-2">You're all caught up!</h2>
              <p className="text-slate-400">No new notifications at the moment.</p>
            </motion.div>
          ) : (
            <motion.div className="space-y-4">
              {filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <Card className={`relative overflow-hidden transition-all duration-300 ease-in-out
                    ${notif.special ? 'bg-red-900/30 border-red-500/50 shadow-red-500/20' : 'bg-slate-800/70 border-slate-700 hover:border-purple-500/70'}
                    ${!notif.read ? 'border-l-4 border-l-yellow-400' : ''} `}
                  >
                    {!notif.read && <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-yellow-400 rounded-full animate-pulse"></div>}
                    <CardHeader className="flex flex-row items-start gap-4 p-4 pb-2">
                      <div className="mt-1">{notif.icon}</div>
                      <div>
                        <CardTitle className={`text-lg ${notif.special ? 'text-red-300' : 'text-slate-100'}`}>{notif.title}</CardTitle>
                        <CardDescription className="text-xs text-slate-400">{notif.time}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pl-12">
                      <p className={`text-sm ${notif.special ? 'text-red-200' : 'text-slate-300'}`}>{notif.message}</p>
                      <div className="mt-3 flex items-center gap-2">
                        {notif.link && (
                          <Link to={notif.link}>
                            <Button variant="link" className="p-0 h-auto text-purple-400 hover:text-purple-300 text-xs">
                              View Details
                            </Button>
                          </Link>
                        )}
                        {!notif.read && (
                           <Button variant="outline" size="sm" className="text-xs h-auto py-1 px-2 border-slate-600 text-slate-300 hover:bg-slate-700" onClick={() => handleMarkAsRead(notif.id)}>
                             Mark as Read
                           </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteNotification(notif.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} LeakAlert. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NotificationsPage;