
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, BookOpen, Brain, CheckCircle, Layers, Upload } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Layers className="h-6 w-6 text-primary" />,
      title: 'Multiple Learning Modes',
      description: 'Study your vocabulary with different methods: flashcards, multiple choice, or matching games.'
    },
    {
      icon: <Upload className="h-6 w-6 text-primary" />,
      title: 'Easy Import',
      description: 'Quickly import your vocabulary lists from text files with a simple format.'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: 'Organized Learning',
      description: 'Create folders and study sets to organize your vocabulary learning efficiently.'
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: 'Effective Memorization',
      description: 'Interactive elements designed to help you memorize vocabulary more effectively.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10"></div>
          <div className="container mx-auto px-4 z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 animate-fade-in">
                Learn New Words Effortlessly
              </h1>
              <p className="text-xl text-gray-700 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                VocabFlicker helps you memorize vocabulary with interactive flashcards and games
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/dashboard">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth?mode=signin">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute top-20 -right-20 w-72 h-72 bg-indigo-100 rounded-full opacity-40 blur-3xl"></div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="glassmorphism p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col space-y-8">
                {[
                  { 
                    step: '01', 
                    title: 'Create Study Sets', 
                    description: 'Create folders and study sets for different topics or languages.' 
                  },
                  { 
                    step: '02', 
                    title: 'Add Your Vocabulary', 
                    description: 'Enter terms manually or import them from a text file.' 
                  },
                  { 
                    step: '03', 
                    title: 'Choose Your Study Mode', 
                    description: 'Select from flashcards, multiple choice, or matching games.' 
                  },
                  { 
                    step: '04', 
                    title: 'Track Your Progress', 
                    description: 'Review your learning progress and focus on challenging words.' 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                      {item.step}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to improve your vocabulary?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of learners expanding their vocabulary efficiently with VocabFlicker.
            </p>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/auth?mode=signup">
                Start Learning Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
