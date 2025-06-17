import { useState, useEffect, useCallback } from "react";
import type { WebSocketMessage, GamePlayer, Question } from "@shared/schema";

export function useWebSocket() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState("");
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; correctAnswer: number; score: number } | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setWs(socket);
    };
    
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      setWs(null);
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
    
    socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    return () => {
      socket.close();
    };
  }, []);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case "player_joined":
        setPlayers(prev => [...prev.filter(p => p.playerId !== message.payload.player.playerId), message.payload.player]);
        break;
      case "game_started":
        setGameStarted(true);
        break;
      case "question_presented":
        setCurrentQuestion(message.payload.question);
        setTimeRemaining(message.payload.timeLimit);
        setAnswerResult(null);
        break;
      case "timer_update":
        setTimeRemaining(message.payload.timeRemaining);
        break;
      case "answer_result":
        setAnswerResult({
          correct: message.payload.correct,
          correctAnswer: message.payload.correctAnswer,
          score: message.payload.score
        });
        break;
      case "round_ended":
        setScores(message.payload.scores);
        break;
      case "game_ended":
        setGameEnded(true);
        setScores(message.payload.finalScores);
        setWinner(message.payload.winner);
        break;
      case "error":
        console.error("WebSocket error:", message.payload.message);
        break;
    }
  };

  const joinRoom = useCallback((roomCode: string, playerName: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: "join_room",
        payload: { roomCode, playerName }
      };
      ws.send(JSON.stringify(message));
    }
  }, [ws]);

  const submitAnswer = useCallback((answerIndex: number) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: "answer_submitted",
        payload: { 
          playerId: "", // This will be set by the server
          answerIndex, 
          timeRemaining 
        }
      };
      ws.send(JSON.stringify(message));
    }
  }, [ws, timeRemaining]);

  return {
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
  };
}
