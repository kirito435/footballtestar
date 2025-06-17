import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Timer from "@/components/Timer";
import { CheckCircle, XCircle, Trophy, RotateCcw, Home } from "lucide-react";

interface Question {
  id: number;
  text: string;
  answers: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

interface SinglePlayerGameProps {
  playerName: string;
  onGameEnd: () => void;
  onNewGame: () => void;
}

const arabicQuestions: Question[] = [
  {
    id: 1,
    text: "من سجل هدف الفوز في نهائي كأس العالم 2014؟",
    answers: ["ماريو غوتزه", "ليونيل ميسي", "توماس مولر", "مانويل نوير"],
    correctAnswer: 0,
    category: "كأس العالم",
    difficulty: "medium"
  },
  {
    id: 2,
    text: "ما هو النادي الذي يُلقب بـ 'السيدة العجوز'؟",
    answers: ["يوفنتوس", "ميلان", "إنتر ميلان", "نابولي"],
    correctAnswer: 0,
    category: "الأندية",
    difficulty: "easy"
  },
  {
    id: 3,
    text: "من هو أكثر لاعب تسجيلاً للأهداف في التاريخ؟",
    answers: ["كريستيانو رونالدو", "ليونيل ميسي", "بيليه", "مارادونا"],
    correctAnswer: 0,
    category: "اللاعبين",
    difficulty: "easy"
  },
  {
    id: 4,
    text: "في أي بلد أقيمت كأس العالم 2002؟",
    answers: ["اليابان وكوريا الجنوبية", "البرازيل", "ألمانيا", "فرنسا"],
    correctAnswer: 0,
    category: "كأس العالم",
    difficulty: "medium"
  },
  {
    id: 5,
    text: "ما هو أول منتخب عربي تأهل لكأس العالم؟",
    answers: ["مصر", "المغرب", "تونس", "الجزائر"],
    correctAnswer: 0,
    category: "المنتخبات العربية",
    difficulty: "hard"
  },
  {
    id: 6,
    text: "من فاز بكأس العالم 2018؟",
    answers: ["فرنسا", "كرواتيا", "بلجيكا", "إنجلترا"],
    correctAnswer: 0,
    category: "كأس العالم",
    difficulty: "easy"
  },
  {
    id: 7,
    text: "ما هو النادي الذي يُلقب بـ 'الملكي'؟",
    answers: ["ريال مدريد", "برشلونة", "أتلتيكو مدريد", "فالنسيا"],
    correctAnswer: 0,
    category: "الأندية",
    difficulty: "easy"
  },
  {
    id: 8,
    text: "من هو قائد المنتخب المصري في كأس العالم 2018؟",
    answers: ["محمد صلاح", "أحمد حجازي", "أحمد فتحي", "عصام الحضري"],
    correctAnswer: 0,
    category: "المنتخبات العربية",
    difficulty: "medium"
  },
  {
    id: 9,
    text: "كم مرة فاز البرازيل بكأس العالم؟",
    answers: ["5 مرات", "4 مرات", "6 مرات", "3 مرات"],
    correctAnswer: 0,
    category: "كأس العالم",
    difficulty: "medium"
  },
  {
    id: 10,
    text: "من هو الهداف التاريخي لبرشلونة؟",
    answers: ["ليونيل ميسي", "رونالدينيو", "تشافي", "إنييستا"],
    correctAnswer: 0,
    category: "الأندية",
    difficulty: "easy"
  },
  {
    id: 11,
    text: "في أي عام فاز المغرب بكأس الأمم الأفريقية؟",
    answers: ["1976", "1980", "1988", "1996"],
    correctAnswer: 0,
    category: "المنتخبات العربية",
    difficulty: "hard"
  },
  {
    id: 12,
    text: "من هو الحائز على الكرة الذهبية 2023؟",
    answers: ["ليونيل ميسي", "كيليان مبابي", "إيرلينغ هالاند", "كريم بنزيما"],
    correctAnswer: 0,
    category: "اللاعبين",
    difficulty: "medium"
  },
  {
    id: 13,
    text: "ما هو لقب منتخب الأرجنتين؟",
    answers: ["التانغو", "البامبا", "الغاوتشو", "الأبيض والأزرق"],
    correctAnswer: 0,
    category: "المنتخبات",
    difficulty: "medium"
  },
  {
    id: 14,
    text: "من هو مدرب منتخب فرنسا الحالي؟",
    answers: ["ديدييه ديشان", "زين الدين زيدان", "تيري أنري", "أرسين فينجر"],
    correctAnswer: 0,
    category: "المدربين",
    difficulty: "easy"
  },
  {
    id: 15,
    text: "كم هدف سجل محمد صلاح في موسم 2017-2018 مع ليفربول؟",
    answers: ["44 هدف", "42 هدف", "46 هدف", "40 هدف"],
    correctAnswer: 0,
    category: "اللاعبين",
    difficulty: "hard"
  }
];

export default function SinglePlayerGame({ playerName, onGameEnd, onNewGame }: SinglePlayerGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; correctAnswer: number } | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...arabicQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (!currentQuestion || hasAnswered || gameEnded) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, hasAnswered, gameEnded]);

  const handleTimeUp = () => {
    if (!hasAnswered) {
      setHasAnswered(true);
      setAnswerResult({ correct: false, correctAnswer: currentQuestion.correctAnswer });
      setShowResult(true);
      setTimeout(nextQuestion, 3000);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setAnswerResult({ correct: isCorrect, correctAnswer: currentQuestion.correctAnswer });
    
    if (isCorrect) {
      // Score based on remaining time
      const points = Math.max(1, Math.floor(timeRemaining / 3));
      setScore(prev => prev + points);
    }
    
    setShowResult(true);
    setTimeout(nextQuestion, 3000);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setHasAnswered(false);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setTimeRemaining(30);
    
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameEnded(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setTimeRemaining(30);
    setScore(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowResult(false);
    setAnswerResult(null);
    setGameEnded(false);
    const shuffled = [...arabicQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  };

  if (!currentQuestion && shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <p className="text-lg">جاري تحضير الأسئلة...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameEnded) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    let performance = "";
    let performanceColor = "";
    
    if (percentage >= 80) {
      performance = "ممتاز! أنت خبير كرة القدم";
      performanceColor = "text-[#228B22]";
    } else if (percentage >= 60) {
      performance = "جيد جداً! معرفة قوية بكرة القدم";
      performanceColor = "text-blue-600";
    } else if (percentage >= 40) {
      performance = "جيد! تحتاج لمزيد من المتابعة";
      performanceColor = "text-yellow-600";
    } else {
      performance = "حاول مرة أخرى! ستتحسن مع الوقت";
      performanceColor = "text-red-600";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFD700] to-yellow-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-[#FFD700] rounded-full mb-4 animate-bounce">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-[#2F4F4F] mb-2">انتهت اللعبة!</h2>
              <div className="text-2xl font-bold text-[#228B22] mb-2">{playerName}</div>
              <p className={`text-lg font-bold ${performanceColor} mb-4`}>{performance}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-[#2F4F4F] mb-4">نتائجك</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-[#228B22]">{score}</div>
                  <div className="text-sm text-gray-600">النقاط الإجمالية</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
                  <div className="text-sm text-gray-600">نسبة النجاح</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="text-lg font-bold text-[#2F4F4F] mb-2">
                  أجبت على {Math.floor(score / 3)} من {shuffledQuestions.length} سؤال بشكل صحيح
                </div>
                <Progress value={percentage} className="h-3" />
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetGame}
                className="bg-[#228B22] hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold"
              >
                <RotateCcw className="w-5 h-5 ml-2" />
                العب مرة أخرى
              </Button>
              <Button
                onClick={onNewGame}
                variant="outline"
                className="px-6 py-3 rounded-xl font-bold"
              >
                <Home className="w-5 h-5 ml-2" />
                القائمة الرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Answer Result Modal */}
      {showResult && answerResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              {answerResult.correct ? (
                <div>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[#32CD32] rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#32CD32] mb-2">إجابة صحيحة!</h3>
                  <p className="text-gray-600 mb-4">+{Math.max(1, Math.floor(timeRemaining / 3))} نقطة</p>
                </div>
              ) : (
                <div>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-4">
                    <XCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-500 mb-2">إجابة خاطئة</h3>
                  <p className="text-gray-600 mb-2">الإجابة الصحيحة:</p>
                  <p className="text-lg font-bold text-[#2F4F4F] mb-4">
                    {currentQuestion.answers[answerResult.correctAnswer]}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Header */}
      <div className="bg-[#228B22] text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <span className="text-sm opacity-80">اللاعب</span>
              <div className="font-bold text-lg">{playerName}</div>
            </div>
          </div>

          <div className="text-center">
            <Timer timeRemaining={timeRemaining} />
          </div>

          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <span className="text-sm opacity-80">السؤال</span>
              <div className="font-bold text-lg">
                {currentQuestionIndex + 1} / {shuffledQuestions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Section */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFD700] rounded-full mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2F4F4F] leading-relaxed mb-4">
                {currentQuestion.text}
              </h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {currentQuestion.category}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {currentQuestion.answers.map((answer, index) => {
                const letters = ["أ", "ب", "ج", "د"];
                const isSelected = selectedAnswer === index;
                const isCorrect = answerResult && index === answerResult.correctAnswer;
                const isWrong = answerResult && isSelected && !answerResult.correct;
                
                let buttonClass = "p-6 rounded-2xl text-right transition-all duration-200 transform hover:scale-105 border-2";
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += " bg-[#32CD32] text-white border-[#32CD32]";
                  } else if (isWrong) {
                    buttonClass += " bg-red-500 text-white border-red-500";
                  } else {
                    buttonClass += " bg-gray-100 text-gray-600 border-gray-200";
                  }
                } else if (isSelected) {
                  buttonClass += " bg-[#228B22] text-white border-[#228B22]";
                } else {
                  buttonClass += " bg-gray-50 hover:bg-[#228B22] hover:text-white border-transparent hover:border-[#228B22]";
                }

                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={hasAnswered}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-end w-full">
                      <span className="text-lg font-medium">{answer}</span>
                      <div className="w-8 h-8 bg-[#228B22] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        {letters[index]}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">التقدم</span>
              <span className="text-sm font-medium text-[#2F4F4F]">
                {Math.round(((currentQuestionIndex + 1) / shuffledQuestions.length) * 100)}%
              </span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / shuffledQuestions.length) * 100} className="h-3" />
          </CardContent>
        </Card>
      </div>

      {/* Score Display */}
      <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 border-2 border-[#228B22]">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#228B22]">{score}</div>
          <div className="text-sm text-gray-600">النقاط</div>
        </div>
      </div>
    </div>
  );
}