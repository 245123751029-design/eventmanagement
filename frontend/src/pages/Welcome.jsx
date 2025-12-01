import React, { useContext } from 'react';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Ticket, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If user is logged in, redirect to events
  React.useEffect(() => {
    if (user) {
      navigate('/events');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Background Image */}
      <div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MjQyMTd8MHwxfHNlYXJjaHwxfHxldmVudHxlbnwwfHx8fDE3NjQ1OTc0ODh8MA&ixlib=rb-4.1.0&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-pink-900/90 dark:from-blue-950/95 dark:via-purple-950/90 dark:to-pink-950/95"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-full p-6">
              <Calendar className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">EventHub</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover amazing events, connect with communities, and create unforgettable memories. Your next great experience is just a click away!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={login}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button 
              onClick={() => navigate('/events')}
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full shadow-xl transition-all duration-300"
            >
              Browse Events
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Book Tickets</h3>
              <p className="text-blue-100">Easy and secure ticket booking for all your favorite events</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create Events</h3>
              <p className="text-blue-100">Organize and manage your own events with powerful tools</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Join Community</h3>
              <p className="text-blue-100">Connect with like-minded people and grow your network</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
