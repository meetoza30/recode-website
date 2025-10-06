import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Save, X, User, Calendar, Target, BookOpen, Sparkles } from 'lucide-react';

const SaveRoadmapModal = ({ roadmap, user, onClose, onSuccess }) => {
  const [roadmapName, setRoadmapName] = useState(
    `${roadmap.company} Roadmap - ${new Date().toLocaleDateString()}`
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!roadmapName.trim()) {
      toast.error('Please enter a roadmap name');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('http://localhost:3000/api/roadmap/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          userId: user.id,
          roadmapName: roadmapName.trim(),
          roadmap: roadmap
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Roadmap saved successfully!');
        onSuccess();
      } else {
        toast.error('Failed to save roadmap');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Error saving roadmap');
    } finally {
      setSaving(false);
    }
  };

  const totalQuestions = roadmap.roadmap?.reduce((acc, step) => acc + step.questions.length, 0) || 0;
  const dsaQuestions = roadmap.roadmap?.reduce((acc, step) => 
    acc + step.questions.filter(q => q.link).length, 0
  ) || 0;
  const theoryQuestions = totalQuestions - dsaQuestions;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative transform transition-all duration-300 scale-100">
        
        {/* Background Decorations */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Save className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Save Your Roadmap
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Save this roadmap to your profile for future reference
              </p>
            </div>
            
            <button
              onClick={onClose}
              disabled={saving}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Roadmap Summary Card */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-6 mb-8 border border-primary-200/50 dark:border-primary-700/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  <span>{roadmap.company} Interview Preparation</span>
                </h4>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    AI Generated
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/60 dark:bg-dark-800/60 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {roadmap.roadmap?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Steps
                  </div>
                </div>
                
                <div className="bg-white/60 dark:bg-dark-800/60 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {dsaQuestions}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    DSA Problems
                  </div>
                </div>
                
                <div className="bg-white/60 dark:bg-dark-800/60 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {theoryQuestions}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Theory Questions
                  </div>
                </div>
                
                <div className="bg-white/60 dark:bg-dark-800/60 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {totalQuestions}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Total Questions
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <span>Roadmap Name</span>
              </label>
              <input
                type="text"
                value={roadmapName}
                onChange={(e) => setRoadmapName(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-lg"
                placeholder="Enter a name for your roadmap..."
                disabled={saving}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This name will appear in your profile under saved roadmaps
              </p>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Saved on {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save to Profile</span>
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                disabled={saving}
                className="flex-1 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveRoadmapModal;


