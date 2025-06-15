# ### Project Plan: The Shifting Economy
This project plan breaks down the development of "The Shifting Economy" into distinct epics and tasks, following the provided software specification.
### Phase 1: Backend & Simulation Core (Weeks 1-2)
**Epic: Backend Foundation**
* **Task 1.1:** Initialize project repository (monorepo or separate backend/frontend) and set up project structure.
* **Task 1.2:** Initialize Node.js backend project, install dependencies (Express, Socket.IO, etc.).
* **Task 1.3:** Implement a basic Express.js server with necessary middleware (CORS, body-parser).
* **Task 1.4:** Integrate Socket.IO with the Express server for real-time communication.
* **Task 1.5:** Create placeholder API endpoint controllers and routes as defined in the spec.

⠀**Epic: Simulation Engine & Database**
* **Task 2.1:** Set up a new Google Firebase project and configure Firestore database.
* **Task 2.2:** Develop a firestoreService.js module on the backend to handle all database interactions based on the defined schema.
* **Task 2.3:** Port the core simulation logic from postlaborsim into a new Simulation.js module in the Node.js environment.
* **Task 2.4:** Refactor the ported simulation logic into a class-based structure, separating data input from calculation.
* **Task 2.5:** Expand the Simulation class to include the new economic models (using static placeholder data for now):
  * **Sub-task:** Implement Interdependent Economy logic.
  * **Sub-task:** Implement Purchasing Power calculation (Wages + Profits).
  * **Sub-task:** Implement Entrepreneurship Pipeline.
  * **Sub-task:** Implement Capital Distribution functions (ESOP, Co-op, etc.).
* **Task 2.6:** Connect the simulation engine to the API endpoints so that it can receive actions and save new state to Firestore.

⠀Phase 2: Frontend Scaffolding & Observer View (Weeks 3-4)
**Epic: Frontend Foundation**
* **Task 3.1:** Initialize a new React project using Vite and install dependencies (router, socket client, charting library).
* **Task 3.2:** Implement client-side routing (react-router-dom) for the three main views (Observer, Player, GM).
* **Task 3.3:** Create a SocketProvider.js using React Context to manage the client-side Socket.IO connection and make it available throughout the app.

⠀**Epic: Observer (Main Dashboard) View**
* **Task 4.1:** Build the LobbyView.js component to display a QR code for joining and show a real-time list of connected players.
* **Task 4.2:** Build the MacroDashboard.js component using a charting library (e.g., Recharts) to display the main economic indicators.
* **Task 4.3:** Build the NewsFeed.js component to display a list of narrative updates.
* **Task 4.4:** Connect the Observer view components to the backend via the SocketProvider to listen for events ('playerJoined', 'newQuarter') and display live data.

⠀Phase 3: Player & GM Views (Weeks 5-6)
**Epic: Player (Mobile) View**
* **Task 5.1:** Build the PlayerDashboard.js component to display the player's private company data.
* **Task 5.2:** Implement the DecisionDeck.js swipeable card UI for making quarterly decisions.
* **Task 5.3:** Create the individual decision card components (AIOpportunityCard.js, InvestmentCard.js, etc.).
* **Task 5.4:** Build the EmployeeRoster.js component to display employee details.
* **Task 5.5:** Connect the Player view to the backend to submit actions via the API and receive state updates.

⠀**Epic: Game Master (Control Panel) View**
* **Task 6.1:** Build the main GMDashboard.js component with a table overview of all companies.
* **Task 6.2:** Create the GlobalLevers.js component with sliders to adjust game parameters.
* **Task 6.3:** Create the ShockEventControl.js and GameControls.js components with buttons for all GM actions.
* **Task 6.4:** Build the PlayerStatus.js component to show who has submitted their turn.
* **Task 6.5:** Connect the GM view to the backend to send commands and receive real-time updates on the game state.

⠀Phase 4: LLM Integration & Content Generation (Weeks 7-8)
**Epic: Generative Content Service**
* **Task 7.1:** Create the llmService.js module on the backend to handle all Gemini API calls.
* **Task 7.2:** Implement and test the generateEcosystem function and its prompt to create the initial game world.
* **Task 7.3:** Implement and test the generateCompanyDetails function and prompt for rich, contextual company/employee profiles.
* **Task 7.4:** Implement and test the generateAIOpportunity function and prompt.
* **Task 7.5:** Implement and test the generateNewsUpdate function and prompt.
* **Task 7.6:** Integrate the llmService into the core game logic, replacing all placeholder data with live API calls at the correct moments (game start, new quarter).

⠀Phase 5: Testing & Deployment (Weeks 9-10)
**Epic: Quality Assurance & Deployment**
* **Task 8.1:** Write unit tests for the core simulation engine logic to ensure economic calculations are correct.
* **Task 8.2:** Organize and conduct end-to-end multiplayer testing sessions to identify bugs and usability issues.
* **Task 8.3:** Iterate on UI/UX based on feedback from testing sessions.
* **Task 8.4:** Configure production environment variables and finalize Firestore security rules for secure public access.
* **Task 8.5:** Deploy the backend (Node.js) and frontend (React) applications to a cloud hosting provider (e.g., Google Cloud Run, Vercel).
* **Task 8.6:** Create comprehensive README.md documentation for project setup, development, and usage.
