import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Play, Zap, Plus, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface GameLobbyProps {
  onStartGame: (playerName: string, roomCode: string) => void;
  isConnected: boolean;
}

export default function GameLobby({ onStartGame, isConnected }: GameLobbyProps) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [gameMode, setGameMode] = useState<"individual" | "team">("individual");
  const [questionMode, setQuestionMode] = useState<"single" | "rapidfire">("single");
  const [playerCount, setPlayerCount] = useState(2);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [gameType, setGameType] = useState<"create" | "join" | "single">("create");

  const createNewRoom = async () => {
    setIsCreatingRoom(true);
    try {
      const response = await fetch("/api/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const room = await response.json();
      setRoomCode(room.roomCode);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
    setIsCreatingRoom(false);
  };

  const handleStartGame = () => {
    if (!playerName.trim()) return;
    
    if (gameType === "single") {
      // Start single player mode
      onStartGame(playerName, "SINGLE_" + Math.random().toString(36).substr(2, 6));
    } else if (gameType === "create") {
      if (!roomCode) {
        createNewRoom().then(() => {
          onStartGame(playerName, roomCode);
        });
      } else {
        onStartGame(playerName, roomCode);
      }
    } else {
      // Join existing room
      if (!roomCode.trim()) return;
      onStartGame(playerName, roomCode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#228B22] to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {/* Game Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#228B22] rounded-full mb-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-[#2F4F4F] mb-2">تريفيا كرة القدم</h1>
            <p className="text-gray-600 text-lg">اختبر معرفتك في كرة القدم العربية والعالمية</p>
          </div>

          {/* Connection Status */}
          <div className="mb-6 text-center">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "متصل" : "غير متصل"}
            </Badge>
          </div>

          {/* Game Type Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#2F4F4F] mb-4 text-center">اختر نوع اللعبة</h3>
            <div className="grid grid-cols-3 gap-3">
              <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                gameType === "single" ? 'ring-4 ring-[#FFD700] shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setGameType("single")}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#2F4F4F] mb-2">لاعب واحد</h4>
                  <p className="text-gray-600 text-sm">تحدي نفسك مع أسئلة متنوعة</p>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                gameType === "create" ? 'ring-4 ring-[#228B22] shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setGameType("create")}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-[#228B22] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#2F4F4F] mb-2">إنشاء غرفة</h4>
                  <p className="text-gray-600 text-sm">العب مع الأصدقاء في غرفة جديدة</p>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                gameType === "join" ? 'ring-4 ring-[#228B22] shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setGameType("join")}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#2F4F4F] mb-2">انضمام لغرفة</h4>
                  <p className="text-gray-600 text-sm">انضم لغرفة موجودة بالكود</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Player Setup */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-[#2F4F4F] mb-4">إعداد اللاعبين</h3>
            
            {/* Player Name */}
            <div className="mb-4">
              <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                اسم اللاعب
              </label>
              <Input
                type="text"
                placeholder="أدخل اسمك"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-right"
              />
            </div>

            {/* Room Code - Only show for join or create modes */}
            {gameType !== "single" && (
              <div className="mb-4">
                <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                  {gameType === "create" ? "كود الغرفة (سيتم إنشاؤه تلقائياً)" : "كود الغرفة"}
                </label>
                {gameType === "create" ? (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="سيتم إنشاء الكود تلقائياً"
                      value={roomCode}
                      disabled
                      className="text-right bg-gray-100"
                    />
                    <Button
                      onClick={createNewRoom}
                      variant="outline"
                      disabled={isCreatingRoom}
                      className="whitespace-nowrap"
                    >
                      {isCreatingRoom ? "جاري الإنشاء..." : "إنشاء غرفة"}
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="text"
                    placeholder="أدخل كود الغرفة"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="text-right"
                  />
                )}
              </div>
            )}

            {/* Player Count */}
            <div className="mb-4">
              <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                عدد اللاعبين
              </label>
              <div className="flex justify-center gap-3">
                {[2, 3, 4, 5].map((count) => (
                  <Button
                    key={count}
                    onClick={() => setPlayerCount(count)}
                    variant={playerCount === count ? "default" : "outline"}
                    className="px-4 py-2"
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            {/* Game Mode Selection */}
            <div className="mb-4">
              <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                نمط اللعب
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setGameMode("individual")}
                  variant={gameMode === "individual" ? "default" : "outline"}
                  className="p-4 h-auto flex-col gap-2"
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm">فردي</span>
                </Button>
                <Button
                  onClick={() => setGameMode("team")}
                  variant={gameMode === "team" ? "default" : "outline"}
                  className="p-4 h-auto flex-col gap-2"
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm">فرق</span>
                </Button>
              </div>
            </div>

            {/* Question Mode Selection */}
            <div className="mb-4">
              <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                نوع الأسئلة
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setQuestionMode("single")}
                  variant={questionMode === "single" ? "default" : "outline"}
                  className="p-4 h-auto flex-col gap-2"
                >
                  <Play className="w-6 h-6" />
                  <span className="text-sm">سؤال واحد</span>
                </Button>
                <Button
                  onClick={() => setQuestionMode("rapidfire")}
                  variant={questionMode === "rapidfire" ? "default" : "outline"}
                  className="p-4 h-auto flex-col gap-2"
                >
                  <Zap className="w-6 h-6" />
                  <span className="text-sm">أسئلة سريعة</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Start Game Button */}
          <Button
            onClick={handleStartGame}
            disabled={!playerName.trim() || (gameType !== "single" && !roomCode.trim()) || !isConnected}
            className="w-full bg-[#228B22] hover:bg-green-700 text-white px-8 py-4 text-xl font-bold rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Play className="w-6 h-6 ml-2" />
            {gameType === "single" ? "ابدأ اللعب" : gameType === "create" ? "إنشاء وبدء اللعبة" : "الانضمام للعبة"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
