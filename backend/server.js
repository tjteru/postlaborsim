
// Server configuration
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || 3100;
const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || 'localhost';
const SERVER_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;

const express = require('express');
const http = require('http');
const app = express();

// Add this line to set the port from environment or default to 3100
const PORT = process.env.PORT || 3100;

const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const gameRoutes = require('./controllers/gameController');
const playerRoutes = require('./controllers/playerController');
const gmRoutes = require('./controllers/gmController');

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime() 
    });
});

app.use('/api/game', gameRoutes(io));
app.use('/api/player', playerRoutes(io));
app.use('/api/gm', gmRoutes(io));

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = { app, server, io };
