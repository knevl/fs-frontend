import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { ApiService } from '../services/api';

export function useGameSocket({
  onTimeUpdate,
  onBalanceUpdate,
  onLobbyUpdate,
  onGameStart,
  onGameOver,
  onSessionClosed,
}) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const pathname = window.location.pathname;
    const isRelevant =
      pathname.startsWith('/game/') ||
      pathname.startsWith('/player-lobby/') ||
      pathname.startsWith('/creator-lobby/');

    if (!isRelevant) return;

    const fetchAndConnect = async () => {
      try {
        const playerData = await ApiService.get('player');
        const { id: playerId, gameSessionId: sessionId } = playerData;

        const socket = io('http://localhost:3000', {
          query: { playerId, sessionId },
        });

        socket.emit('joinGameRoom', { sessionId });

        if (onLobbyUpdate) socket.on('lobbyUpdate', onLobbyUpdate);
        if (onTimeUpdate) socket.on('timeUpdate', onTimeUpdate);
        if (onBalanceUpdate) socket.on('balanceUpdate', onBalanceUpdate);
        if (onGameStart) socket.on('gameStarted', onGameStart);
        if (onGameOver) socket.on('gameOver', onGameOver);
        if (onSessionClosed) socket.on('sessionClosed', onSessionClosed);


        return () => {
          socket.disconnect();
        };
      } catch (err) {
        console.error('Ошибка получения данных игрока (в useGameSocket):', err);
      }
    };

    fetchAndConnect();
  }, [
    onTimeUpdate,
    onBalanceUpdate,
    onLobbyUpdate,
    onGameStart,
    onGameOver,
    onSessionClosed,
  ]);
}
