import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, UserCheck, History, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Security Assessments',
      description: 'Comprehensive analysis of your digital security practices with personalized recommendations.',
      icon: <Shield size={24} className="text-primary-400" />,
      price: 'From $299',
    },
    {
      title: 'Identity Protection',
      description: 'Advanced monitoring of your personal data across the web to prevent identity theft.',
      icon: <UserCheck size={24} className="text-green-400" />,
      price: '$12.99/month',
    },
    {
      title: 'Password Management',
      description: 'Secure storage and management of your passwords with breach monitoring.',
      icon: <Lock size={24} className="text-blue-400" />,
      price: '$8.99/month',
    },
    {
      title: 'Activity Monitoring',
      description: 'Real-time monitoring of your accounts for suspicious activities and login attempts.',
      icon: <History size={24} className="text-purple-400" />,
      price: '$9.99/month',
    },
    {
      title: 'Breach Response',
      description: 'Immediate assistance and guidance if your accounts or data are compromised.',
      icon: <AlertTriangle size={24} className="text-orange-400" />,
      price: 'From $199',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2 text-white font-heading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Security Services
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Professional cybersecurity services to protect your digital life
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Card className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="bg-dark-700 p-3 inline-block rounded-lg mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-accent-400">{service.price}</span>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-dark-800 to-secondary-900/30 p-8 rounded-xl border border-dark-700 max-w-4xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 text-white font-heading">Need Custom Security Solutions?</h2>
            <p className="text-gray-300">
              Our team of security experts can create a personalized security plan for your specific needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-800/50 p-5 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-white">For Individuals</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <span className="mr-2 text-green-400">✓</span> Personal security assessments
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="mr-2 text-green-400">✓</span> Identity theft protection
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="mr-2 text-green-400">✓</span> Device security setup
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="mr-2 text-green-400">✓</span> Private consultations
                </li>
              </ul>
            </div>
            
            <div className="bg-dark-800/50 p-5 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-white">For Businesses</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <span className="mr-2 text-green-400">✓</span> Team security training
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="mr-2 text-green-400">✓</span> Network security audits
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="mr-2 text-green-400">✓</span> Phishing simulation campaigns
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="mr-2 text-green-400">✓</span> Security policy development
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="accent" size="lg">
              Contact Us for a Free Consultation
            </Button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ServicesPage;