import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { companyService } from '../api';
import ApiKeyModal from '../Components/Roadmap/ApiKeyModal';
import RoadmapGenerator from '../Components/Roadmap/RoadmapGenerator';
import LoadingScreen from '../Components/Roadmap/LoadingScreen';
import RoadmapDisplay from '../Components/Roadmap/RoadmapDisplay';
import SaveRoadmapModal from '../Components/Roadmap/SaveRoadmapModal';

const Roadmap = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [skipApiKey, setSkipApiKey] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(true);
  const [apiKeyChecked, setApiKeyChecked] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Create user-specific localStorage keys
  const getUserApiKeyName = (userId) => `gemini_api_key_${userId}`;
  const getUserSkipKeyName = (userId) => `roadmap_skip_api_key_${userId}`;

  // Debug log
  console.log('Roadmap component state:', {
    loading,
    generatedRoadmap: generatedRoadmap ? 'exists' : 'null',
    showApiKeyModal,
    apiKeyChecked,
    user: user ? 'logged in' : 'not logged in'
  });

  // Check for existing API key for current user
  useEffect(() => {
    if (!user?.id) {
      setApiKeyChecked(true);
      setShowApiKeyModal(true);
      return;
    }

    const userApiKeyName = getUserApiKeyName(user.id);
    const userSkipKeyName = getUserSkipKeyName(user.id);
    
    const storedApiKey = localStorage.getItem(userApiKeyName);
    const skippedApiKey = localStorage.getItem(userSkipKeyName);
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setHasApiKey(true);
      setSkipApiKey(false);
      setShowApiKeyModal(false);
      setApiKeyChecked(true);
    } else if (skippedApiKey === 'true') {
      setSkipApiKey(true);
      setHasApiKey(false);
      setShowApiKeyModal(false);
      setApiKeyChecked(true);
    } else {
      setShowApiKeyModal(true);
      setHasApiKey(false);
      setSkipApiKey(false);
      setApiKeyChecked(true);
    }
    
    fetchCompanies();
  }, [user]);

  const fetchCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const response = await companyService.getCompanies();
      if (response && response.success) {
        const companiesData = response.message || response.data || [];
        setCompanies(companiesData);
      } else {
        setCompanies([]);
        toast.error('Failed to load companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
      toast.error('Failed to load companies');
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleApiKeySubmit = (key) => {
    if (!user?.id) {
      toast.error('Please login first');
      return;
    }

    const userApiKeyName = getUserApiKeyName(user.id);
    const userSkipKeyName = getUserSkipKeyName(user.id);

    setApiKey(key);
    setHasApiKey(true);
    setSkipApiKey(false);
    setShowApiKeyModal(false);
    
    localStorage.setItem(userApiKeyName, key);
    localStorage.removeItem(userSkipKeyName);
    
    toast.success(`API key saved for ${user.name}! Premium features enabled.`);
  };

  const handleSkipApiKey = () => {
    if (!user?.id) {
      toast.error('Please login first');
      return;
    }

    const userApiKeyName = getUserApiKeyName(user.id);
    const userSkipKeyName = getUserSkipKeyName(user.id);

    setSkipApiKey(true);
    setHasApiKey(false);
    setShowApiKeyModal(false);
    
    localStorage.setItem(userSkipKeyName, 'true');
    localStorage.removeItem(userApiKeyName);
    
    toast.success('Proceeding with default functionality.');
  };

  const handleRetryApiKey = () => {
    if (!user?.id) return;

    const userApiKeyName = getUserApiKeyName(user.id);
    const userSkipKeyName = getUserSkipKeyName(user.id);

    localStorage.removeItem(userSkipKeyName);
    localStorage.removeItem(userApiKeyName);
    setSkipApiKey(false);
    setHasApiKey(false);
    setApiKey('');
    setShowApiKeyModal(true);
  };

  const handleRoadmapGenerated = (roadmap) => {
    console.log('Roadmap generated:', roadmap);
    setGeneratedRoadmap(roadmap);
    setLoading(false);
  };

  const handleGenerateNew = () => {
    setGeneratedRoadmap(null);
  };

  const handleSaveSuccess = () => {
    setShowSaveModal(false);
    toast.success('Roadmap saved to your profile!');
  };

  // Show loading while checking API key status
  if (!apiKeyChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Checking your settings...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-700 bg-clip-text text-transparent mb-6">Login Required</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Please login to access the AI-powered roadmap generator and save your progress.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show API Key Modal for new users or those who want to re-enter key
  if (showApiKeyModal) {
    return (
      <ApiKeyModal 
        onSubmit={handleApiKeySubmit}
        onSkip={handleSkipApiKey}
        userName={user.name}
      />
    );
  }

  // Main roadmap page content (only shown after API key decision)
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              AI-Powered Interview Roadmap
            </h1>
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-30 shadow-lg"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce opacity-40 shadow-lg"></div>
          </div>
          
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            Welcome back, <span className="font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{user.name}</span>! 
            Get a personalized study plan crafted by AI
          </p>
          
          {/* Enhanced User-Specific API Key Status Banner */}
          {skipApiKey && (
            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl max-w-2xl mx-auto shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">!</span>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-yellow-800">
                      Using Default API
                    </p>
                    <p className="text-sm text-yellow-700 font-medium">
                      {user.name}, add your personal API key for better results
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRetryApiKey}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Add Key
                </button>
              </div>
            </div>
          )}

          {hasApiKey && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl max-w-2xl mx-auto shadow-xl">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">✓</span>
                </div>
                <p className="text-lg font-bold text-green-800">
                  {user.name}'s API Key Active - Premium Features Enabled
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Debug Info */}
        <div className="text-center p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-lg">
          <p className="text-blue-700 font-medium">
            Debug Status: Loading: {loading ? 'true' : 'false'} | Roadmap: {generatedRoadmap ? 'exists' : 'null'}
          </p>
        </div>

        {/* Loading Screen */}
        {loading && <LoadingScreen />}

        {/* Enhanced Main Content */}
        {!loading && (
          <div>
            {!generatedRoadmap ? (
              <RoadmapGenerator
                companies={companies}
                companiesLoading={companiesLoading}
                onGenerate={handleRoadmapGenerated}
                setLoading={setLoading}
                hasApiKey={hasApiKey}
                skipApiKey={skipApiKey}
                user={user}
              />
            ) : (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    Your Generated Roadmap
                  </h2>
                  <p className="text-gray-600 text-lg font-medium">Tailored specifically for your goals</p>
                </div>
                <RoadmapDisplay
                  roadmap={generatedRoadmap}
                  onSave={() => setShowSaveModal(true)}
                  onGenerateNew={handleGenerateNew}
                  onUpdateProgress={(updatedRoadmap) => setGeneratedRoadmap(updatedRoadmap)}
                />
              </div>
            )}
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <SaveRoadmapModal
            roadmap={generatedRoadmap}
            user={user}
            onClose={() => setShowSaveModal(false)}
            onSuccess={handleSaveSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Roadmap;
