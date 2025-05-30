import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Youtube, Globe, ExternalLink } from 'lucide-react';
import Card from '../components/Card';
import PageTransition from '../components/PageTransition';

const ResourcesPage: React.FC = () => {
  const resources = [
    {
      title: 'Beginner\'s Guide to Phishing',
      description: 'Learn the basics of phishing attacks and how to identify them.',
      type: 'Guide',
      icon: <FileText size={20} className="text-blue-400" />,
      link: '#',
    },
    {
      title: 'Social Engineering Explained',
      description: 'Understand the psychological tactics used by scammers.',
      type: 'Article',
      icon: <BookOpen size={20} className="text-green-400" />,
      link: '#',
    },
    {
      title: 'URL Safety Techniques',
      description: 'Master the art of identifying malicious URLs and websites.',
      type: 'Guide',
      icon: <FileText size={20} className="text-blue-400" />,
      link: '#',
    },
    {
      title: 'Avoiding Email Scams',
      description: 'Comprehensive video tutorial on spotting and avoiding email scams.',
      type: 'Video',
      icon: <Youtube size={20} className="text-red-400" />,
      link: '#',
    },
    {
      title: 'Password Security Best Practices',
      description: 'Learn how to create and manage secure passwords.',
      type: 'Guide',
      icon: <FileText size={20} className="text-blue-400" />,
      link: '#',
    },
    {
      title: 'NIST Cybersecurity Framework',
      description: 'Official cybersecurity guidelines from the National Institute of Standards and Technology.',
      type: 'External',
      icon: <Globe size={20} className="text-purple-400" />,
      link: 'https://www.nist.gov/cyberframework',
    },
  ];

  const articles = [
    {
      title: 'The Rising Threat of Voice Phishing',
      description: 'How scammers are using advanced voice technology to impersonate trusted contacts.',
      date: 'May 15, 2025',
      image: 'https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      title: 'Mobile Security Essentials',
      description: 'Protecting your smartphone from the latest security threats and vulnerabilities.',
      date: 'April 23, 2025',
      image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      title: 'Cryptocurrency Scams to Watch For',
      description: 'Common tactics used by scammers in the cryptocurrency space and how to avoid them.',
      date: 'March 10, 2025',
      image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
            Cybersecurity Resources
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Educational materials to help you stay safe online
          </motion.p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white font-heading">Educational Resources</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resources.map((resource, index) => (
              <motion.div key={index} variants={item}>
                <Card className="p-6 h-full" interactive>
                  <a href={resource.link} className="flex flex-col h-full group">
                    <div className="flex items-start mb-4">
                      <div className="p-2 bg-dark-700 rounded-lg mr-3">
                        {resource.icon}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          {resource.type}
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-accent-400 transition-colors">
                          {resource.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">{resource.description}</p>
                    <div className="mt-auto flex items-center text-primary-400 text-sm">
                      <span>Learn more</span>
                      <ExternalLink size={14} className="ml-1" />
                    </div>
                  </a>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-white font-heading">Latest Articles</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {articles.map((article, index) => (
              <motion.div key={index} variants={item}>
                <Card className="overflow-hidden h-full" interactive>
                  <a href="#" className="block group">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-gray-500 mb-2">{article.date}</p>
                      <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-accent-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{article.description}</p>
                    </div>
                  </a>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResourcesPage;