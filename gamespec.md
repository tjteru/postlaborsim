# ### Software Specification: "The Shifting Economy"
**1. Overview & System Architecture**
This document specifies the technical implementation for "The Shifting Economy," a real-time, multiplayer economic simulation game. The system will be a client-server application designed to support 1 Game Master (GM), 1-20 Players, and any number of Observers.
The architecture will consist of three main parts:
* **Node.js Backend Server:** Manages the core game logic, simulation engine, database interactions, and real-time communication with all clients.
* **Firebase/Firestore Database:** Persists all game state, including session data, company profiles, player actions, and economic history. This allows games to be paused and resumed.
* **React Frontend Application:** A single-page application (SPA) that renders three distinct views based on the user's role: the Player's mobile-first interface, the Game Master's control panel, and the main Observer dashboard.

⠀**Technology Stack:**
* **Backend:** Node.js with Express.js
* **Frontend:** React with Vite for bundling
* **Real-time Communication:** Socket.IO
* **Database:** Google Firestore
* **LLM Integration:** Google Gemini API (or similar) for generative content.

⠀**2. Backend Development (Node.js)**
The backend is the authoritative source for the simulation state.
**2.1. Core Simulation Engine (Adapting** postlaborsim**)**
The existing simulation logic in postlaborsim/src/simulation.js will be ported to the Node.js environment. It will be refactored from a standalone script into a class-based Simulation module.
* **Input:** The simulation will no longer read from static JSON. It will receive player decisions for a given quarter from the main server application.
* **Output:** Instead of directly rendering to a chart, the runSimulation() method will calculate the state of the economy for the next quarter and return a structured JSON object.
* **Expanded Economic Model:** The core logic will be expanded to include the new models from the Game Design Spec:
  * **Interdependent Economy:** A demand/supply model where businesses purchase from each other.
  * **Purchasing Power:** Explicitly calculated from wages + distributed profits.
  * **Entrepreneurship Pipeline:** Logic for unemployed agents to start new businesses.
  * **Capital Distribution:** Functions to handle profit distribution for ESOP, Co-op, and Community Equity models.

⠀**2.2. Server & API Endpoints**
An Express.js server will handle HTTP requests and Socket.IO connections.
* POST /api/game/create**:** Initializes a new game session, creates a unique lobby ID, and stores it in Firestore.
* POST /api/game/:gameId/start**:** Triggered by the GM. Initiates the LLM calls to generate the business ecosystem and employee backstories. Distributes initial state to all connected clients.
* POST /api/player/action**:** Players submit their quarterly decisions (AI adoption, spending, hiring/firing, ownership changes) to this endpoint.
* POST /api/gm/action**:** The GM uses this to trigger "Shock Events" or modify global simulation parameters.
* GET /api/game/:gameId/state**:** Retrieves the full current state of a given game session.

⠀**2.3. Real-time Communication (Socket.IO)**
Socket.IO will be used for instantaneous updates.
* **Namespaces:** A unique namespace will be created for each game session (e.g., /game-lobby-xyz).
* **Events:**
  * 'playerJoined': Broadcast when a new player joins the lobby.
  * 'gameStarted': Broadcast to all clients with the initial game state.
  * 'newQuarter': Broadcast to all clients with the updated macroeconomic and company-specific data after a simulation run.
  * 'decisionReceived': Sent to the GM's dashboard to show which players have submitted their actions.
  * 'shockEvent': Sent from the GM to the server, which then broadcasts the event details to all players.

⠀**2.4. LLM Integration Module**
A dedicated module (llmService.js) will handle all interactions with the Gemini API.
* generateEcosystem(playerCount)**:** Constructs a prompt to generate playerCount number of interdependent businesses. The prompt will specify the desired output format (JSON) and the need for B2B relationships.
* generateCompanyDetails(businessType)**:** Takes a business type (e.g., "bakery") and generates a rich profile: backstory, financials, objectives, and an employee roster with roles and personal backstories.
* generateAIOpportunity(business)**:** Creates a contextual AI opportunity card based on the specific business profile.
* generateNewsUpdate(previousState, newState)**:** Takes the economic data before and after a simulation run and generates a narrative news story summarizing the changes.

⠀**3. Database Schema (Firestore)**
Firestore's document-oriented structure is well-suited for this game.
* games **(Collection)**
  * gameId **(Document)**
    * gameMasterId: string
    * status: 'lobby' | 'in-progress' | 'finished'
    * currentQuarter: number
    * globalParameters: { ubiLevel: number, entrepreneurshipRate: number, ... }
    * history **(Sub-collection)**
      * quarter_1 **(Document):** { macroeconomic_data }
      * quarter_2 **(Document):** { macroeconomic_data }
    * companies **(Sub-collection)**
      * companyId **(Document)**
        * playerId: string
        * profile: { name, backstory, ... }
        * ownershipModel: 'sole_prop' | 'esop' | 'coop' | 'community'
        * employees: array of objects
        * financials **(Sub-collection)**
          * quarter_1 **(Document):** { revenue, profit, cash, ... }
          * quarter_2 **(Document):** { revenue, profit, cash, ... }
    * players **(Sub-collection)**
      * playerId **(Document)**
        * name: string
        * companyId: string

⠀**4. Frontend Development (React)**
A single React application will manage all three user-facing interfaces using client-side routing and role-based component rendering.
**4.1. Main Components**
* App.js**:** The root component. Manages Socket.IO connection and routing.
* GameContainer.js**:** The main wrapper. Fetches the user's role and renders the appropriate view (GM, Player, or Observer).
* SocketProvider.js**:** A context provider to make the Socket.IO instance available to all child components.

⠀**4.2. Observer View (Main Dashboard)**
* MacroDashboard.js**:** Displays the primary economic indicators (GDP, Unemployment, etc.) using a charting library like Recharts.
* NewsFeed.js**:** Displays the narrative updates from the "Local Economic Sentinel."
* LobbyView.js**:** Shows the QR code for joining and the list of connected players before the game starts.

⠀**4.3. Player View (Mobile-First)**
This view is designed to look and feel like a native mobile app.
* PlayerDashboard.js**:** Shows the player's company-specific P&L, cash flow, employee morale, etc.
* DecisionDeck.js**:** A swipeable card interface (like Tinder) for making quarterly decisions.
  * AIOpportunityCard.js
  * InvestmentCard.js
  * HiringCard.js
  * OwnershipCard.js
* EmployeeRoster.js**:** A view to see the list of employees and their backstories.

⠀**4.4. Game Master View (Control Panel)**
This view is a comprehensive dashboard for managing the simulation.
* GMDashboard.js**:** An overview of all companies' key metrics in a table format.
* GlobalLevers.js**:** A component with sliders to adjust the global game parameters (UBI, Entrepreneurship Rate, etc.) in real-time.
* ShockEventControl.js**:** Buttons to trigger the various shock events.
* PlayerStatus.js**:** Shows which players have submitted their decisions for the current quarter.
* GameControls.js**:** Buttons to Start Game, Advance to Next Quarter, and End Game.

⠀**5. Development & Migration Plan**
**1** **Phase 1: Backend & Simulation Core (Weeks 1-2)**
	* Set up Node.js server with Express and Socket.IO.
	* Port and refactor the postlaborsim engine.
	* Implement the expanded economic model without LLM integration yet (use static placeholder data).
	* Set up Firestore database schema.
**2** **Phase 2: Frontend Scaffolding & Observer View (Weeks 3-4)**
	* Set up the React application with routing.
	* Build the main Observer dashboard and connect it to the backend to display real-time (placeholder) data.
**3** **Phase 3: Player & GM Views (Weeks 5-6)**
	* Build the mobile-first Player interface for decision making.
	* Build the Game Master control panel.
	* Integrate player/GM actions with the backend API.
**4** **Phase 4: LLM Integration & Content Generation (Weeks 7-8)**
	* Build the llmService module on the backend.
	* Replace all placeholder data generation with live calls to the Gemini API.
	* Test and refine prompts for quality and consistency.
**5** **Phase 5: Testing & Deployment (Weeks 9-10)**
	* Conduct end-to-end testing with multiple players.
	* Refine UI/UX based on feedback.
	* Deploy the application to a cloud service (e.g., Google Cloud Run, Vercel).
