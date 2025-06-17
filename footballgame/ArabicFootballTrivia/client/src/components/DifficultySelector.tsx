import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Trophy, Star } from "lucide-react";

interface DifficultySelectorProps {
  onDifficultySelect: (difficulty: string, mode: string) => void;
  onBack: () => void;
}

export default function DifficultySelector({ onDifficultySelect, onBack }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [selectedMode, setSelectedMode] = useState("classic");

  const difficulties = [
    {
      id: "easy",
      name: "مبتدئ",
      description: "أسئلة سهلة ووقت أطول",
      time: "45 ثانية",
      questions: "10 أسئلة",
      icon: Star,
      color: "bg-green-500",
      textColor: "text-green-700"
    },
    {
      id: "medium", 
      name: "متوسط",
      description: "أسئلة متوسطة ووقت عادي",
      time: "30 ثانية",
      questions: "15 سؤال",
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-700"
    },
    {
      id: "hard",
      name: "خبير",
      description: "أسئلة صعبة ووقت قليل",
      time: "20 ثانية",
      questions: "20 سؤال",
      icon: Trophy,
      color: "bg-red-500",
      textColor: "text-red-700"
    }
  ];

  const modes = [
    {
      id: "classic",
      name: "كلاسيكي",
      description: "سؤال واحد في كل مرة",
      icon: Clock,
      color: "bg-blue-500"
    },
    {
      id: "speedrun",
      name: "سرعة",
      description: "أكبر عدد من الأسئلة في دقيقتين",
      icon: Zap,
      color: "bg-purple-500"
    },
    {
      id: "survival",
      name: "البقاء",
      description: "استمر بأطول فترة ممكنة",
      icon: Trophy,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#228B22] to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#2F4F4F] mb-2">اختر المستوى</h1>
            <p className="text-gray-600 text-lg">حدد مستوى الصعوبة ونمط اللعب</p>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4 text-center">مستوى الصعوبة</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {difficulties.map((difficulty) => {
                const Icon = difficulty.icon;
                const isSelected = selectedDifficulty === difficulty.id;
                
                return (
                  <Card 
                    key={difficulty.id}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isSelected ? 'ring-4 ring-[#228B22] shadow-lg' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${difficulty.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-[#2F4F4F] mb-2">{difficulty.name}</h4>
                      <p className="text-gray-600 text-sm mb-4">{difficulty.description}</p>
                      <div className="space-y-2">
                        <Badge variant="outline" className={difficulty.textColor}>
                          ⏱️ {difficulty.time}
                        </Badge>
                        <Badge variant="outline" className={difficulty.textColor}>
                          📝 {difficulty.questions}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4 text-center">نمط اللعب</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {modes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                
                return (
                  <Card 
                    key={mode.id}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isSelected ? 'ring-4 ring-[#FFD700] shadow-lg' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${mode.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-[#2F4F4F] mb-2">{mode.name}</h4>
                      <p className="text-gray-600 text-sm">{mode.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={onBack}
              variant="outline"
              className="px-8 py-3 rounded-xl font-bold"
            >
              العودة
            </Button>
            <Button
              onClick={() => onDifficultySelect(selectedDifficulty, selectedMode)}
              className="bg-[#228B22] hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold"
            >
              ابدأ اللعب
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}