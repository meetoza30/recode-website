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
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Save className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Save Your Roadmap
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Save this roadmap to your profile for future reference
            </p>
          </div>
          
          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Roadmap Summary Card */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span>{roadmap.company} Interview Preparation</span>
              </h4>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-semibold text-blue-600">
                  AI Generated
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {roadmap.roadmap?.length || 0}
                </div>
                <div className="text-xs text-gray-600">
                  Steps
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {dsaQuestions}
                </div>
                <div className="text-xs text-gray-600">
                  DSA Problems
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {theoryQuestions}
                </div>
                <div className="text-xs text-gray-600">
                  Theory
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {totalQuestions}
                </div>
                <div className="text-xs text-gray-600">
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Roadmap Name</span>
            </label>
            <input
              type="text"
              value={roadmapName}
              onChange={(e) => setRoadmapName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
              placeholder="Enter a name for your roadmap..."
              disabled={saving}
            />
            <p className="text-xs text-gray-500 mt-1">
              This name will appear in your profile under saved roadmaps
            </p>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>Saved on {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save to Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveRoadmapModal;