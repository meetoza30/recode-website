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
  const [expandedSteps, setExpandedSteps] = useState(new Set([0])); // First step expanded by default

  // Debug log
  console.log('RoadmapDisplay received:', roadmap);

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

    // Update progress in backend if roadmap is saved
    if (roadmap.id) {
      try {
        await fetch(`http://localhost:3000/api/roadmap/${roadmap.id}/progress`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
          },
          body: JSON.stringify({
            roadmap: updatedRoadmap.roadmap
          })
        });
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    }
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
    switch (difficulty) {
      case 'EASY':
        return 'from-green-500 to-emerald-500';
      case 'MEDIUM':
        return 'from-yellow-500 to-orange-500';
      case 'HARD':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStepIcon = (stepIndex) => {
    const icons = [Code2, Brain, Target, Book, Zap];
    const Icon = icons[stepIndex % icons.length];
    return Icon;
  };

  // Safety check
  if (!roadmap || !roadmap.roadmap) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
          <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-4">
            Error: Invalid Roadmap Data
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-6">
            The roadmap data is missing or corrupted. Please try generating a new roadmap.
          </p>
          <button
            onClick={onGenerateNew}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Roadmap Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20"></div>
        </div>
        
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-yellow-300" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">
                  {roadmap.company} Interview Roadmap
                </h2>
              </div>
              
              <p className="text-xl text-blue-100 max-w-2xl">
                Your personalized study plan with {totalQuestions} carefully selected questions
              </p>
              
              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Target className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">{completedQuestions}/{totalQuestions} Complete</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <TrendingUp className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">{overallProgress}% Progress</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Clock className="w-5 h-5 text-purple-300" />
                  <span className="font-semibold">{roadmap.roadmap.length} Steps</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm text-blue-100">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={onSave}
                className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Save className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
                <span>Save Roadmap</span>
              </button>
              
              {overallProgress === 100 && (
                <div className="flex items-center space-x-2 text-green-300 font-semibold">
                  <Award className="w-5 h-5" />
                  <span>Completed!</span>
                </div>
              )}
            </div>
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
            <div key={step.step} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl">
              {/* Step Header */}
              <div 
                className="cursor-pointer p-6 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-200"
                onClick={() => toggleStep(stepIndex)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Step Number & Icon */}
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-br ${
                        stepIndex === 0 ? 'from-blue-500 to-indigo-600' :
                        stepIndex === 1 ? 'from-green-500 to-emerald-600' :
                        stepIndex === 2 ? 'from-purple-500 to-pink-600' :
                        'from-orange-500 to-red-600'
                      }`}>
                        <StepIcon className="w-7 h-7" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {step.step}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{step.questions.length} questions</span>
                        <span>•</span>
                        <span>{progress.completed}/{progress.total} completed</span>
                        <span>•</span>
                        <span className={`font-semibold ${progress.percentage === 100 ? 'text-green-600' : 'text-primary-600'}`}>
                          {progress.percentage}% done
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Progress Circle */}
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="100, 100"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${progress.percentage}, 100`}
                          className={progress.percentage === 100 ? 'text-green-500' : 'text-primary-600'}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-bold ${progress.percentage === 100 ? 'text-green-600' : 'text-primary-600'}`}>
                          {progress.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button className="p-2 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 rounded-lg transition-colors">
                      {isExpanded ? (
                        <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-700 ease-out ${
                      progress.percentage === 100 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-primary-500 to-blue-500'
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Questions Content */}
              {isExpanded && (
                <div className="border-t border-gray-200/50 dark:border-gray-600/50 p-6 space-y-4 bg-gray-50/30 dark:bg-gray-700/30">
                  {step.questions.map((question, questionIndex) => (
                    <div
                      key={question.id || questionIndex}
                      className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleQuestionComplete(stepIndex, questionIndex)}
                          className="flex-shrink-0 mt-1 p-1 hover:scale-110 transition-transform duration-200"
                        >
                          {question.completed ? (
                            <CheckCircle2 className="w-7 h-7 text-green-600" />
                          ) : (
                            <Circle className="w-7 h-7 text-gray-400 hover:text-primary-600 transition-colors" />
                          )}
                        </button>

                        {/* Question Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <h4 className={`font-semibold text-lg transition-all duration-200 ${
                              question.completed 
                                ? 'line-through text-gray-500 dark:text-gray-400' 
                                : 'text-gray-900 dark:text-white group-hover:text-primary-600'
                            }`}>
                              {question.title || question.question}
                            </h4>
                            
                            {question.difficulty && (
                              <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex-shrink-0 bg-gradient-to-r ${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                              </div>
                            )}
                          </div>

                          {/* DSA Question Resources */}
                          {question.link && (
                            <div className="space-y-3">
                              {question.topics && (
                                <div className="flex flex-wrap gap-2">
                                  {question.topics.map((topic, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex flex-wrap gap-3">
                                <a
                                  href={question.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/link flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-semibold transition-colors bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30"
                                >
                                  <ExternalLink className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                                  <span>Solve on LeetCode</span>
                                </a>
                                {question.youtube_videos && question.youtube_videos.length > 0 && (
                                  <a
                                    href={question.youtube_videos[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/video flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold transition-colors bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                                  >
                                    <Play className="w-4 h-4 group-hover/video:scale-110 transition-transform" />
                                    <span>Watch Tutorial</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Core Question Answer */}
                          {question.answer && (
                            <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/10 rounded-xl border border-gray-200/50 dark:border-blue-800/30">
                              <div className="flex items-start space-x-3">
                                <Book className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Answer:</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
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
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 dark:border-gray-700/50">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ready for More Challenges?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Generate another roadmap for a different company or role
            </p>
          </div>
          
          <button
            onClick={onGenerateNew}
            className="group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
            <span>Generate New Roadmap</span>
            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDisplay;


