import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { ApiService } from '../services/api';

export function useGameSocket({
  onTimeUpdate,
  onBalanceUpdate,
  onLobbyUpdate,
  onGameStart,
  onGameOver,
  onSessionClosed,
  onPlayerAction,
  onPlayerNotification,
  onNewsNotification,
}) {

  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const pathname = window.location.pathname;
    const isRelevant =
      pathname.startsWith('/game/') ||
      pathname.startsWith('/player-lobby/') ||
      pathname.startsWith('/creator-lobby/');

    if (!isRelevant || socketRef.current) return;

    const fetchAndConnect = async () => {
      try {
        const playerData = await ApiService.get('player');
        const { id: playerId, gameSessionId: sessionId } = playerData;

        const socket = io('http://localhost:3000', {
          query: { playerId, sessionId },
        });

        socketRef.current = socket;

        socket.emit('joinGameRoom', { sessionId });

        socket.off('lobbyUpdate');
        socket.off('timeUpdate');
        socket.off('balanceUpdate');
        socket.off('gameStarted');
        socket.off('gameOver');
        socket.off('sessionClosed');
        socket.off('playerAction');
        socket.off('playerNotification');
        socket.off('newsNotification')

        if (onLobbyUpdate) socket.on('lobbyUpdate', onLobbyUpdate);
        if (onTimeUpdate) socket.on('timeUpdate', onTimeUpdate);
        if (onBalanceUpdate) socket.on('balanceUpdate', onBalanceUpdate);
        if (onGameStart) socket.on('gameStarted', onGameStart);
        if (onGameOver) socket.on('gameOver', onGameOver);
        if (onSessionClosed) socket.on('sessionClosed', onSessionClosed);
        if (onPlayerAction) socket.on('playerAction', onPlayerAction);
        if (onPlayerNotification) socket.on('playerNotification', onPlayerNotification);
        if (onNewsNotification) socket.on('newsNotification', onNewsNotification);
        } catch (err) {
        console.error('Ошибка получения данных игрока (в useGameSocket):', err);
      }
    };

    fetchAndConnect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [
    onTimeUpdate,
    onBalanceUpdate,
    onLobbyUpdate,
    onGameStart,
    onGameOver,
    onSessionClosed,
    onPlayerAction,
    onPlayerNotification,
    onNewsNotification,
  ]);
}
