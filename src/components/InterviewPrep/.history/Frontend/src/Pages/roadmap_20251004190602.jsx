import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { companyService } from '../api';
import Quiz from '../Components/Roadmap/Quiz';
import ApiKeyModal from '../Components/Roadmap/ApiKeyModal';
import CompanySelection from '../Components/Roadmap/CompanySelection';

import LoadingScreen from '../Components/Roadmap/LoadingScreen';
import RoadmapDisplay from '../Components/Roadmap/RoadmapDisplay';
import SaveRoadmapModal from '../Components/Roadmap/SaveRoadmapModal';

const Roadmap = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState('quiz'); // quiz -> apiKey -> company -> generate -> result
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [skipApiKey, setSkipApiKey] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Create user-specific localStorage keys
  const getUserApiKeyName = (userId) => `gemini_api_key_${userId}`;
  const getUserSkipKeyName = (userId) => `roadmap_skip_api_key_${userId}`;

  useEffect(() => {
    if (!user?.id) return;

    // Check for existing API key
    const userApiKeyName = getUserApiKeyName(user.id);
    const userSkipKeyName = getUserSkipKeyName(user.id);
    
    const storedApiKey = localStorage.getItem(userApiKeyName);
    const skippedApiKey = localStorage.getItem(userSkipKeyName);
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setHasApiKey(true);
      setSkipApiKey(false);
    } else if (skippedApiKey === 'true') {
      setSkipApiKey(true);
      setHasApiKey(false);
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

  const handleQuizComplete = (scores) => {
    console.log('Quiz completed with scores:', scores);
    // Navigate to API key page
    setCurrentStep('apiKey');
  };

  const handleSkipQuiz = (existingScores) => {
    console.log('Quiz skipped, existing scores:', existingScores);
    // Navigate to API key page
    setCurrentStep('apiKey');
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
    
    localStorage.setItem(userApiKeyName, key);
    localStorage.removeItem(userSkipKeyName);
    
    toast.success(`API key saved for ${user.name}!`);
    setCurrentStep('company');
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
    
    localStorage.setItem(userSkipKeyName, 'true');
    localStorage.removeItem(userApiKeyName);
    
    toast.success('Proceeding with default functionality.');
    setCurrentStep('company');
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setCurrentStep('generate');
  };

  const handleRoadmapGenerated = (roadmap) => {
    setGeneratedRoadmap(roadmap);
    setLoading(false);
    setCurrentStep('result');
  };

  const handleGenerateNew = () => {
    setGeneratedRoadmap(null);
    setSelectedCompany('');
    setCurrentStep('company');
  };

  const handleSaveSuccess = () => {
    setShowSaveModal(false);
    toast.success('Roadmap saved to your profile!');
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
    setCurrentStep('apiKey');
  };

  // Check if user already completed quiz and skip directly to API key
  useEffect(() => {
    if (user?.id && currentStep === 'quiz') {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData?.quiz_taken) {
        // User already took quiz, skip directly to API key
        console.log('User already completed quiz, skipping to API key');
        setCurrentStep('apiKey');
      }
    }
  }, [user, currentStep]);

  // Show login prompt if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6">Login Required</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Please login to access the AI-powered roadmap generator and save your progress.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'quiz':
        return (
          <Quiz 
            onQuizComplete={handleQuizComplete} 
            onSkipQuiz={handleSkipQuiz}
            userName={user.name} 
          />
        );
      
      case 'apiKey':
        return (
          <ApiKeyModal 
            onSubmit={handleApiKeySubmit}
            onSkip={handleSkipApiKey}
            userName={user.name}
          />
        );
      
      case 'company':
        return (
          <CompanySelection
            companies={companies}
            companiesLoading={companiesLoading}
            onCompanySelect={handleCompanySelect}
            hasApiKey={hasApiKey}
            skipApiKey={skipApiKey}
            onRetryApiKey={handleRetryApiKey}
            userName={user.name}
          />
        );
    
      
      case 'result':
        return (
          <RoadmapDisplay
            roadmap={generatedRoadmap}
            onSave={() => setShowSaveModal(true)}
            onGenerateNew={handleGenerateNew}
            onUpdateProgress={(updatedRoadmap) => setGeneratedRoadmap(updatedRoadmap)}
          />
        );
      
      default:
        return (
          <Quiz 
            onQuizComplete={handleQuizComplete} 
            onSkipQuiz={handleSkipQuiz}
            userName={user.name} 
          />
        );
    }
  };

  // Show loading during roadmap generation
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Steps */}
      {currentStep !== 'quiz' && currentStep !== 'result' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {[
                { step: 'quiz', label: 'Skill Assessment', completed: true },
                { step: 'apiKey', label: 'API Setup', completed: ['company', 'generate', 'result'].includes(currentStep) },
                { step: 'company', label: 'Company', completed: ['generate', 'result'].includes(currentStep) },
                { step: 'generate', label: 'Generate', completed: currentStep === 'result' }
              ].map((step, index) => (
                <div key={step.step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : step.step === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-semibold ${
                      step.completed || step.step === currentStep
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}>
                      {step.label}
                    </div>
                  </div>
                  {index < 3 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderCurrentStep()}

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
  );
};

export default Roadmap;