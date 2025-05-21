import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle, Map, HelpCircle, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";

const HomePage = () => {
  const quickActions = [
    {
      label: "➕ Create Report",
      to: "/report-leak",
      icon: PlusCircle,
      color:
        "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      description: "Submit a new leak incident.",
    },
    {
      label: "🗺️ Map of Leaks",
      to: "/map",
      icon: Map,
      color:
        "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600",
      description: "View reported leaks on a map.",
    },
    {
      label: "❓ Help & FAQs",
      to: "/help",
      icon: HelpCircle,
      color:
        "bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600",
      description: "Find answers and support.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col pt-20">
      <Header unreadNotifications={3} />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <AlertTriangle className="h-16 w-16 text-yellow-400 animate-pulse" />
            <h1 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
              LeakAlert
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-md mx-auto">
            Your community platform for reporting and tracking water leaks. Help
            us conserve water!
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          {quickActions.map((action) => (
            <motion.div
              key={action.label}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl overflow-hidden"
            >
              <Link to={action.to}>
                <Button
                  className={`w-full h-48 p-6 flex flex-col items-center justify-center text-white text-xl font-semibold shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${action.color}`}
                >
                  <action.icon className="h-12 w-12 mb-3" />
                  <span>{action.label}</span>
                  <span className="text-sm font-normal mt-1 opacity-80">
                    {action.description}
                  </span>
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} LeakAlert. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
