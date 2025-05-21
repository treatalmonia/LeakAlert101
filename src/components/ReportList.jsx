import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const ReportList = ({ reports, severityOptions }) => {
  if (reports.length === 0) {
    return <p className="text-center text-slate-400 mt-4">No reports submitted yet.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {reports.map(report => (
        <motion.div 
          key={report.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 hover:shadow-purple-500/20 hover:border-purple-600/50 transition-all">
            <CardHeader>
              <CardTitle className="text-lg text-purple-400">{report.address}</CardTitle>
              <CardDescription className="text-xs text-slate-400">Reported: {report.timestamp}</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-1">
              <p><strong className="text-slate-200">Severity:</strong> <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${severityOptions.find(s => s.id === report.severity)?.color || 'bg-gray-500'}`}>{report.severity}</span></p>
              {report.duration && <p><strong className="text-slate-200">Duration:</strong> {report.duration}</p>}
              {report.mobileNumber && <p><strong className="text-slate-200">Mobile:</strong> {report.mobileNumber}</p>}
              {report.notes && <p><strong className="text-slate-200">Notes:</strong> {report.notes}</p>}
              {report.images && report.images.length > 0 && <p><strong className="text-slate-200">Images:</strong> {report.images.join(', ')}</p>}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ReportList;