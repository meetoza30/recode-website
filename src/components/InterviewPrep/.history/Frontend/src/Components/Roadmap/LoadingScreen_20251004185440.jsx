import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Brain, Search, Target, BookOpen, Rocket, Trophy } from 'lucide-react';

const LoadingScreen = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    { text: "Analyzing your dream company...", icon: Brain, color: "from-blue-500 to-blue-600" },
    { text: "Searching through thousands of interview questions...", icon: Search, color: "from-blue-500 to-blue-700" },
    { text: "Our AI is crafting your personalized roadmap...", icon: Sparkles, color: "from-blue-400 to-blue-600" },
    { text: "Organizing questions by difficulty...", icon: Target, color: "from-blue-500 to-indigo-600" },
    { text: "Adding relevant study resources...", icon: BookOpen, color: "from-blue-500 to-blue-600" },
    { text: "Almost ready! Finalizing your success path...", icon: Rocket, color: "from-blue-500 to-blue-700" },
    { text: "Your roadmap is taking shape...", icon: Sparkles, color: "from-blue-400 to-indigo-500" },
    { text: "Building your pathway to success...", icon: Trophy, color: "from-blue-500 to-blue-600" }
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 4000);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 95));
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const CurrentIcon = loadingMessages[currentMessage].icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-12 text-center relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-100">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-4 right-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-blue-50 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative space-y-8">
          {/* Main Loading Animation */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-600 rounded-full animate-spin"></div>
              
              {/* Inner Circle */}
              <div className={`absolute inset-4 bg-gradient-to-br ${loadingMessages[currentMessage].color} rounded-full flex items-center justify-center shadow-lg`}>
                <CurrentIcon className="w-12 h-12 text-white" />
              </div>
              
              {/* Floating Elements */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-blue-400 animate-bounce" />
              <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-blue-300 animate-bounce delay-500" />
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Creating Your Roadmap
            </h3>
            
            <div className="space-y-3">
              <p className="text-xl font-semibold text-blue-600 animate-pulse">
                {loadingMessages[currentMessage].text}
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">This usually takes 20-30 seconds...</span>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {[
              { label: "Questions Analyzed", value: "10,000+" },
              { label: "Success Rate", value: "94%" },
              { label: "Companies", value: "500+" },
              { label: "Students Helped", value: "50,000+" }
            ].map((stat, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="pt-6 border-t border-blue-100">
            <p className="text-sm text-gray-500 italic">
              "Great things take time - your personalized roadmap is worth the wait!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;