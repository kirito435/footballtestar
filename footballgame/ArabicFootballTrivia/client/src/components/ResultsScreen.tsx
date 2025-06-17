import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Home } from "lucide-react";

interface ResultsScreenProps {
  scores: Record<string, number>;
  winner: string;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export default function ResultsScreen({ 
  scores, 
  winner, 
  onPlayAgain, 
  onNewGame 
}: ResultsScreenProps) {
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD700] to-yellow-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          {/* Winner Celebration */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#FFD700] rounded-full mb-4 animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-[#2F4F4F] mb-2">تهانينا!</h2>
            <div className="text-2xl font-bold text-[#228B22] mb-2">{winner}</div>
            <p className="text-gray-600">الفائز بلقب خبير كرة القدم</p>
          </div>

          {/* Final Scores */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-[#2F4F4F] mb-4">النتائج النهائية</h3>
            
            <div className="space-y-3">
              {sortedScores.map(([playerId, score], index) => {
                const medals = ["🥇", "🥈", "🥉"];
                const bgColors = ["bg-[#FFD700]", "bg-gray-400", "bg-orange-400"];
                const positions = ["الأول", "الثاني", "الثالث"];
                
                return (
                  <div key={playerId} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        bgColors[index] || "bg-gray-300"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="mr-3">
                        <div className="font-bold text-[#2F4F4F] flex items-center gap-2">
                          {medals[index] && <span className="text-lg">{medals[index]}</span>}
                          {playerId}
                        </div>
                        <div className="text-sm text-gray-500">
                          المركز {positions[index] || `${index + 1}`}
                        </div>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${
                      index === 0 ? 'text-[#228B22]' : 'text-gray-600'
                    }`}>
                      {score}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={onPlayAgain}
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
              لعبة جديدة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
