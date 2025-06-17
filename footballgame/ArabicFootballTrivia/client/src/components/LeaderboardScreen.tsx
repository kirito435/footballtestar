import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Clock, Home, RotateCcw } from "lucide-react";

interface PlayerStats {
  name: string;
  totalGames: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  favoriteCategory: string;
  totalTime: number;
  rank: number;
}

interface LeaderboardScreenProps {
  playerName: string;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export default function LeaderboardScreen({ playerName, onPlayAgain, onNewGame }: LeaderboardScreenProps) {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<PlayerStats[]>([]);
  const [timeframe, setTimeframe] = useState<"today" | "week" | "all">("today");

  useEffect(() => {
    // Load player stats from localStorage
    loadPlayerStats();
    generateGlobalLeaderboard();
  }, []);

  const loadPlayerStats = () => {
    const savedStats = localStorage.getItem(`footballTrivia_${playerName}`);
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    } else {
      // Initialize new player stats
      const newStats: PlayerStats = {
        name: playerName,
        totalGames: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        accuracy: 0,
        favoriteCategory: "كأس العالم",
        totalTime: 0,
        rank: 0
      };
      setPlayerStats(newStats);
    }
  };

  const generateGlobalLeaderboard = () => {
    // Generate sample leaderboard data
    const samplePlayers: PlayerStats[] = [
      {
        name: "أحمد محمد",
        totalGames: 156,
        totalScore: 2340,
        averageScore: 15.0,
        bestScore: 45,
        correctAnswers: 1200,
        totalQuestions: 1560,
        accuracy: 76.9,
        favoriteCategory: "اللاعبين",
        totalTime: 4680,
        rank: 1
      },
      {
        name: "سارة أحمد",
        totalGames: 143,
        totalScore: 2156,
        averageScore: 15.1,
        bestScore: 42,
        correctAnswers: 1144,
        totalQuestions: 1430,
        accuracy: 80.0,
        favoriteCategory: "كأس العالم",
        totalTime: 4290,
        rank: 2
      },
      {
        name: "محمد علي",
        totalGames: 134,
        totalScore: 2010,
        averageScore: 15.0,
        bestScore: 38,
        correctAnswers: 1005,
        totalQuestions: 1340,
        accuracy: 75.0,
        favoriteCategory: "الأندية",
        totalTime: 4020,
        rank: 3
      },
      {
        name: "فاطمة خالد",
        totalGames: 128,
        totalScore: 1920,
        averageScore: 15.0,
        bestScore: 40,
        correctAnswers: 960,
        totalQuestions: 1280,
        accuracy: 75.0,
        favoriteCategory: "المنتخبات العربية",
        totalTime: 3840,
        rank: 4
      },
      {
        name: "عمر حسن",
        totalGames: 119,
        totalScore: 1785,
        averageScore: 15.0,
        bestScore: 35,
        correctAnswers: 892,
        totalQuestions: 1190,
        accuracy: 75.0,
        favoriteCategory: "المدربين",
        totalTime: 3570,
        rank: 5
      },
      // Add current player if they have stats
      ...(playerStats ? [{
        ...playerStats,
        rank: 6
      }] : [])
    ];

    setGlobalLeaderboard(samplePlayers);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-orange-400";
    return "bg-blue-500";
  };

  if (!playerStats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <p className="text-lg">جاري تحميل الإحصائيات...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">لوحة المتصدرين</h1>
                <p className="opacity-80">تابع تقدمك وتنافس مع الآخرين</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {["today", "week", "all"].map((period) => (
                <Button
                  key={period}
                  onClick={() => setTimeframe(period as any)}
                  variant={timeframe === period ? "default" : "outline"}
                  className={timeframe === period ? "bg-white text-purple-600" : "text-white border-white"}
                >
                  {period === "today" ? "اليوم" : period === "week" ? "هذا الأسبوع" : "كل الأوقات"}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Player Statistics */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#228B22] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {playerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2F4F4F]">{playerName}</h3>
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(playerStats.rank)}`}>
                      {playerStats.rank}
                    </div>
                    <span className="text-lg font-bold text-[#FFD700]">{getRankBadge(playerStats.rank)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-sm text-gray-600">أفضل نتيجة</span>
                    </div>
                    <span className="font-bold text-[#228B22]">{playerStats.bestScore}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-600">نسبة الدقة</span>
                    </div>
                    <span className="font-bold text-blue-600">{playerStats.accuracy.toFixed(1)}%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-purple-500" />
                      <span className="text-sm text-gray-600">إجمالي الألعاب</span>
                    </div>
                    <span className="font-bold text-purple-600">{playerStats.totalGames}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-gray-600">الفئة المفضلة</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">
                      {playerStats.favoriteCategory}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-bold text-[#2F4F4F] mb-4">إجراءات سريعة</h4>
                <div className="space-y-3">
                  <Button
                    onClick={onPlayAgain}
                    className="w-full bg-[#228B22] hover:bg-green-700 text-white"
                  >
                    <RotateCcw className="w-5 h-5 ml-2" />
                    العب مرة أخرى
                  </Button>
                  <Button
                    onClick={onNewGame}
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="w-5 h-5 ml-2" />
                    القائمة الرئيسية
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Leaderboard */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#2F4F4F] mb-6">المتصدرون العالميون</h3>
                
                <div className="space-y-3">
                  {globalLeaderboard.slice(0, 10).map((player, index) => {
                    const isCurrentPlayer = player.name === playerName;
                    
                    return (
                      <div 
                        key={player.name}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                          isCurrentPlayer 
                            ? 'bg-[#228B22] text-white shadow-lg scale-105' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-[#FFD700]' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-orange-400' : 
                            isCurrentPlayer ? 'bg-white bg-opacity-20' : 'bg-blue-500'
                          }`}>
                            {index < 3 ? getRankBadge(index + 1) : index + 1}
                          </div>
                          
                          <div>
                            <div className={`font-bold text-lg ${isCurrentPlayer ? 'text-white' : 'text-[#2F4F4F]'}`}>
                              {player.name}
                              {isCurrentPlayer && (
                                <Badge className="mr-2 bg-white bg-opacity-20 text-white">
                                  أنت
                                </Badge>
                              )}
                            </div>
                            <div className={`text-sm ${isCurrentPlayer ? 'text-white opacity-80' : 'text-gray-500'}`}>
                              {player.totalGames} لعبة • دقة {player.accuracy.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${isCurrentPlayer ? 'text-white' : 'text-[#228B22]'}`}>
                            {player.totalScore}
                          </div>
                          <div className={`text-sm ${isCurrentPlayer ? 'text-white opacity-80' : 'text-gray-500'}`}>
                            نقطة
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {globalLeaderboard.length > 10 && (
                  <div className="text-center mt-6">
                    <Button variant="outline" className="px-6">
                      عرض المزيد
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}