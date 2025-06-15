# The Shifting Economy - Multiplayer Post-Labor Economic Simulation

A real-time multiplayer economic simulation game exploring potential economic outcomes as AI and automation transform the workforce. Players make strategic business decisions while experiencing the transition to a post-labor economy through immersive, AI-generated content.

## 🎮 Game Overview

**The Shifting Economy** is an interactive multiplayer experience where participants run companies in an evolving economic landscape. As players make quarterly decisions about automation, investment, and workforce management, they collectively shape the economic future while learning about post-labor economic scenarios.

### Game Features

- **🔄 Real-time Multiplayer**: Up to 8 players per game session
- **🎯 Three User Roles**: Observer (presenter), Player (participants), Game Master (facilitator)
- **🤖 AI-Generated Content**: Dynamic companies, news events, and opportunities via Google Gemini
- **📊 Live Economic Modeling**: Real-time economic indicators and feedback
- **📱 Mobile-First Design**: Optimized for smartphones and tablets
- **🔗 QR Code Joining**: Easy session access via QR codes

## 🏗️ Technical Architecture

### Backend (Node.js)
- **Express.js**: RESTful API server
- **Socket.IO**: Real-time bidirectional communication
- **Firebase/Firestore**: Game state persistence and scaling
- **Google Gemini AI**: Dynamic content generation
- **Jest**: Comprehensive testing suite

### Frontend (React)
- **React 19**: Modern component-based UI
- **Vite**: Fast development and build tooling
- **Socket.IO Client**: Real-time updates
- **Recharts**: Interactive data visualization
- **React Router**: Client-side routing

### Project Structure
```
postlaborsim/
├── backend/                 # Node.js API server
│   ├── controllers/         # API route handlers
│   ├── services/           # Business logic (Firestore, LLM)
│   ├── simulation/         # Economic modeling engine
│   ├── config/             # Environment and Firebase setup
│   ├── tests/              # Unit test suite
│   └── deploy/             # Deployment configurations
├── frontend/               # React application
│   ├── src/
│   │   ├── views/          # Observer, Player, GM interfaces
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Socket and state management
│   │   └── styles/         # Design system and variables
├── testing/                # End-to-end test suite
├── .github/workflows/      # CI/CD pipelines
└── docs/                   # Additional documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm installed on your system ([Download here](https://nodejs.org/))
- **Git** for cloning the repository
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Google Gemini API key** (optional - the system works in mock mode without it)
- **Firebase project** (optional - uses mock database by default)

### Step-by-Step Installation

#### 1. **Clone and Navigate to Project**
```bash
git clone https://github.com/your-username/postlaborsim.git
cd postlaborsim
```

#### 2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

#### 3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

#### 4. **Configure Environment (Optional)**
The application works out-of-the-box with mock services, but you can configure real services:

**⚠️ Before Starting: Check for Running Processes**
```bash
# Check if anything is using the required ports
lsof -i:3100  # Backend port
lsof -i:5173  # Frontend port

# If processes are found, kill them:
lsof -ti:3100 | xargs kill  # Kill backend processes
lsof -ti:5173 | xargs kill  # Kill frontend processes
```

```bash
# Navigate to backend directory
cd ../backend

# Copy the example environment file
cp .env.example .env

# Edit the .env file with your preferred text editor
# nano .env
# OR
# code .env
```

**Environment Variables Explained:**
```bash
# Server Configuration
PORT=3100                           # Backend server port
NODE_ENV=development                 # Environment mode

# Feature Flags (set to 'true' to enable real services)
USE_REAL_FIRESTORE=false            # Use real Firebase (false = mock mode)
USE_MOCK_LLM=false                  # Use mock AI responses (false = real API)

# Optional: Real Service Configuration
GEMINI_API_KEY=your-api-key         # Google Gemini API key
FIREBASE_PROJECT_ID=your-project-id # Firebase project ID
```

#### 5. **Start the Application**

You need **two terminal windows** running simultaneously:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

**Expected Output:**
```
Using mock Firestore service
Server listening on port 3100
```

**If you get a "Port in use" error:**
```bash
# Error: listen EADDRINUSE: address already in use :::3100

# Solution 1: Kill existing process
lsof -ti:3100 | xargs kill
# Then try npm start again

# Solution 2: Use a different port
PORT=3101 npm start

# Solution 3: Kill all node processes (be careful!)
pkill -f "node"
```

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**If you get a "Port in use" error:**
```bash
# Kill existing Vite processes
pkill -f "vite"
# Then try npm run dev again
```

#### 6. **Access the Application**

Once both servers are running, you can access:

| Component | URL | Purpose |
|-----------|-----|---------|
| **Home Page** | http://localhost:5173 | Main navigation and role selection |
| **Observer View** | http://localhost:5173/observer/[game-id] | Presentation display |
| **Player View** | http://localhost:5173/player/[game-id] | Mobile participant interface |
| **Game Master View** | http://localhost:5173/gm/[game-id] | Facilitator control panel |
| **Backend API** | http://localhost:3100 | REST API endpoints |
| **Health Check** | http://localhost:3100/health | Server status |

**Important Notes:**
- Replace `[game-id]` with actual game ID (e.g., `game_1`, `game_2`)
- **Start with the home page** at http://localhost:5173 to see all available options
- The home page provides direct links to all role interfaces
- Each role has a detailed explanation and quick-start instructions

### 🎮 How to Start Your First Game

#### Getting Started
**Important**: Always start with the Game Master interface to create games first.

1. **Open the Main Application**
   - Go to http://localhost:5173 in your web browser
   - You'll see the home page with role explanations

2. **Start with Game Master Interface**
   - Click **"Open GM Panel"** or go directly to http://localhost:5173/gm
   - This is where you create and manage game sessions

3. **Create a Game Session**
   **Recommended: Use the GM Interface**
   - In the GM view, you'll see "🎮 No Game Session Active"
   - Click the **"🚀 Create New Game"** button
   - You'll be redirected to the new game (e.g., http://localhost:5173/gm/game_1)
   
   **Alternative: Use API directly**
   ```bash
   curl -X POST http://localhost:3100/api/game/create
   # Returns: {"gameId":"game_1"}
   ```

4. **Start the Game**
   **Recommended: Use the GM Interface**
   - After creating a game, you'll see "Game created but not started"
   - Click the **"▶️ Start Game"** button
   - **⏱️ Wait 10-20 seconds** - The system generates AI companies with detailed backstories
   - You'll see a loading spinner and progress message during generation
   - Once complete, the full GM control panel will appear
   
   **Alternative: Use API directly**
   ```bash
   curl -X POST http://localhost:3100/api/game/game_1/start \
     -H "Content-Type: application/json" \
     -d '{"playerCount": 3}'
   ```
   
   **What happens during game start:**
   - 🤖 AI generates 3 unique companies with detailed backstories
   - 👥 Each company gets employees with names, roles, and experience
   - 📊 Economic indicators are initialized (GDP, unemployment, etc.)
   - 🎯 Business objectives and financial data are created
   
   **After starting, you'll see:**
   - Full GM control panel with all game management tools
   - Company dashboard showing all generated businesses
   - Economic parameter controls and shock event triggers

#### Setting Up Players

5. **Open Observer View for Display**
   - After starting the game, go to http://localhost:5173/observer/[your-game-id]
   - Replace [your-game-id] with the actual ID (shown in GM panel)
   - This shows the main presentation screen with:
     - QR code for easy player joining
     - Real-time economic dashboard
     - News feed updates

6. **Add Players**
   - **Option A**: Players scan QR code from Observer view
   - **Option B**: Players manually navigate to http://localhost:5173/player/[your-game-id]
   - **Option C**: For testing, open multiple browser tabs/windows

#### Playing the Game

7. **Player Experience**
   - Each player sees their own company dashboard
   - Players make quarterly decisions via card interface
   - Decisions affect both personal and global economy

8. **Game Master Controls**
   - Monitor all players from GM view
   - Trigger economic shock events
   - Adjust global economic parameters
   - Advance game quarters manually if needed

9. **Observer Experience**
   - Real-time economic indicators (GDP, unemployment)
   - AI-generated news updates based on player actions
   - Overview of all company performance

#### What You'll See

**First Game Session Expectations:**
- Initial companies will have mock/placeholder data (unless using real Gemini API)
- Economic indicators start with baseline values (2% GDP growth, ~5% unemployment)
- Players making decisions will gradually affect these metrics
- News updates will reflect the economic changes happening

### 🔧 Troubleshooting

#### Most Common Issue: Port Already in Use

**Backend Server Error:**
```bash
Error: listen EADDRINUSE: address already in use :::3100
```

**Quick Solutions:**
```bash
# Option 1: Kill the process using port 3100
lsof -ti:3100 | xargs kill
cd backend && npm start

# Option 2: Use a different port
cd backend && PORT=3101 npm start
# Remember to update frontend .env: VITE_API_URL=http://localhost:3101

# Option 3: Find and kill the specific process
lsof -i:3100  # Shows what's using the port
kill [PID]    # Replace [PID] with the actual process ID
```

**Frontend Server Error:**
```bash
# If Vite says port 5173 is in use:
pkill -f "vite"
cd frontend && npm run dev
```

#### Other Common Issues:

**"Cannot connect to server" / API errors:**
- Ensure backend server is running and shows "Server listening on port 3100"
- Check backend health: `curl http://localhost:3100/health`
- Verify no firewall is blocking the connection

**Frontend won't load:**
- Ensure frontend dev server is running and accessible at http://localhost:5173
- Check browser console for JavaScript errors (F12 → Console)
- Try refreshing the browser or clearing cache

**WebSocket connection failures:**
- Check browser developer tools Network tab for failed connections
- Ensure both frontend and backend servers are running
- Verify CORS settings if accessing from different domains

**"Start Game" button not responding:**
- **Normal behavior**: Button shows loading spinner for 10-20 seconds while AI generates content
- **Check browser console**: F12 → Console tab for any JavaScript errors
- **Verify API connection**: Backend should show AI generation activity in console
- **If stuck**: Refresh page and try again, or use API directly:
  ```bash
  curl -X POST http://localhost:3100/api/game/game_1/start \
    -H "Content-Type: application/json" \
    -d '{"playerCount": 3}'
  ```

**Tests failing:**
```bash
cd backend
npm test
```
All tests should pass. If not, ensure no servers are running during tests.

#### Checking Server Status:

**Backend Health Check:**
```bash
curl http://localhost:3100/health
```
Should return: `{"status":"healthy","timestamp":"...","uptime":...}`

**Frontend Access:**
Open http://localhost:5173 - should show the main application interface

#### Port Configuration:

If you need to use different ports, update these files:

**Backend Port (change from 3100):**
- Edit `backend/.env`: `PORT=3200`
- Or set environment variable: `PORT=3200 npm start`

**Frontend API URLs (if backend port changes):**
- Edit `frontend/.env`: `VITE_API_URL=http://localhost:3200`

### 📱 Mobile Device Setup

For the best experience with player devices:

1. **Ensure devices are on same network** as the development computer
2. **Find your computer's IP address:**
   ```bash
   # On macOS/Linux:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows:
   ipconfig | findstr "IPv4"
   ```
3. **Access via IP address:** http://[YOUR-IP]:5173/player/game_1
4. **Or use the QR code** displayed in Observer view for easy mobile access

### ✅ Quick Verification

To verify everything is working correctly:

1. **Check Backend Server:**
   ```bash
   curl http://localhost:3100/health
   ```
   Should return: `{"status":"healthy","timestamp":"...","uptime":...}`

2. **Check Frontend:**
   - Open http://localhost:5173
   - You should see "The Shifting Economy" home page with three role cards
   - Click "Open GM Panel" - you should see "🎮 No Game Session Active"

3. **Test API Connection:**
   ```bash
   curl -X POST http://localhost:3100/api/game/create
   ```
   Should return: `{"gameId":"game_1"}` (or similar)

4. **Verify WebSocket Connection:**
   - Open browser developer tools (F12)
   - Go to http://localhost:5173
   - Check Console for any connection errors

If all checks pass, your installation is complete and ready to use!

## 🎯 User Roles & Interfaces

### 🎪 Observer View
**Purpose**: Main presentation display for audiences and facilitators

**Features**:
- **Lobby Screen**: Shows QR code for player joining
- **Economic Dashboard**: Real-time macro indicators (GDP, unemployment)
- **News Feed**: AI-generated economic narratives
- **Company Overview**: Bird's-eye view of all player companies

**Usage**: Connect a large screen or projector to display this view during sessions

### 📱 Player View  
**Purpose**: Mobile-optimized interface for participants

**Features**:
- **Company Dashboard**: Personal business metrics and employees
- **Decision Cards**: Swipeable quarterly decision interface
- **Employee Roster**: Detailed staff information
- **AI Opportunities**: Dynamic automation and investment options

**Usage**: Players use smartphones to join games via QR code and make decisions

### 🎮 Game Master View
**Purpose**: Control panel for session facilitators

**Features**:
- **Game Controls**: Start/pause/reset game sessions
- **Player Management**: Monitor decision submissions
- **Economic Levers**: Adjust global parameters mid-game
- **Shock Events**: Trigger economic disruptions
- **Analytics**: Real-time gameplay insights

**Usage**: Facilitators use this interface to guide and enhance sessions

## 🔧 Configuration & Deployment

### Environment Variables

**Backend (.env)**:
```bash
# Server Configuration
PORT=3100
NODE_ENV=development

# Firebase Configuration  
FIREBASE_PROJECT_ID=your-project-id
USE_REAL_FIRESTORE=false

# LLM Configuration
GEMINI_API_KEY=your-api-key
USE_MOCK_LLM=false

# Feature Flags
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**:
```bash
VITE_API_URL=http://localhost:3100
VITE_SOCKET_URL=http://localhost:3100
```

### Production Deployment

#### Google Cloud Run (Recommended)
```bash
# Backend deployment
cd backend
export PROJECT_ID=your-gcp-project
export REGION=us-central1
./scripts/deploy-gcp.sh

# Frontend deployment (Vercel/Netlify)
cd frontend
npm run build
# Deploy dist/ directory to your hosting provider
```

#### Railway
```bash
# Connect Railway CLI and deploy
railway up
```

#### Docker Deployment
```bash
# Build and run backend container
cd backend
docker build -t postlaborsim-backend .
docker run -p 3100:3100 postlaborsim-backend
```

### Firebase Setup (Optional)

1. **Create Firebase Project**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login and create project
   firebase login
   firebase projects:create your-project-id
   ```

2. **Configure Firestore**
   ```bash
   # Initialize Firestore
   firebase init firestore
   
   # Deploy security rules
   firebase deploy --only firestore:rules
   ```

3. **Generate Service Account Key**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Save as `backend/config/serviceAccountKey.json`

## 🧪 Testing

### Unit Tests
```bash
# Backend tests
cd backend
npm test

# Test coverage
npm run test:coverage
```

### End-to-End Tests
```bash
# Install testing dependencies
cd testing
npm install

# Run multiplayer simulation test
npm test

# Load testing
npm run load-test
```

### Manual Testing Workflow
1. Start backend and frontend servers
2. Open Observer view on desktop/projector
3. Use GM view to create and start a game
4. Join as players using mobile devices via QR code
5. Make decisions and observe economic evolution
6. Test shock events and parameter adjustments

## 🎨 UI/UX Features

### Design System
- **CSS Custom Properties**: Consistent theming and spacing
- **Responsive Design**: Mobile-first responsive layouts
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **Loading States**: Spinners and skeleton screens
- **Error Handling**: User-friendly error messages with retry options
- **Real-time Feedback**: Connection status and action confirmations

### Performance Optimizations
- **Code Splitting**: Lazy-loaded route components
- **Optimized Bundling**: Vite-powered build process
- **Responsive Images**: Adaptive image loading
- **Socket Connection Management**: Automatic reconnection handling

## 📊 Economic Modeling

### Core Simulation Engine
- **Quarterly Progression**: Economic cycles with player decision integration
- **GDP Growth Modeling**: Base 2% quarterly growth with player impact
- **Unemployment Dynamics**: Automation vs. job creation balance
- **Purchasing Power Calculations**: Combined wages and profit distribution

### AI-Generated Content
- **Company Ecosystems**: Interconnected business networks
- **Employee Profiles**: Detailed character backgrounds and skills
- **Economic News**: Contextual narrative updates
- **Opportunity Cards**: Dynamic automation and investment scenarios

### Multiplayer Mechanics
- **Decision Synchronization**: All players decide simultaneously
- **Economic Interdependence**: Company actions affect global metrics
- **Shock Event System**: GM-triggered economic disruptions
- **Progressive Complexity**: Scenarios evolve based on collective choices

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow code style: ESLint for JavaScript, Prettier for formatting
4. Add tests for new functionality
5. Submit pull request with clear description

### Code Standards
- **Backend**: Node.js with CommonJS modules, Jest for testing
- **Frontend**: React with functional components and hooks
- **Styling**: CSS custom properties, mobile-first responsive design
- **Git**: Conventional commit messages, feature branch workflow

### Areas for Contribution
- **Economic Models**: Enhanced simulation algorithms
- **UI/UX**: Accessibility improvements and visual enhancements  
- **AI Integration**: Advanced LLM prompting and content generation
- **Testing**: Additional test coverage and scenarios
- **Documentation**: Tutorials, guides, and API documentation

## 📚 Educational Applications

### Classroom Use
- **Economics Courses**: Hands-on exploration of economic theory
- **Policy Studies**: Interactive policy impact simulation
- **Business Strategy**: Decision-making under uncertainty
- **Technology Ethics**: Automation impact discussions

### Workshop Facilitation
- **Corporate Training**: Future workforce planning
- **Policy Maker Briefings**: Economic transition scenario planning
- **Academic Conferences**: Interactive research presentations
- **Public Engagement**: Community discussions on economic futures

### Learning Outcomes
- Understanding of post-labor economic concepts
- Experience with strategic business decision-making
- Awareness of automation's societal implications
- Collaborative problem-solving in economic contexts

## 🔬 Research & Validation

### Economic Model Basis
- **OECD Economic Projections**: GDP growth baselines
- **World Economic Forum**: Employment and automation data
- **Academic Research**: Peer-reviewed automation impact studies
- **Historical Analysis**: Economic transition precedents

### Simulation Validation
- **Unit Testing**: 95%+ code coverage
- **Economic Model Testing**: Boundary condition validation
- **User Testing**: Session feedback integration
- **Performance Testing**: Multi-game load testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Economic Research**: OECD, World Economic Forum, academic institutions
- **Technology Stack**: React, Node.js, Firebase, Google Gemini teams
- **Open Source Community**: Contributors and maintainers
- **Educational Partners**: Universities and organizations using the platform

## 📞 Support & Community

- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Community discussions via GitHub Discussions  
- **Documentation**: Additional guides in `/docs` directory
- **Updates**: Follow releases for new features and improvements

---

**The Shifting Economy** is designed for educational and research purposes. Economic projections are based on current modeling assumptions and should be interpreted as exploratory scenarios rather than predictive forecasts.