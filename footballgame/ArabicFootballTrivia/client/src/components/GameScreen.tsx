import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Timer from "@/components/Timer";
import { CheckCircle, XCircle } from "lucide-react";
import type { Question, GamePlayer } from "@shared/schema";

interface GameScreenProps {
  playerName: string;
  players: GamePlayer[];
  currentQuestion: Question | null;
  timeRemaining: number;
  scores: Record<string, number>;
  answerResult: { correct: boolean; correctAnswer: number; score: number } | null;
  onSubmitAnswer: (answerIndex: number) => void;
  onGameEnd: () => void;
}

export default function GameScreen({
  playerName,
  players,
  currentQuestion,
  timeRemaining,
  scores,
  answerResult,
  onSubmitAnswer,
  onGameEnd
}: GameScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (answerResult) {
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setHasAnswered(false);
        setSelectedAnswer(null);
      }, 3000);
    }
  }, [answerResult]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    onSubmitAnswer(answerIndex);
  };

  const sortedPlayers = players.sort((a, b) => (scores[b.playerId] || 0) - (scores[a.playerId] || 0));

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <p className="text-lg">في انتظار السؤال التالي...</p>
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
                  <p className="text-gray-600 mb-4">+{answerResult.score} نقطة</p>
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
          {/* Current Player */}
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <span className="text-sm opacity-80">اللاعب الحالي</span>
              <div className="font-bold text-lg">{playerName}</div>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            <Timer timeRemaining={timeRemaining} />
          </div>

          {/* Round Info */}
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <span className="text-sm opacity-80">السؤال</span>
              <div className="font-bold text-lg">
                {currentQuestion.id} / 15
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Section */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Question Card */}
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

            {/* Answer Options */}
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

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">التقدم</span>
              <span className="text-sm font-medium text-[#2F4F4F]">
                {Math.round((currentQuestion.id / 15) * 100)}%
              </span>
            </div>
            <Progress value={(currentQuestion.id / 15) * 100} className="h-3" />
          </CardContent>
        </Card>
      </div>

      {/* Players Sidebar */}
      <div className="fixed bottom-0 left-0 right-0 md:fixed md:top-0 md:left-0 md:bottom-0 md:w-80 bg-white shadow-lg border-t md:border-r md:border-t-0 p-4 overflow-y-auto">
        <h4 className="font-bold text-[#2F4F4F] mb-4 text-center md:text-right">
          النتائج الحالية
        </h4>
        
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const playerScore = scores[player.playerId] || 0;
            const isCurrentPlayer = player.playerName === playerName;
            
            return (
              <div 
                key={player.playerId}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  isCurrentPlayer ? 'bg-[#228B22] text-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-[#FFD700] text-white' : 
                    index === 1 ? 'bg-gray-400 text-white' : 
                    'bg-gray-300 text-gray-700'
                  }`}>
                    <span>{playerScore}</span>
                  </div>
                  <div className="mr-3">
                    <div className={`font-medium ${isCurrentPlayer ? 'text-white' : 'text-[#2F4F4F]'}`}>
                      {player.playerName}
                    </div>
                    <div className={`text-sm ${isCurrentPlayer ? 'text-white opacity-80' : 'text-gray-500'}`}>
                      {index === 0 ? 'المركز الأول' : 
                       index === 1 ? 'المركز الثاني' : 
                       `المركز ${index + 1}`}
                    </div>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-[#32CD32]' : 'bg-gray-400'
                }`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
