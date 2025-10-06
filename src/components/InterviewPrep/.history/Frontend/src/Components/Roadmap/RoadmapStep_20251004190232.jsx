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
    <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden transition-all hover:shadow-lg">
      {/* Step Header */}
      <div 
        className="cursor-pointer p-6 hover:bg-blue-50 transition-all"
        onClick={onToggle}
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
              key={question.id}
              className="group bg-white border border-blue-100 rounded-lg p-4 hover:shadow-sm transition-all"
            >
              <div className="flex items-start space-x-3">
                {/* Checkbox */}
                <button
                  onClick={() => onQuestionToggle(questionIndex)}
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
                    
                    <div className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </div>
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
};

export default RoadmapStep;