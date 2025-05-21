import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronLeft, Search, Mail, Phone, MessageSquare, Download, Video } from 'lucide-react';
import Header from '@/components/Header';

const faqData = [
  {
    question: 'How do I report a leak?',
    answer: 'Tap the “+ Create Report” button on the homepage, upload a photo (optional), allow location access or set it manually, fill in the details like severity, and submit the report.',
  },
  {
    question: 'Can I report anonymously?',
    answer: 'Yes, you can submit a report without logging in or providing personal details. However, including contact information helps us follow up if more details are needed, especially for severe leaks.',
  },
  {
    question: 'How will I know if my report was received?',
    answer: 'After submission, you’ll see a confirmation message. If you are logged in, you can track the status of your report in your account dashboard or through notifications.',
  },
  {
    question: 'What do the severity levels mean?',
    answer: 'Minor: Small drips, damp spots, or non-urgent issues. Major: Continuous water flow, localized pooling, potentially affecting service. Emergency: Burst pipes, significant flooding, or immediate safety hazards.',
  },
  {
    question: 'Can I edit or cancel my report after submitting it?',
    answer: 'Currently, submitted reports cannot be edited or cancelled directly through the app. If you need to provide additional information or correct something, please contact our support team.',
  },
  {
    question: 'Why is my location not accurate when I report a leak?',
    answer: 'Ensure your device’s GPS or location services are enabled and that you have granted location permission to the LeakAlert app. You can also manually adjust the pin on the map to the precise leak location before submitting.',
  },
  {
    question: 'How often is the leak map updated?',
    answer: 'The map of leaks is updated in near real-time as new reports are submitted and verified. Status updates (Pending, In-Progress, Resolved) are also reflected as they change.',
  }
];

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      <Header />
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
        <h1 className="text-xl font-semibold text-yellow-400">Help & FAQs</h1>
        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
          <Search className="h-6 w-6" />
        </Button>
      </motion.header>

      <main className="flex-grow pt-32 sm:pt-20 p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/70 border-slate-700 placeholder-slate-400 text-slate-100 focus:ring-purple-500 focus:border-purple-500 pl-10 py-3 rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full bg-slate-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg hover:text-purple-400">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center text-slate-400 py-4">No FAQs found matching your search.</p>
            )}
          </Accordion>

          {/* Contact Support Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-12 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Still Need Help?</h2>
            <p className="text-slate-300 mb-6">If you couldn't find an answer in our FAQs, please reach out to us.</p>
            <div className="space-y-4">
              <a href="mailto:support@leakreport.com" className="flex items-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                <Mail className="h-5 w-5 mr-3 text-purple-400" />
                <span className="text-slate-200">support@leakreport.com</span>
              </a>
              <a href="tel:09990001111" className="flex items-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                <Phone className="h-5 w-5 mr-3 text-purple-400" />
                <span className="text-slate-200">0999-XXX-XXXX (Placeholder)</span>
              </a>
              <Button variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 py-3">
                <MessageSquare className="h-5 w-5 mr-2" /> Chat Support (Coming Soon)
              </Button>
            </div>
          </motion.section>

          {/* Tips & User Guide Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Tips & User Guide</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-200 py-3 text-base">
                <Video className="h-5 w-5 mr-2 text-lime-400" /> How-to Video Guide (Soon)
              </Button>
              <Button variant="secondary" className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-200 py-3 text-base">
                <Download className="h-5 w-5 mr-2 text-lime-400" /> Download PDF Manual (Soon)
              </Button>
            </div>
            <div className="mt-4">
              <img-replace alt="Infographic showing how to report leaks" className="w-full h-auto object-cover rounded-lg border border-slate-700" />
            </div>
          </motion.section>
        </motion.div>
      </main>
      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} LeakAlert. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HelpPage;