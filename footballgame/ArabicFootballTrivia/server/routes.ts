import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertGameRoomSchema, insertGamePlayerSchema, type WebSocketMessage } from "@shared/schema";
import { z } from "zod";

interface ExtendedWebSocket extends WebSocket {
  playerId?: string;
  roomCode?: string;
}

interface GameState {
  currentQuestion?: any;
  questionStartTime?: number;
  timeLimit: number;
  answers: Map<string, { answerIndex: number; timeRemaining: number }>;
  usedQuestions: number[];
}

const gameStates = new Map<string, GameState>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // REST API Routes
  app.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertGameRoomSchema.parse(req.body);
      const room = await storage.createGameRoom(roomData);
      res.json(room);
    } catch (error) {
      res.status(400).json({ error: "Invalid room data" });
    }
  });

  app.post("/api/rooms/create", async (req, res) => {
    try {
      const roomCode = generateRoomCode();
      const roomData = {
        roomCode,
        hostId: 1,
        gameMode: "individual",
        questionMode: "single",
        maxPlayers: 4,
        totalRounds: 10
      };
      const room = await storage.createGameRoom(roomData);
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Failed to create room" });
    }
  });

  app.get("/api/rooms/:roomCode", async (req, res) => {
    try {
      const room = await storage.getGameRoom(req.params.roomCode);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/rooms/:roomCode/players", async (req, res) => {
    try {
      const room = await storage.getGameRoom(req.params.roomCode);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      const players = await storage.getPlayersInRoom(room.id);
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // WebSocket Server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: ExtendedWebSocket) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        await handleWebSocketMessage(ws, message);
      } catch (error) {
        console.error('WebSocket message error:', error);
        sendMessage(ws, { type: "error", payload: { message: "Invalid message format" } });
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      if (ws.playerId && ws.roomCode) {
        handlePlayerDisconnect(ws.playerId, ws.roomCode);
      }
    });
  });

  async function handleWebSocketMessage(ws: ExtendedWebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case "join_room":
        await handleJoinRoom(ws, message.payload);
        break;
      case "answer_submitted":
        await handleAnswerSubmitted(ws, message.payload);
        break;
      default:
        sendMessage(ws, { type: "error", payload: { message: "Unknown message type" } });
    }
  }

  async function handleJoinRoom(ws: ExtendedWebSocket, payload: { roomCode: string; playerName: string }) {
    try {
      const room = await storage.getGameRoom(payload.roomCode);
      if (!room) {
        sendMessage(ws, { type: "error", payload: { message: "Room not found" } });
        return;
      }

      const playerId = generatePlayerId();
      const player = await storage.addPlayerToRoom({
        roomId: room.id,
        playerId,
        playerName: payload.playerName,
      });

      ws.playerId = playerId;
      ws.roomCode = payload.roomCode;

      // Notify all players in the room
      broadcastToRoom(payload.roomCode, {
        type: "player_joined",
        payload: { player }
      });

      // Initialize game state if not exists
      if (!gameStates.has(payload.roomCode)) {
        gameStates.set(payload.roomCode, {
          timeLimit: 30,
          answers: new Map(),
          usedQuestions: []
        });
      }

      // Auto-start game when enough players join
      const players = await storage.getPlayersInRoom(room.id);
      if (players.length >= 2) {
        console.log(`Starting game with ${players.length} players in room ${payload.roomCode}`);
        setTimeout(() => startGame(payload.roomCode), 3000);
      }

    } catch (error) {
      console.error('Join room error:', error);
      sendMessage(ws, { type: "error", payload: { message: "Failed to join room" } });
    }
  }

  async function handleAnswerSubmitted(ws: ExtendedWebSocket, payload: { playerId: string; answerIndex: number; timeRemaining: number }) {
    if (!ws.roomCode || !ws.playerId) return;

    const gameState = gameStates.get(ws.roomCode);
    if (!gameState || !gameState.currentQuestion) return;

    // Record the answer
    gameState.answers.set(ws.playerId, {
      answerIndex: payload.answerIndex,
      timeRemaining: payload.timeRemaining
    });

    const isCorrect = payload.answerIndex === gameState.currentQuestion.correctAnswer;
    const points = isCorrect ? Math.max(1, Math.floor(payload.timeRemaining / 3)) : 0;

    // Update player score
    const room = await storage.getGameRoom(ws.roomCode);
    if (room) {
      const player = await storage.updatePlayerScore(ws.playerId, room.id, points);
      if (player) {
        // Send answer result to the player
        sendMessage(ws, {
          type: "answer_result",
          payload: {
            playerId: ws.playerId,
            correct: isCorrect,
            correctAnswer: gameState.currentQuestion.correctAnswer,
            score: player.score
          }
        });

        // Check if all players have answered
        const players = await storage.getPlayersInRoom(room.id);
        if (gameState.answers.size >= players.length) {
          setTimeout(() => endRound(ws.roomCode!), 2000);
        }
      }
    }
  }

  async function startGame(roomCode: string) {
    const room = await storage.getGameRoom(roomCode);
    if (!room) return;

    broadcastToRoom(roomCode, {
      type: "game_started",
      payload: { roomId: room.id }
    });

    // Present first question
    setTimeout(() => presentQuestion(roomCode), 1000);
  }

  async function presentQuestion(roomCode: string) {
    const gameState = gameStates.get(roomCode);
    if (!gameState) return;

    const question = await storage.getRandomQuestion(gameState.usedQuestions);
    if (!question) {
      endGame(roomCode);
      return;
    }

    gameState.currentQuestion = question;
    gameState.questionStartTime = Date.now();
    gameState.answers.clear();
    gameState.usedQuestions.push(question.id);

    broadcastToRoom(roomCode, {
      type: "question_presented",
      payload: { question, timeLimit: gameState.timeLimit }
    });

    // Start timer
    startQuestionTimer(roomCode);
  }

  function startQuestionTimer(roomCode: string) {
    const gameState = gameStates.get(roomCode);
    if (!gameState) return;

    let timeRemaining = gameState.timeLimit;
    
    const timer = setInterval(() => {
      timeRemaining--;
      
      broadcastToRoom(roomCode, {
        type: "timer_update",
        payload: { timeRemaining }
      });

      if (timeRemaining <= 0) {
        clearInterval(timer);
        endRound(roomCode);
      }
    }, 1000);
  }

  async function endRound(roomCode: string) {
    const room = await storage.getGameRoom(roomCode);
    if (!room) return;

    const players = await storage.getPlayersInRoom(room.id);
    const scores = players.reduce((acc, player) => {
      acc[player.playerId] = player.score;
      return acc;
    }, {} as Record<string, number>);

    const nextRound = room.currentRound < room.totalRounds;
    
    broadcastToRoom(roomCode, {
      type: "round_ended",
      payload: { scores, nextRound }
    });

    if (nextRound) {
      await storage.updateGameRoom(roomCode, { currentRound: room.currentRound + 1 });
      setTimeout(() => presentQuestion(roomCode), 3000);
    } else {
      setTimeout(() => endGame(roomCode), 3000);
    }
  }

  async function endGame(roomCode: string) {
    const room = await storage.getGameRoom(roomCode);
    if (!room) return;

    const players = await storage.getPlayersInRoom(room.id);
    const finalScores = players.reduce((acc, player) => {
      acc[player.playerId] = player.score;
      return acc;
    }, {} as Record<string, number>);

    const winner = players.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );

    broadcastToRoom(roomCode, {
      type: "game_ended",
      payload: { finalScores, winner: winner.playerName }
    });

    // Cleanup
    gameStates.delete(roomCode);
    await storage.deleteGameRoom(roomCode);
  }

  function handlePlayerDisconnect(playerId: string, roomCode: string) {
    // Handle player disconnection
    // Remove player from room and notify others
    console.log(`Player ${playerId} disconnected from room ${roomCode}`);
  }

  function sendMessage(ws: ExtendedWebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  function broadcastToRoom(roomCode: string, message: WebSocketMessage) {
    wss.clients.forEach((client) => {
      const extendedClient = client as ExtendedWebSocket;
      if (extendedClient.roomCode === roomCode && extendedClient.readyState === WebSocket.OPEN) {
        extendedClient.send(JSON.stringify(message));
      }
    });
  }

  function generatePlayerId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  function generateRoomCode(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  return httpServer;
}
