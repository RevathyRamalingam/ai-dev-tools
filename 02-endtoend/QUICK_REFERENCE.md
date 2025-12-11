# Quick Reference Card

## 🚀 Start Development (Choose One)

### Windows Users
```
Double-click start.bat
```

### Mac/Linux Users
```bash
chmod +x start.sh
./start.sh
```

### All Platforms
```bash
npm run install:all
npm run dev
```

---

## 📍 Service URLs

| Service | URL | What's Running |
|---------|-----|-----------------|
| Frontend | http://localhost:5173 | React + Vite dev server |
| Backend API | http://localhost:5000 | Express.js + Socket.io |

---

## ⌨️ Common Commands

### Full Stack
```bash
npm run install:all      # Install all dependencies (one time)
npm run dev              # Start both services (main command)
npm run build            # Build for production
```

### Backend Only
```bash
npm run dev:backend      # Start backend only
cd backend && npm run dev # Alternative
cd backend && npm test    # Run tests
```

### Frontend Only
```bash
npm run dev:frontend     # Start frontend only
cd frontend && npm run dev # Alternative
cd frontend && npm run build # Build for production
```

### Testing & Quality
```bash
npm test                 # Run all backend tests
npm run test:watch       # Watch mode (re-run on change)
npm run test:coverage    # Coverage report
```

---

## 🛠️ Setup Troubleshooting

### Port Already in Use
```bash
# Find the process
netstat -ano | findstr :5000

# Kill it (Windows)
taskkill /PID <PID> /F
```

### Dependencies Won't Install
```bash
npm cache clean --force
npm run install:all
```

### Still Having Issues?
1. Verify Node.js version: `node --version` (should be 18+)
2. Delete node_modules: `rm -rf node_modules backend/node_modules frontend/node_modules`
3. Try installing again: `npm run install:all`

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `package.json` | Root config with concurrently |
| `start.bat` | Windows startup script |
| `start.sh` | Mac/Linux startup script |
| `GETTING_STARTED.md` | Detailed setup guide |
| `CONCURRENT_SETUP.md` | Full concurrent setup doc |
| `CONCURRENT_ARCHITECTURE.md` | Technical architecture |

---

## 🔌 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_URL=sqlite:./data/database.sqlite
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

---

## 📊 What Gets Installed

```
concurrently (root)
├── backend/
│   ├── express
│   ├── sequelize
│   ├── socket.io
│   ├── jsonwebtoken
│   ├── nodemon (dev)
│   └── jest (testing)
│
└── frontend/
    ├── react
    ├── vite
    ├── monaco-editor
    ├── socket.io-client
    └── zustand
```

---

## 🎯 Typical Development Workflow

1. **First Time**
   ```bash
   npm run install:all
   ```

2. **Start Services**
   ```bash
   npm run dev
   ```

3. **Edit Code**
   - Backend auto-reloads (nodemon)
   - Frontend auto-updates (Vite HMR)

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 💡 Pro Tips

✅ Keep both services in one terminal with `npm run dev`
✅ Use `npm run test:watch` for test-driven development
✅ Frontend HMR is fast—refresh browser to see changes
✅ Check backend console for API errors
✅ Use Chrome DevTools for frontend debugging
✅ Database auto-resets on schema changes in dev mode

---

## 📚 Learn More

- `GETTING_STARTED.md` - Full setup guide
- `CONCURRENT_SETUP.md` - Concurrent development details
- `CONCURRENT_ARCHITECTURE.md` - Technical architecture
- `README.md` - Complete project documentation
- `backend/README.md` - Backend specific details
- `frontend/README.md` - Frontend specific details

---

## ✨ What's New

🎉 **One-Command Startup** - `npm run dev` does everything
🎉 **Both Services Together** - No more managing two terminals
🎉 **Cross-Platform Scripts** - Windows (bat) and Unix (sh) included
🎉 **Auto-Installation** - Dependencies installed automatically
🎉 **Color-Coded Logs** - Easy to distinguish service output

---

**Ready to start?** 

👉 Run: `npm run dev`
👉 Open: http://localhost:5173
