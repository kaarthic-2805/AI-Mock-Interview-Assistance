"use client";

import React, { useState } from 'react';
import { Play, Brain, Mic, BarChart3, Users, CheckCircle, Star, ArrowRight, Trophy, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const onSignin = () => {
    //router.push('http://localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fdashboard')
    router.push('/sign-in?redirect_url=/dashboard')
  }
  
  const onSignup = () => {
    //router.push('http://localhost:3000/sign-up?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fdashboard')
    router.push('/sign-up?redirect_url=/dashboard')
  }
  const handleAuth = (e) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log('Auth submitted:', formData);
    setShowAuth(false);
    setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Interviews',
      description: 'Advanced AI technology provides realistic interview scenarios tailored to your industry and role.'
    },
    {
      icon: Mic,
      title: 'Real-time Feedback',
      description: 'Get instant analysis of your responses, communication skills, and overall performance.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed reports and personalized improvement recommendations.'
    },
    {
      icon: Users,
      title: 'Multiple Interview Types',
      description: 'Practice technical, behavioral, system design, and product management interviews.'
    },
    {
      icon: Target,
      title: 'Personalized Learning',
      description: 'Customized practice sessions based on your experience level and target roles.'
    },
    {
      icon: Trophy,
      title: 'Success Tracking',
      description: 'Monitor your improvement over time with comprehensive scoring and analytics.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: 'InterviewAI helped me prepare for my technical interviews. The AI feedback was incredibly detailed and actionable.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager at Meta',
      content: 'The behavioral interview practice was game-changing. I felt so much more confident in my actual interviews.',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Data Scientist at Netflix',
      content: 'The system design interviews were challenging and realistic. It prepared me perfectly for the real thing.',
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Interviews Completed' },
    { number: '95%', label: 'Success Rate' },
    { number: '500+', label: 'Companies Hired From' },
    { number: '4.9/5', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">InterviewAI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Navigation buttons - Enhanced */}
<div className="flex items-center space-x-4">
  <button
    onClick={onSignin}
    className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium 
               transition-all duration-300 ease-in-out 
               hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
  >
    Sign In
  </button>
  
  <button
    onClick={onSignup}
    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium
               hover:bg-blue-700 hover:scale-105 hover:shadow-lg 
               transition-all duration-300 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    Sign Up
  </button>
</div>

            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {authMode === 'signin' ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-gray-600">
                {authMode === 'signin' 
                  ? 'Sign in to continue your interview journey' 
                  : 'Create your account to start practicing'}
              </p>
            </div>

            <div className="space-y-4">
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {authMode === 'signup' && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                />
              )}
              
              <button
                onClick={handleAuth}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {authMode === 'signin' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your 
            <span className="text-blue-600"> Interview Skills</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Practice with AI-powered mock interviews. Get instant feedback, improve your performance, 
            and land your dream job with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              //onClick={() => { setShowAuth(true); setAuthMode('signup'); }}
              onClick={onSignup}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              <span>Start Free Trial</span>
            </button>
            <button
  onClick={() => window.open("https://www.peoplehum.com/glossary/mock-interview", "_blank")}
  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
>
  Learn More
</button>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose InterviewAI?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides everything you need to excel in your interviews
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to interview success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Interview Type',
                description: 'Select from technical, behavioral, system design, or product management interviews.'
              },
              {
                step: '02',
                title: 'Practice with AI',
                description: 'Engage in realistic mock interviews with our advanced AI interviewer.'
              },
              {
                step: '03',
                title: 'Get Feedback & Improve',
                description: 'Receive detailed feedback and personalized recommendations for improvement.'
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <ArrowRight className="w-6 h-6 text-gray-300 absolute top-10 -right-3 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from professionals who landed their dream jobs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default LandingPage;