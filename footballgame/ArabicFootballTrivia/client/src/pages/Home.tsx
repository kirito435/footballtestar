import { useState } from "react";
import GameLobby from "@/components/GameLobby";
import GameScreen from "@/components/GameScreen";
import ResultsScreen from "@/components/ResultsScreen";
import SinglePlayerGame from "@/components/SinglePlayerGame";
import { useWebSocket } from "@/hooks/useWebSocket";

type GameState = "lobby" | "game" | "results" | "single";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("lobby");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  
  const { 
    ws, 
    isConnected, 
    players, 
    currentQuestion, 
    timeRemaining, 
    scores, 
    gameStarted,
    gameEnded,
    winner,
    answerResult,
    joinRoom,
    submitAnswer 
  } = useWebSocket();

  const handleStartGame = (name: string, room: string) => {
    setPlayerName(name);
    setRoomCode(room);
    
    // Check if it's single player mode
    if (room.startsWith("SINGLE_")) {
      setGameState("single");
    } else {
      joinRoom(room, name);
    }
  };

  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
  };

  // Auto-transition to game when game starts
  if (gameStarted && gameState === "lobby") {
    setGameState("game");
  }

  // Auto-transition to results when game ends
  if (gameEnded && gameState === "game") {
    setGameState("results");
  }

  return (
    <div className="min-h-screen bg-gray-100 font-arabic rtl">
      {gameState === "lobby" && (
        <GameLobby 
          onStartGame={handleStartGame}
          isConnected={isConnected}
        />
      )}
      
      {gameState === "game" && (
        <GameScreen 
          playerName={playerName}
          players={players}
          currentQuestion={currentQuestion}
          timeRemaining={timeRemaining}
          scores={scores}
          answerResult={answerResult}
          onSubmitAnswer={submitAnswer}
          onGameEnd={() => handleGameStateChange("results")}
        />
      )}
      
      {gameState === "single" && (
        <SinglePlayerGame 
          playerName={playerName}
          onGameEnd={() => handleGameStateChange("results")}
          onNewGame={() => {
            setPlayerName("");
            setRoomCode("");
            handleGameStateChange("lobby");
          }}
        />
      )}
      
      {gameState === "results" && (
        <ResultsScreen 
          scores={scores}
          winner={winner}
          onPlayAgain={() => handleGameStateChange("lobby")}
          onNewGame={() => {
            setPlayerName("");
            setRoomCode("");
            handleGameStateChange("lobby");
          }}
        />
      )}
    </div>
  );
}
