const io = require('socket.io-client');
const axios = require('axios');

class LoadTestSuite {
    constructor(serverUrl = 'http://localhost:3100') {
        this.serverUrl = serverUrl;
        this.clients = [];
        this.games = [];
    }

    async runLoadTest(numGames = 5, playersPerGame = 3) {
        console.log(`🚀 Running load test: ${numGames} games with ${playersPerGame} players each`);
        
        const startTime = Date.now();
        
        // Create multiple games concurrently
        const gamePromises = [];
        for (let i = 0; i < numGames; i++) {
            gamePromises.push(this.createAndRunGame(i + 1, playersPerGame));
        }
        
        try {
            await Promise.all(gamePromises);
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            
            console.log(`✅ Load test completed successfully!`);
            console.log(`📊 Statistics:`);
            console.log(`   - Total games: ${numGames}`);
            console.log(`   - Total players: ${numGames * playersPerGame}`);
            console.log(`   - Duration: ${duration}s`);
            console.log(`   - Games per second: ${(numGames / duration).toFixed(2)}`);
            
        } catch (error) {
            console.error('❌ Load test failed:', error.message);
            throw error;
        } finally {
            await this.cleanup();
        }
    }

    async createAndRunGame(gameNumber, playerCount) {
        console.log(`🎮 Creating game ${gameNumber}...`);
        
        // Create game
        const response = await axios.post(`${this.serverUrl}/api/game/create`);
        const gameId = response.data.gameId;
        this.games.push(gameId);
        
        // Connect players
        const players = [];
        for (let i = 1; i <= playerCount; i++) {
            const player = io(this.serverUrl);
            players.push(player);
            this.clients.push(player);
            
            await new Promise(resolve => {
                player.on('connect', resolve);
            });
            
            player.emit('joinGame', { 
                gameId, 
                role: 'player', 
                playerId: `game${gameNumber}_player${i}`,
                playerName: `Load Test Player ${i}`
            });
        }
        
        // Start game
        await axios.post(`${this.serverUrl}/api/game/${gameId}/start`, { playerCount });
        
        // Simulate some player actions
        for (let i = 0; i < players.length; i++) {
            await axios.post(`${this.serverUrl}/api/player/action`, {
                gameId,
                playerId: `game${gameNumber}_player${i + 1}`,
                action: {
                    type: 'investment',
                    amount: Math.floor(Math.random() * 5000) + 1000,
                    target: ['automation', 'expansion', 'research'][Math.floor(Math.random() * 3)]
                }
            });
        }
        
        console.log(`✅ Game ${gameNumber} completed`);
    }

    async cleanup() {
        console.log('🧹 Cleaning up load test...');
        
        this.clients.forEach(client => {
            if (client && client.connected) {
                client.disconnect();
            }
        });
        
        this.clients = [];
        this.games = [];
        
        console.log('✅ Load test cleanup complete');
    }

    async checkServerHealth() {
        try {
            const response = await axios.get(`${this.serverUrl}/health`);
            console.log('🏥 Server health:', response.data);
            return true;
        } catch (error) {
            console.error('❌ Server health check failed:', error.message);
            return false;
        }
    }
}

// Run load test if called directly
if (require.main === module) {
    const suite = new LoadTestSuite();
    
    const numGames = parseInt(process.argv[2]) || 3;
    const playersPerGame = parseInt(process.argv[3]) || 3;
    
    suite.checkServerHealth().then(healthy => {
        if (healthy) {
            return suite.runLoadTest(numGames, playersPerGame);
        } else {
            throw new Error('Server is not healthy');
        }
    }).catch(error => {
        console.error('Load test failed:', error);
        process.exit(1);
    });
}

module.exports = LoadTestSuite;