import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Key, Save, ArrowRight, ExternalLink, Shield, Zap } from 'lucide-react';

const ApiKeyModal = ({ onSubmit, onSkip, userName }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    onSubmit(apiKey);
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 max-w-2xl w-full mx-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Setup Your API Key
          </h1>
          <p className="text-gray-600">
            {userName ? `Welcome ${userName}! ` : ''}Add your Gemini API key for enhanced features
          </p>
        </div>

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Gemini API Key (Optional)
          </label>
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Key className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save & Continue</span>
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Skip for Now</span>
          </button>
        </div>

        {/* Features Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">With API Key</h3>
                <p className="text-sm text-gray-600">Unlimited personalized roadmaps</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 ml-11">
              <li>• Advanced AI personalization</li>
              <li>• Faster response times</li>
              <li>• Premium question quality</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Default Mode</h3>
                <p className="text-sm text-gray-600">Basic features available</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 ml-11">
              <li>• Limited daily generations</li>
              <li>• Standard roadmap templates</li>
              <li>• General question sets</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                How to get your API key:
              </h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Visit Google AI Studio (makersuite.google.com)</li>
                <li>Sign in with your Google account</li>
                <li>Create a new API key</li>
                <li>Copy and paste it above</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              <strong>Your privacy matters:</strong> API keys are stored locally and securely on your device only.
            </p>
          </div>
        </div>

        {/* Skip Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an API key? You can skip and use basic features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;