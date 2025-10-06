import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Brain, Clock, Target, CheckCircle, ArrowRight, Zap, BookOpen, Star, SkipForward } from 'lucide-react';
import { quizService } from '../../api';

const Quiz = ({ onQuizComplete, userName, onSkipQuiz }) => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingScore, setHasExistingScore] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const quizCategories = [
    { name: 'Data Structures & Algorithms', key: 'dsa', icon: Brain },
    { name: 'Database Management', key: 'dbms', icon: BookOpen },
    { name: 'Operating Systems', key: 'os', icon: Zap },
    { name: 'Computer Networks', key: 'cn', icon: Target }
  ];

  const quizQuestions = {
    dsa: [
      {
        id: 'dsa_1',
        question: "What is the time complexity of searching an element in a balanced binary search tree?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        answer: "O(log n)"
      },
      {
        id: 'dsa_2',
        question: "Which data structure is used to implement recursion?",
        options: ["Queue", "Stack", "Linked List", "Array"],
        answer: "Stack"
      },
      {
        id: 'dsa_3',
        question: "What is the worst-case time complexity of QuickSort?",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        answer: "O(n²)"
      },
      {
        id: 'dsa_4',
        question: "In a min-heap, the parent node is always:",
        options: ["Greater than its children", "Smaller than its children", "Equal to its children", "None of the above"],
        answer: "Smaller than its children"
      },
      {
        id: 'dsa_5',
        question: "Which traversal of a binary tree visits nodes in ascending order for a BST?",
        options: ["Pre-order", "Post-order", "In-order", "Level-order"],
        answer: "In-order"
      },
      {
        id: 'dsa_6',
        question: "Which of the following problems can be solved using Dynamic Programming?",
        options: [
          "Finding the shortest path in an unweighted graph",
          "Calculating the nth Fibonacci number efficiently",
          "Sorting an array of integers",
          "Searching for an element in a sorted array"
        ],
        answer: "Calculating the nth Fibonacci number efficiently"
      },
      {
        id: 'dsa_7',
        question: "Which of the following is NOT a stable sorting algorithm?",
        options: ["Merge Sort", "Insertion Sort", "Quick Sort", "Bubble Sort"],
        answer: "Quick Sort"
      },
      {
        id: 'dsa_8',
        question: "What is the maximum number of edges in a simple undirected graph with n vertices?",
        options: ["n", "n-1", "n(n-1)/2", "n²"],
        answer: "n(n-1)/2"
      }
    ],
    dbms: [
      {
        id: 'dbms_1',
        question: "Which normal form eliminates transitive dependency?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        answer: "3NF"
      },
      {
        id: 'dbms_2',
        question: "What does ACID stand for in database transactions?",
        options: [
          "Atomicity, Consistency, Isolation, Durability",
          "Association, Consistency, Isolation, Dependency",
          "Atomicity, Concurrency, Isolation, Durability",
          "Association, Concurrency, Integration, Dependency"
        ],
        answer: "Atomicity, Consistency, Isolation, Durability"
      },
      {
        id: 'dbms_3',
        question: "Which SQL command is used to remove a table from the database?",
        options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"],
        answer: "DROP"
      },
      {
        id: 'dbms_4',
        question: "In an ER model, what type of relationship exists between 'Student' and 'Course' entities if a student can enroll in multiple courses and each course can have multiple students?",
        options: ["One-to-One (1:1)", "One-to-Many (1:M)", "Many-to-One (M:1)", "Many-to-Many (M:M)"],
        answer: "Many-to-Many (M:M)"
      }
    ],
    os: [
      {
        id: 'os_1',
        question: "Which scheduling algorithm can cause starvation?",
        options: ["Round Robin", "FCFS", "Priority Scheduling", "SJF"],
        answer: "Priority Scheduling"
      },
      {
        id: 'os_2',
        question: "What is the main purpose of virtual memory?",
        options: [
          "To increase CPU speed",
          "To provide more memory than physically available",
          "To improve disk performance",
          "To enhance network connectivity"
        ],
        answer: "To provide more memory than physically available"
      },
      {
        id: 'os_3',
        question: "Which of the following is a condition for deadlock?",
        options: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "All of the above"],
        answer: "All of the above"
      },
      {
        id: 'os_4',
        question: "What does thrashing refer to in operating systems?",
        options: ["High CPU utilization", "Excessive paging activity", "Memory fragmentation", "Process synchronization"],
        answer: "Excessive paging activity"
      }
    ],
    cn: [
      {
        id: 'cn_1',
        question: "Which layer of the OSI model handles routing?",
        options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
        answer: "Network Layer"
      },
      {
        id: 'cn_2',
        question: "What does DNS stand for and what is its primary function?",
        options: [
          "Domain Name System - converts domain names to IP addresses",
          "Data Network Service - manages network traffic",
          "Dynamic Network Security - handles network encryption",
          "Distributed Name Server - distributes server loads"
        ],
        answer: "Domain Name System - converts domain names to IP addresses"
      },
      {
        id: 'cn_3',
        question: "Which protocol is used for reliable data transfer?",
        options: ["UDP", "TCP", "IP", "ICMP"],
        answer: "TCP"
      },
      {
        id: 'cn_4',
        question: "What does ARP stand for?",
        options: ["Address Resolution Protocol", "Application Response Protocol", "Automatic Routing Protocol", "Access Request Protocol"],
        answer: "Address Resolution Protocol"
      }
    ]
  };

  // Check if user has existing quiz score
  useEffect(() => {
    const checkExistingScore = () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData?.quiz_score) {
        setHasExistingScore(true);
      }
    };
    checkExistingScore();
  }, []);

  const currentCategoryData = quizCategories[currentCategory];
  const currentQuestions = quizQuestions[currentCategoryData.key];
  const currentQ = currentQuestions[currentQuestion];

  const totalQuestions = 20;
  const answeredQuestions = Object.keys(answers).length;
  const currentProgress = Math.round((answeredQuestions / totalQuestions) * 100);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentCategory < quizCategories.length - 1) {
      setCurrentCategory(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentCategory > 0) {
      setCurrentCategory(prev => prev - 1);
      const prevCategoryQuestions = quizQuestions[quizCategories[prev].key];
      setCurrentQuestion(prevCategoryQuestions.length - 1);
    }
  };

  const calculateScores = () => {
    const scores = {
      dsa: 0,
      dbms: 0,
      os: 0,
      cn: 0
    };

    Object.entries(answers).forEach(([questionId, userAnswer]) => {
      const category = questionId.split('_')[0];
      const categoryQuestions = quizQuestions[category];
      const question = categoryQuestions.find(q => q.id === questionId);
      
      if (question && userAnswer === question.answer) {
        scores[category]++;
      }
    });

    return scores;
  };

  const saveQuizToLocalStorage = (scores) => {
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = { 
      ...userData, 
      quiz_score: scores,
      quiz_completed_at: new Date().toISOString(),
      quiz_taken: true
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const scores = calculateScores();
      
      console.log('Submitting scores:', scores);

      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?.id;

      if (!userId) {
        toast.error('User not found. Please login again.');
        return;
      }

      // Save to backend
      const result = await quizService.updateQuizScore(userId, scores);
      
      if (result) {
        // Save to local storage
        saveQuizToLocalStorage(scores);
        
        toast.success('Quiz completed! Your skills have been assessed.');
        onQuizComplete(scores);
      } else {
        toast.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Quiz submission error:', error);
      // Even if backend fails, save locally
      const scores = calculateScores();
      saveQuizToLocalStorage(scores);
      toast.success('Quiz completed! Your scores have been saved locally.');
      onQuizComplete(scores);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipQuiz = () => {
    setShowSkipModal(true);
  };

  const confirmSkipQuiz = () => {
    setShowSkipModal(false);
    
    // Get existing scores from local storage
    const userData = JSON.parse(localStorage.getItem('user'));
    const existingScores = userData?.quiz_score;
    
    if (onSkipQuiz) {
      onSkipQuiz(existingScores);
    }
  };

  const CategoryIcon = currentCategoryData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
        
        {/* Header - IMPROVED: Better skip button placement and size */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Skill Assessment Quiz</h1>
                <p className="text-blue-100">
                  {hasExistingScore 
                    ? `Hello ${userName}! Update your skills or skip to continue.`
                    : `Hello ${userName}! Let's assess your technical skills`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{answeredQuestions}/{totalQuestions}</div>
              <div className="text-blue-200 text-sm">Questions Answered</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-blue-100">
              <span>Overall Progress</span>
              <span>{currentProgress}%</span>
            </div>
            <div className="w-full bg-blue-500/30 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Skip Quiz Button - IMPROVED: Better placement and size */}
          {hasExistingScore && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleSkipQuiz}
                className="flex items-center space-x-3 px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border border-blue-200 hover:scale-105"
              >
                <SkipForward className="w-5 h-5" />
                <span className="text-lg">Skip Quiz</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 pt-12">
          {/* Category Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <CategoryIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentCategoryData.name}</h2>
                <p className="text-gray-600">
                  Question {currentQuestion + 1} of {currentQuestions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-semibold">Category {currentCategory + 1} of {quizCategories.length}</span>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{currentQ.question}</h3>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => {
                  const isSelected = answers[currentQ.id] === option;
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQ.id, option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold ${
                          isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {optionLetters[index]}
                        </div>
                        <span className="text-gray-800 font-medium">{option}</span>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <button
                onClick={handlePrevious}
                disabled={currentCategory === 0 && currentQuestion === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-xl font-semibold transition-all duration-200"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">{answeredQuestions} questions answered</span>
              </div>

              <button
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105"
              >
                <span>
                  {currentCategory === quizCategories.length - 1 && currentQuestion === currentQuestions.length - 1
                    ? isSubmitting ? 'Submitting...' : 'Complete Quiz'
                    : 'Next Question'
                  }
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Progress */}
         
        </div>
      </div>

      {/* Skip Quiz Confirmation Modal - FIXED: Proper background */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {hasExistingScore ? 'Skip Quiz?' : 'Start Fresh?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {hasExistingScore 
                ? "You've already completed this quiz. You can skip and use your existing scores, or retake to update them."
                : "You can skip the quiz and proceed with basic features, or complete it for personalized recommendations."
              }
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSkipModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
              >
                {hasExistingScore ? 'Retake Quiz' : 'Take Quiz'}
              </button>
              <button
                onClick={confirmSkipQuiz}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-200"
              >
                Skip & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;