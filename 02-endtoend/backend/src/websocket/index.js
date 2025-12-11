import { MessageService } from '../services/index.js';

const activeInterviews = new Map();

export const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join interview room
    socket.on('join-interview', (data) => {
      const { interviewId, userId } = data;
      const room = `interview-${interviewId}`;
      
      socket.join(room);
      activeInterviews.set(socket.id, { interviewId, userId });
      
      io.to(room).emit('user-joined', {
        userId,
        socketId: socket.id,
        timestamp: new Date(),
      });
    });

    // Code update (shared editor)
    socket.on('code-update', async (data) => {
      const { interviewId, code, userId } = data;
      const room = `interview-${interviewId}`;
      
      // Broadcast to all users in interview except sender
      socket.to(room).emit('code-updated', {
        code,
        userId,
        timestamp: new Date(),
      });

      // Save message to database
      try {
        await MessageService.createMessage({
          interviewId,
          senderId: userId,
          content: code,
          messageType: 'code_update',
        });
      } catch (error) {
        console.error('Error saving code update:', error);
      }
    });

    // Chat message
    socket.on('chat-message', async (data) => {
      const { interviewId, message, userId } = data;
      const room = `interview-${interviewId}`;
      
      // Broadcast to all users in interview
      io.to(room).emit('new-chat-message', {
        message,
        userId,
        timestamp: new Date(),
      });

      // Save message to database
      try {
        await MessageService.createMessage({
          interviewId,
          senderId: userId,
          content: message,
          messageType: 'chat',
        });
      } catch (error) {
        console.error('Error saving chat message:', error);
      }
    });

    // Test execution result
    socket.on('test-result', (data) => {
      const { interviewId, result, userId } = data;
      const room = `interview-${interviewId}`;
      
      io.to(room).emit('test-result-update', {
        result,
        userId,
        timestamp: new Date(),
      });
    });

    // Cursor position for awareness
    socket.on('cursor-move', (data) => {
      const { interviewId, userId, line, column } = data;
      const room = `interview-${interviewId}`;
      
      socket.to(room).emit('cursor-updated', {
        userId,
        line,
        column,
      });
    });

    // Leave interview
    socket.on('leave-interview', (data) => {
      const { interviewId, userId } = data;
      const room = `interview-${interviewId}`;
      
      socket.leave(room);
      activeInterviews.delete(socket.id);
      
      io.to(room).emit('user-left', {
        userId,
        timestamp: new Date(),
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      const interviewData = activeInterviews.get(socket.id);
      if (interviewData) {
        const { interviewId, userId } = interviewData;
        const room = `interview-${interviewId}`;
        io.to(room).emit('user-left', {
          userId,
          timestamp: new Date(),
        });
        activeInterviews.delete(socket.id);
      }
      console.log('User disconnected:', socket.id);
    });
  });
};

export default setupWebSocket;
