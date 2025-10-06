import React, { useState } from 'react';
import { 
  Save, 
  Wand2, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Play, 
  Book, 
  Trophy, 
  Target,
  Clock,
  TrendingUp,
  Award,
  Zap,
  ChevronDown,
  ChevronRight,
  Code2,
  Brain
} from 'lucide-react';

const RoadmapDisplay = ({ roadmap, onSave, onGenerateNew, onUpdateProgress }) => {
  const [expandedSteps, setExpandedSteps] = useState(new Set([0]));

  const toggleStep = (stepIndex) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepIndex)) {
      newExpanded.delete(stepIndex);
    } else {
      newExpanded.add(stepIndex);
    }
    setExpandedSteps(newExpanded);
  };

  const toggleQuestionComplete = async (stepIndex, questionIndex) => {
    const updatedRoadmap = { ...roadmap };
    const question = updatedRoadmap.roadmap[stepIndex].questions[questionIndex];
    question.completed = !question.completed;
    onUpdateProgress(updatedRoadmap);
  };

  const calculateProgress = () => {
    if (!roadmap?.roadmap) return 0;
    const totalQuestions = roadmap.roadmap.reduce((acc, step) => acc + step.questions.length, 0);
    const completedQuestions = roadmap.roadmap.reduce(
      (acc, step) => acc + step.questions.filter(q => q.completed).length, 0
    );
    return totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
  };

  const getStepProgress = (step) => {
    const total = step.questions.length;
    const completed = step.questions.filter(q => q.completed).length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY':
        return 'bg-green-500 text-white';
      case 'MEDIUM':
        return 'bg-yellow-500 text-white';
      case 'HARD':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getStepIcon = (stepIndex) => {
    const icons = [Code2, Brain, Target, Book, Zap];
    return icons[stepIndex % icons.length];
  };

  if (!roadmap || !roadmap.roadmap) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <h3 className="text-xl font-bold text-red-800 mb-4">
            Error: Invalid Roadmap Data
          </h3>
          <p className="text-red-600 mb-6">
            The roadmap data is missing or corrupted. Please try generating a new roadmap.
          </p>
          <button
            onClick={onGenerateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Generate New Roadmap
          </button>
        </div>
      </div>
    );
  }

  const overallProgress = calculateProgress();
  const totalQuestions = roadmap.roadmap.reduce((acc, step) => acc + step.questions.length, 0);
  const completedQuestions = roadmap.roadmap.reduce(
    (acc, step) => acc + step.questions.filter(q => q.completed).length, 0
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-yellow-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                {roadmap.company} Interview Roadmap
              </h2>
            </div>
            
            <p className="text-blue-100 text-lg">
              Your personalized study plan with {totalQuestions} carefully selected questions
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Target className="w-4 h-4 text-green-300" />
                <span className="font-semibold">{completedQuestions}/{totalQuestions} Complete</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <TrendingUp className="w-4 h-4 text-blue-300" />
                <span className="font-semibold">{overallProgress}% Progress</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Clock className="w-4 h-4 text-purple-300" />
                <span className="font-semibold">{roadmap.roadmap.length} Steps</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 max-w-md">
              <div className="flex justify-between text-sm text-blue-100">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={onSave}
              className="group bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Save Roadmap</span>
            </button>
            
            {overallProgress === 100 && (
              <div className="flex items-center space-x-2 text-green-300 font-semibold">
                <Award className="w-4 h-4" />
                <span>Completed!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="space-y-6">
        {roadmap.roadmap.map((step, stepIndex) => {
          const progress = getStepProgress(step);
          const isExpanded = expandedSteps.has(stepIndex);
          const StepIcon = getStepIcon(stepIndex);
          
          return (
            <div key={step.step} className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
              {/* Step Header */}
              <div 
                className="cursor-pointer p-6 hover:bg-blue-50 transition-all"
                onClick={() => toggleStep(stepIndex)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Step Icon */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md">
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {step.step}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{step.questions.length} questions</span>
                        <span>•</span>
                        <span>{progress.completed}/{progress.total} completed</span>
                        <span>•</span>
                        <span className={`font-semibold ${progress.percentage === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                          {progress.percentage}% done
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Progress Circle */}
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                          strokeDasharray="100, 100"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={progress.percentage === 100 ? '#10b981' : '#3b82f6'}
                          strokeWidth="2"
                          strokeDasharray={`${progress.percentage}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-bold ${progress.percentage === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                          {progress.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      progress.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Questions Content */}
              {isExpanded && (
                <div className="border-t border-blue-100 p-6 space-y-4 bg-blue-50">
                  {step.questions.map((question, questionIndex) => (
                    <div
                      key={question.id || questionIndex}
                      className="group bg-white border border-blue-100 rounded-lg p-4 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleQuestionComplete(stepIndex, questionIndex)}
                          className="flex-shrink-0 mt-1 p-1 hover:scale-110 transition-transform"
                        >
                          {question.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors" />
                          )}
                        </button>

                        {/* Question Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <h4 className={`font-semibold transition-all ${
                              question.completed 
                                ? 'line-through text-gray-500' 
                                : 'text-gray-900 group-hover:text-blue-600'
                            }`}>
                              {question.title || question.question}
                            </h4>
                            
                            {question.difficulty && (
                              <div className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                              </div>
                            )}
                          </div>

                          {/* DSA Question Resources */}
                          {question.link && (
                            <div className="space-y-2">
                              {question.topics && (
                                <div className="flex flex-wrap gap-1">
                                  {question.topics.map((topic, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2">
                                <a
                                  href={question.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 text-sm"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>LeetCode</span>
                                </a>
                                {question.youtube_videos && question.youtube_videos.length > 0 && (
                                  <a
                                    href={question.youtube_videos[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 font-medium transition-colors bg-red-50 px-3 py-1 rounded hover:bg-red-100 text-sm"
                                  >
                                    <Play className="w-3 h-3" />
                                    <span>Tutorial</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Core Question Answer */}
                          {question.answer && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start space-x-2">
                                <Book className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-semibold text-gray-800 mb-1">Answer:</p>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {question.answer}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="bg-white rounded-xl p-6 text-center border border-blue-100">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900">
              Ready for More Challenges?
            </h3>
            <p className="text-gray-600">
              Generate another roadmap for a different company or role
            </p>
          </div>
          
          <button
            onClick={onGenerateNew}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 mx-auto shadow-md hover:shadow-lg"
          >
            <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Generate New Roadmap</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDisplay;