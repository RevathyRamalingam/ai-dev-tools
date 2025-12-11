import { io } from 'socket.io-client';
import { useWebSocketStore } from '../store/index.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    autoConnect: false,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    useWebSocketStore.setState({ isConnected: true });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    useWebSocketStore.setState({ isConnected: false });
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    initializeSocket();
  }
  return socket;
};

export const joinInterview = (interviewId, userId) => {
  const socket = getSocket();
  socket.connect();
  socket.emit('join-interview', { interviewId, userId });
};

export const leaveInterview = (interviewId, userId) => {
  const socket = getSocket();
  socket.emit('leave-interview', { interviewId, userId });
  socket.disconnect();
};

export const updateCode = (interviewId, code, userId) => {
  const socket = getSocket();
  socket.emit('code-update', { interviewId, code, userId });
};

export const sendMessage = (interviewId, message, userId) => {
  const socket = getSocket();
  socket.emit('chat-message', { interviewId, message, userId });
};

export const sendTestResult = (interviewId, result, userId) => {
  const socket = getSocket();
  socket.emit('test-result', { interviewId, result, userId });
};

export const updateCursor = (interviewId, userId, line, column) => {
  const socket = getSocket();
  socket.emit('cursor-move', { interviewId, userId, line, column });
};

export const onCodeUpdate = (callback) => {
  const socket = getSocket();
  socket.on('code-updated', callback);
};

export const onNewMessage = (callback) => {
  const socket = getSocket();
  socket.on('new-chat-message', callback);
};

export const onUserJoined = (callback) => {
  const socket = getSocket();
  socket.on('user-joined', callback);
};

export const onUserLeft = (callback) => {
  const socket = getSocket();
  socket.on('user-left', callback);
};

export const onTestResult = (callback) => {
  const socket = getSocket();
  socket.on('test-result-update', callback);
};

export const onCursorUpdate = (callback) => {
  const socket = getSocket();
  socket.on('cursor-updated', callback);
};

export default {
  initializeSocket,
  getSocket,
  joinInterview,
  leaveInterview,
  updateCode,
  sendMessage,
  sendTestResult,
  updateCursor,
  onCodeUpdate,
  onNewMessage,
  onUserJoined,
  onUserLeft,
  onTestResult,
  onCursorUpdate,
};
