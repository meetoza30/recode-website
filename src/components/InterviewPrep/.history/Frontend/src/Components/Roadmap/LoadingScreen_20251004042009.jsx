import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Brain, Search, Target, BookOpen, Rocket, Trophy } from 'lucide-react';

const LoadingScreen = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    { text: "Analyzing your dream company...", icon: Brain, color: "from-blue-500 to-indigo-500" },
    { text: "Searching through thousands of interview questions...", icon: Search, color: "from-green-500 to-emerald-500" },
    { text: "Our AI is crafting your personalized roadmap...", icon: Sparkles, color: "from-purple-500 to-pink-500" },
    { text: "Organizing questions by difficulty...", icon: Target, color: "from-orange-500 to-red-500" },
    { text: "Adding relevant study resources...", icon: BookOpen, color: "from-teal-500 to-cyan-500" },
    { text: "Almost ready! Finalizing your success path...", icon: Rocket, color: "from-indigo-500 to-purple-500" },
    { text: "Your roadmap is taking shape...", icon: Sparkles, color: "from-pink-500 to-rose-500" },
    { text: "Building your pathway to success...", icon: Trophy, color: "from-yellow-500 to-orange-500" }
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 dark:border-dark-700/50 p-12 text-center relative overflow-hidden">
        
        {/* Background Animations */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-dark-700">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-primary-400/30 to-blue-400/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative space-y-8">
          {/* Main Loading Animation */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-gray-200 dark:border-dark-600 rounded-full"></div>
              
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-primary-600 border-r-blue-600 rounded-full animate-spin"></div>
              
              {/* Inner Circle */}
              <div className={`absolute inset-4 bg-gradient-to-br ${loadingMessages[currentMessage].color} rounded-full flex items-center justify-center shadow-lg`}>
                <CurrentIcon className="w-12 h-12 text-white animate-pulse" />
              </div>
              
              {/* Floating Sparkles */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
              <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-pink-400 animate-bounce delay-500" />
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              Creating Your Roadmap
            </h3>
            
            <div className="space-y-3">
              <p className="text-xl font-medium text-primary-600 dark:text-primary-400 animate-pulse">
                {loadingMessages[currentMessage].text}
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">This usually takes 30-40 seconds...</span>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {[
              { label: "Questions Analyzed", value: "10,000+" },
              { label: "Success Rate", value: "94%" },
              { label: "Companies", value: "500+" },
              { label: "Students Helped", value: "50,000+" }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50/80 dark:bg-dark-700/80 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;



