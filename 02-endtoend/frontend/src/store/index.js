import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: { id: 1, email: 'test@example.com', name: 'Test User' },
  token: 'test-token-12345',
  isAuthenticated: true,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

export const useInterviewStore = create((set) => ({
  currentInterview: null,
  interviews: [],
  
  setCurrentInterview: (interview) => set({ currentInterview: interview }),
  setInterviews: (interviews) => set({ interviews }),
  addInterview: (interview) => set((state) => ({
    interviews: [...state.interviews, interview],
  })),
  updateInterview: (id, updates) => set((state) => ({
    interviews: state.interviews.map((i) => i.id === id ? { ...i, ...updates } : i),
    currentInterview: state.currentInterview?.id === id 
      ? { ...state.currentInterview, ...updates }
      : state.currentInterview,
  })),
}));

export const useEditorStore = create((set) => ({
  code: '',
  language: 'python',
  output: '',
  isExecuting: false,
  
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setOutput: (output) => set({ output }),
  setIsExecuting: (isExecuting) => set({ isExecuting }),
}));

export const useWebSocketStore = create((set) => ({
  socket: null,
  isConnected: false,
  messages: [],
  users: [],
  
  setSocket: (socket) => set({ socket }),
  setIsConnected: (isConnected) => set({ isConnected }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  setUsers: (users) => set({ users }),
  clearMessages: () => set({ messages: [] }),
}));
