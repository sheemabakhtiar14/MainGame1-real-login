import React from 'react';
import { motion } from 'framer-motion';
import { Shield} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'URL DETECTION',
      description: 'Process of analyzing web links to determine whether they are legitimate or potentially malicious or fraudulent.',
      icon: <Shield size={24} className="text-primary-400" />,
      price: 'FREE',
    }
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
                    <Button variant="outline" size="sm"><a target="_blank" href="#">Detect</a></Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

       </div>
    </PageTransition>
  );
};

export default ServicesPage;