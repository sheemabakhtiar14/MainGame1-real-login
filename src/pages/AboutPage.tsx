import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Flag, Lightbulb } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      title: 'Chief Security Officer',
      image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'Michael Chen',
      title: 'Lead Developer',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'Aisha Patel',
      title: 'Security Researcher',
      image: 'https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'David Wilson',
      title: 'Education Director',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  const values = [
    {
      title: 'Education First',
      description: 'We believe that cybersecurity awareness should be accessible to everyone, regardless of technical background.',
      icon: <Lightbulb size={24} className="text-yellow-400" />,
    },
    {
      title: 'Real-World Application',
      description: 'Our simulations are based on actual scam techniques to provide practical, relevant training.',
      icon: <Flag size={24} className="text-green-400" />,
    },
    {
      title: 'Community Protection',
      description: 'By educating individuals, we strengthen the security of entire communities against cyber threats.',
      icon: <Users size={24} className="text-blue-400" />,
    },
    {
      title: 'Continuous Improvement',
      description: 'We regularly update our content to address emerging threats and scam techniques.',
      icon: <Shield size={24} className="text-purple-400" />,
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
        <div className="text-center mb-12">
          <motion.h1 
            className="text-3xl font-bold mb-2 text-white font-heading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About CyberSafe
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our mission is to make cybersecurity education engaging and effective for everyone
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-white font-heading">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                CyberSafe was founded in 2023 by a team of cybersecurity experts who recognized that traditional security training wasn't engaging enough to be effective.
              </p>
              <p>
                We noticed that even though cyber threats were becoming more sophisticated, security education wasn't keeping pace. PowerPoint presentations and dull videos weren't preparing people for real-world threats.
              </p>
              <p>
                That's why we created our game-based learning approach - to transform security awareness from a boring necessity into an engaging experience that actually works.
              </p>
              <p>
                Today, our platform helps thousands of individuals develop the skills to protect themselves from ever-evolving online threats.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg transform rotate-3 scale-105"></div>
            <img 
              src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Cybersecurity team" 
              className="relative rounded-lg w-full h-full object-cover shadow-xl"
            />
          </motion.div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">Our Values</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={item}>
                <Card className="p-6 h-full text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-dark-700 rounded-full">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">Meet Our Team</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={item}>
                <Card className="overflow-hidden h-full">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.title}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AboutPage;