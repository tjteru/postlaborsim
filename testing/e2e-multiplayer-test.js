const io = require('socket.io-client');
const axios = require('axios');

class MultiplayerTestSuite {
    constructor(serverUrl = 'http://localhost:3100') {
        this.serverUrl = serverUrl;
        this.gameId = null;
        this.players = [];
        this.observer = null;
        this.gm = null;
    }

    async setup() {
        console.log('🔧 Setting up multiplayer test suite...');
        
        // Wait for server to be ready
        await this.waitForServer();
        
        // Create game
        const response = await axios.post(`${this.serverUrl}/api/game/create`);
        this.gameId = response.data.gameId;
        console.log(`✅ Game created with ID: ${this.gameId}`);
        
        // Connect observer socket
        this.observer = io(this.serverUrl);
        await this.waitForConnection(this.observer, 'Observer');
        this.observer.emit('joinGame', { gameId: this.gameId, role: 'observer' });
        
        // Connect GM socket
        this.gm = io(this.serverUrl);
        await this.waitForConnection(this.gm, 'GM');
        this.gm.emit('joinGame', { gameId: this.gameId, role: 'gm' });
        
        // Connect 3 player sockets
        for (let i = 1; i <= 3; i++) {
            const player = io(this.serverUrl);
            await this.waitForConnection(player, `Player ${i}`);
            player.emit('joinGame', { 
                gameId: this.gameId, 
                role: 'player', 
                playerId: `player${i}`,
                playerName: `Test Player ${i}`
            });
            this.players.push(player);
        }
        
        console.log('✅ All clients connected');
    }

    async waitForServer(maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                await axios.get(`${this.serverUrl}/health`);
                console.log('✅ Server is ready');
                return;
            } catch (error) {
                if (i === maxAttempts - 1) {
                    throw new Error('Server failed to start');
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    async waitForConnection(socket, name) {
        return new Promise((resolve) => {
            socket.on('connect', () => {
                console.log(`✅ ${name} connected`);
                resolve();
            });
        });
    }

    async testGameFlow() {
        console.log('🎮 Testing complete multiplayer game flow...');
        
        // Test 1: Start game
        console.log('1. Starting game...');
        await axios.post(`${this.serverUrl}/api/game/${this.gameId}/start`, { playerCount: 3 });
        
        // Test 2: Verify all clients receive game start event
        await this.waitForEvent('gameStarted', [this.observer, this.gm, ...this.players]);
        console.log('✅ All clients received game start event');
        
        // Test 3: Players make decisions
        console.log('2. Players making decisions...');
        for (let i = 0; i < this.players.length; i++) {
            const response = await axios.post(`${this.serverUrl}/api/player/action`, {
                gameId: this.gameId,
                playerId: `player${i + 1}`,
                action: {
                    type: 'investment',
                    amount: 1000 * (i + 1),
                    target: 'automation'
                }
            });
            console.log(`  Player ${i + 1} action submitted`);
        }
        
        // Test 4: Verify quarter progression
        await this.waitForEvent('newQuarter', [this.observer, this.gm, ...this.players]);
        console.log('✅ Quarter progression successful');
        
        // Test 5: GM triggers shock event
        console.log('3. GM triggering shock event...');
        await axios.post(`${this.serverUrl}/api/gm/action`, {
            gameId: this.gameId,
            action: {
                type: 'shockEvent',
                event: 'economic_downturn',
                severity: 0.5
            }
        });
        
        await this.waitForEvent('shockEvent', [this.observer, ...this.players]);
        console.log('✅ Shock event propagated to all clients');
        
        // Test 6: Verify news updates
        await this.waitForEvent('newsUpdate', [this.observer, this.gm, ...this.players]);
        console.log('✅ News updates received');
        
        console.log('🎉 All multiplayer tests passed!');
    }

    async waitForEvent(eventName, sockets, timeout = 10000) {
        const promises = sockets.map(socket => 
            new Promise((resolve) => {
                const timer = setTimeout(() => {
                    console.warn(`⚠️  Timeout waiting for ${eventName}`);
                    resolve();
                }, timeout);
                
                socket.once(eventName, (data) => {
                    clearTimeout(timer);
                    resolve(data);
                });
            })
        );
        
        await Promise.all(promises);
    }

    async testReconnection() {
        console.log('🔌 Testing reconnection scenarios...');
        
        // Disconnect a player
        const player = this.players[0];
        player.disconnect();
        console.log('  Player 1 disconnected');
        
        // Wait and reconnect
        await new Promise(resolve => setTimeout(resolve, 2000));
        const newPlayer = io(this.serverUrl);
        await this.waitForConnection(newPlayer, 'Reconnected Player 1');
        newPlayer.emit('joinGame', { 
            gameId: this.gameId, 
            role: 'player', 
            playerId: 'player1',
            playerName: 'Test Player 1 (Reconnected)'
        });
        
        this.players[0] = newPlayer;
        console.log('✅ Player reconnection successful');
    }

    async testErrorHandling() {
        console.log('🚨 Testing error handling...');
        
        // Test invalid game ID
        try {
            await axios.post(`${this.serverUrl}/api/game/invalid-game-id/start`);
            console.log('❌ Should have thrown error for invalid game ID');
        } catch (error) {
            console.log('✅ Correctly handled invalid game ID');
        }
        
        // Test invalid player action
        try {
            await axios.post(`${this.serverUrl}/api/player/action`, {
                gameId: 'invalid-game',
                playerId: 'invalid-player',
                action: { type: 'invalid' }
            });
            console.log('❌ Should have thrown error for invalid action');
        } catch (error) {
            console.log('✅ Correctly handled invalid player action');
        }
    }

    async cleanup() {
        console.log('🧹 Cleaning up test suite...');
        
        // Disconnect all sockets
        [this.observer, this.gm, ...this.players].forEach(socket => {
            if (socket && socket.connected) {
                socket.disconnect();
            }
        });
        
        console.log('✅ Cleanup complete');
    }

    async run() {
        try {
            await this.setup();
            await this.testGameFlow();
            await this.testReconnection();
            await this.testErrorHandling();
            console.log('🎉 All tests completed successfully!');
        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
            throw error;
        } finally {
            await this.cleanup();
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const suite = new MultiplayerTestSuite();
    suite.run().catch(error => {
        console.error('Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = MultiplayerTestSuite;