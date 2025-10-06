import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Key, Save, X, ExternalLink, Sparkles, ArrowRight, Zap, User } from 'lucide-react';

const ApiKeyModal = ({ onSubmit, onSkip, userName }) => {
  const [apiKey, setApiKey] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    setIsAnimating(true);
    setTimeout(() => {
      onSubmit(apiKey);
    }, 300);
  };

  const handleSkip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-700 flex items-center justify-center p-4">
      <div className={`bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-dark-700 p-8 max-w-2xl w-full mx-4 transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        
        <div className="relative">
          {/* User-Specific Header */}
          <div className="text-center mb-10">
            {userName && (
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Welcome, <span className="text-primary-600 dark:text-primary-400">{userName}</span>!
                </p>
              </div>
            )}
            
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-blue-600 to-indigo-600 rounded-3xl rotate-6 opacity-20"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl flex items-center justify-center shadow-xl">
                <Key className="w-12 h-12 text-white" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                <Zap className="absolute -bottom-1 -left-1 w-4 h-4 text-blue-300 animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
              Personal AI Roadmap Setup
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
              To unlock your personal AI-powered study plans, provide your own Gemini API key or continue with default settings
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span>Your Personal API Key</span>
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <span>Unlimited personal roadmaps</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <span>Advanced AI personalization for you</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <span>Fastest response times</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <span>Premium question quality</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <span>Stored securely for your account</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <span>Default Mode</span>
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-yellow-500" />
                  <span>Limited daily generations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-yellow-500" />
                  <span>Basic roadmap templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-yellow-500" />
                  <span>Standard response times</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-yellow-500" />
                  <span>General question sets</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-yellow-500" />
                  <span>Shared resources</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                <Key className="w-5 h-5 inline mr-2" />
                Enter Your Personal Gemini API Key (Optional)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Paste ${userName ? userName + "'s" : "your"} Gemini API key here...`}
                className="w-full px-6 py-4 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Save className="w-5 h-5" />
                <span>Save My Key & Continue</span>
              </button>
              
              <button
                onClick={handleSkip}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Skip for Now</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-lg">
                  How to get your personal Gemini API Key:
                </h4>
                <ol className="text-blue-800 dark:text-blue-400 space-y-2 list-decimal list-inside">
                  <li>Visit <span className="font-semibold">Google AI Studio</span> (makersuite.google.com)</li>
                  <li>Sign in with your Google account</li>
                  <li>Click "Get API Key" and create a new key</li>
                  <li>Copy and paste it in the field above</li>
                </ol>
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>🔒 Privacy:</strong> Your API key is stored locally on your device and linked to your account only. We never access or share your personal API key.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skip Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userName}, don't have an API key? No problem! You can skip this step and use our default service with essential features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;


