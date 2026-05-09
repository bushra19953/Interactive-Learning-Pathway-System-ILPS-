import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  Target, 
  Globe,
  BookOpen,
  TrendingUp,
  Heart,
  Lightbulb
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from course content to student support.',
      color: 'text-yellow-400'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Our passion for education drives us to create transformative learning experiences.',
      color: 'text-red-400'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace innovative teaching methods and cutting-edge technology.',
      color: 'text-blue-400'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Quality education should be accessible to everyone, everywhere.',
      color: 'text-emerald-400'
    }
  ];

  const team = [
    {
      name: 'Bushra Rehman',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Former Stanford professor with 15+ years in educational technology.'
    },
    {
      name: 'Shahbaz Hussain',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Tech innovator who previously led engineering teams at Google and Microsoft.'
    },
    {
      name: 'Tooba Rizwan',
      role: 'Head of Learning',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Curriculum designer with expertise in adult learning and skill development.'
    },
    {
      name: 'Abdul Wahab',
      role: 'Lead Instructor',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Industry veteran with 20+ years of experience in software development.'
    }
  ];

  const stats = [
    { icon: Users, label: 'Students Worldwide', value: '50,000+' },
    { icon: BookOpen, label: 'Courses Available', value: '200+' },
    { icon: Award, label: 'Certificates Issued', value: '25,000+' },
    { icon: TrendingUp, label: 'Success Rate', value: '95%' }
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-emerald-400">ILPS</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Interactive Learning Pathway System (ILPS) is revolutionizing online education by providing 
            immersive, practical learning experiences that prepare students for real-world challenges.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              To democratize access to high-quality education and empower learners worldwide 
              to achieve their professional goals through innovative, interactive learning experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Vision</h3>
              <p className="text-gray-300">
                To become the world's leading platform for skill-based learning, where every individual 
                can unlock their potential and transform their career through personalized education.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Impact</h3>
              <p className="text-gray-300">
                We've helped over 50,000 students across 150 countries advance their careers, 
                with 95% of our graduates reporting improved job prospects within 6 months.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Values</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              These core values guide everything we do and shape the learning experience we provide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
              >
                <value.icon className={`h-12 w-12 ${value.color} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-purple-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">By the Numbers</h2>
            <p className="text-lg text-gray-300">
              Our impact in transforming lives through education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-10 w-10 text-yellow-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Meet Our Team</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our diverse team of educators, technologists, and innovators is dedicated to 
              creating exceptional learning experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-yellow-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Story</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              ILPS was founded in 2020 by a team of educators and technologists who recognized 
              the need for more engaging, practical online learning experiences. Frustrated by 
              traditional e-learning platforms that focused on passive consumption rather than 
              active engagement, we set out to create something different.
            </p>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Our interactive approach combines the best of traditional education with modern 
              technology, creating immersive learning pathways that adapt to each student's 
              pace and learning style. We believe that learning should be challenging, rewarding, 
              and fun.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Today, ILPS serves students from over 150 countries, offering courses in technology, 
              business, design, and more. Our commitment to quality education and student success 
              remains at the heart of everything we do.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;