const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const gameRoutes = require('./controllers/gameController');
const playerRoutes = require('./controllers/playerController');
const gmRoutes = require('./controllers/gmController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

app.use(cors());
app.use(bodyParser.json());

app.use('/api/game', gameRoutes(io));
app.use('/api/player', playerRoutes(io));
app.use('/api/gm', gmRoutes(io));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = { app, server, io };
