import React from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Play, 
  Book,
  Code2,
  Brain,
  Target,
  Zap
} from 'lucide-react';

const RoadmapStep = ({ 
  step, 
  stepIndex, 
  isExpanded, 
  progress, 
  onToggle, 
  onQuestionToggle,
  getDifficultyColor 
}) => {

  const getStepIcon = (stepIndex) => {
    const icons = [Code2, Brain, Target, Book, Zap];
    const Icon = icons[stepIndex % icons.length];
    return Icon;
  };

  const StepIcon = getStepIcon(stepIndex);

  return (
    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Step Header */}
      <div 
        className="cursor-pointer p-6 hover:bg-gray-50/80 dark:hover:bg-dark-700/80 transition-all duration-200"
        onClick={onToggle}
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
            <button className="p-2 hover:bg-gray-200/50 dark:hover:bg-dark-600/50 rounded-lg transition-colors">
              {isExpanded ? (
                <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
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
        <div className="border-t border-gray-200/50 dark:border-dark-600/50 p-6 space-y-4 bg-gray-50/30 dark:bg-dark-700/30">
          {step.questions.map((question, questionIndex) => (
            <div
              key={question.id}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-dark-600/50 rounded-xl p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <button
                  onClick={() => onQuestionToggle(questionIndex)}
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
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex-shrink-0 bg-gradient-to-r ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </div>
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
                    <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-dark-700/50 dark:to-blue-900/10 rounded-xl border border-gray-200/50 dark:border-blue-800/30">
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
};

export default RoadmapStep;
