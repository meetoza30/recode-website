import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Building, Target, Wand2, AlertCircle, Sparkles, Users, Code, Key, ArrowRight } from 'lucide-react';

const RoadmapGenerator = ({ companies, companiesLoading, onGenerate, setLoading, hasApiKey, skipApiKey }) => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [userQuery, setUserQuery] = useState('');

  const handleGenerate = async () => {
    if (!selectedCompany || !userQuery.trim()) {
      toast.error('Please select a company and describe your goals');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          company: selectedCompany,
          userQuery: userQuery,
          hasApiKey: hasApiKey // Send actual API key status
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Server error: ${response.status}`);
        setLoading(false);
        return;
      }

      const responseText = await response.text();
      if (!responseText) {
        toast.error('Empty response from server');
        setLoading(false);
        return;
      }

      const data = JSON.parse(responseText);
      
      if (data.success) {
        let roadmapData = data.roadmap;
        if (typeof roadmapData === 'string') {
          roadmapData = JSON.parse(roadmapData);
        }
        onGenerate(roadmapData);
        toast.success(`Roadmap generated in ${data.responseTime}s!`);
      } else {
        toast.error('Failed to generate roadmap: ' + data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Error generating roadmap');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-dark-700/50 p-8 md:p-10 relative overflow-hidden">
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        
        <div className="relative space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Your Roadmap
              </h2>
              <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Tell us your goals and we'll create a personalized study plan
            </p>

            {/* API Status Indicator - Only show the ACTUAL status */}
            <div className="flex justify-center mt-4">
              {hasApiKey ? (
                <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
                  <Key className="w-4 h-4" />
                  <span className="text-sm font-semibold">Premium Mode Active</span>
                </div>
              ) : skipApiKey ? (
                <div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Default Mode</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
                  <Code className="w-4 h-4" />
                  <span className="text-sm font-semibold">Standard Mode</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Company Selection */}
            <div className="space-y-4">
              <label className="flex items-center space-x-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span>Dream Company</span>
                {companiesLoading && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                )}
              </label>
              
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white/50 dark:bg-dark-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-lg backdrop-blur-sm"
                disabled={companiesLoading}
              >
                <option value="">
                  {companiesLoading ? "Loading companies..." : "Choose your target company..."}
                </option>
                {companies.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
              
              {companies.length === 0 && !companiesLoading && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      No companies loaded. Please check your connection.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Company Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{companies.length} companies available</span>
                </div>
              </div>
            </div>

            {/* User Query */}
            <div className="space-y-4">
              <label className="flex items-center space-x-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span>Your Goals & Weaknesses</span>
              </label>
              
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={hasApiKey 
                  ? "e.g., I am weak in data structures like trees and graphs, need help with system design. I want to focus on medium-level problems and prepare for technical rounds. Please include specific examples and practice resources..."
                  : "e.g., I need help with data structures and algorithms. Focus on basic to medium problems for software engineering roles..."
                }
                rows={6}
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white/50 dark:bg-dark-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none backdrop-blur-sm"
              />
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Code className="w-4 h-4" />
                  <span>Be specific about your weak areas</span>
                </div>
                <span className={`text-xs ${userQuery.length > 50 ? 'text-green-600' : 'text-gray-400'}`}>
                  {userQuery.length} chars
                </span>
              </div>

              {/* Mode-specific Tips */}
              <div className={`p-3 rounded-lg border ${hasApiKey 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <p className={`text-xs ${hasApiKey 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-blue-700 dark:text-blue-300'
                }`}>
                  {hasApiKey 
                    ? '💡 Premium Mode: You can request detailed explanations, specific difficulty levels, and custom resource recommendations!'
                    : '💡 Default Mode: Keep your request concise. Focus on main topics and skill areas you want to improve.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleGenerate}
              disabled={companiesLoading || !selectedCompany || !userQuery.trim()}
              className="group relative px-12 py-5 bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600 hover:from-primary-700 hover:via-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 group-hover:animate-shimmer"></div>
              <div className="relative flex items-center space-x-3">
                <Wand2 className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                <span>Generate My Roadmap</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>

            {/* Generate Button Subtitle */}
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hasApiKey 
                  ? '🚀 Premium generation with advanced AI personalization'
                  : '⚡ Quick generation with essential features'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapGenerator;



