import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomeView.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100';

const HomeView = () => {
  const [activeGameId, setActiveGameId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active games by trying common game IDs
    const checkForActiveGames = async () => {
      try {
        for (let i = 1; i <= 5; i++) {
          const response = await fetch(`${API_URL}/api/game/game_${i}/state`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.companies && data.companies.length > 0) {
              setActiveGameId(`game_${i}`);
              break;
            }
          }
        }
      } catch (error) {
        console.warn('Error checking for active games:', error);
      } finally {
        setLoading(false);
      }
    };

    checkForActiveGames();
  }, []);

  return (
    <div className="home-view">
      <div className="home-container">
        <header className="home-header">
          <h1 className="home-title">The Shifting Economy</h1>
          <p className="home-subtitle">
            Multiplayer Post-Labor Economic Simulation
          </p>
        </header>

        <div className="home-content">
          <div className="role-cards">
            <div className="role-card">
              <h2>🎪 Observer</h2>
              <p>Main presentation display for audiences and facilitators</p>
              <div className="role-features">
                <li>QR code for player joining</li>
                <li>Real-time economic dashboard</li>
                <li>AI-generated news updates</li>
              </div>
              {loading ? (
                <div className="role-button-disabled">
                  Checking for games...
                </div>
              ) : activeGameId ? (
                <Link to={`/observer/${activeGameId}`} className="role-button">
                  Open Observer View
                </Link>
              ) : (
                <div className="role-button-disabled">
                  Open Observer View
                  <small>(Create game first)</small>
                </div>
              )}
            </div>

            <div className="role-card">
              <h2>📱 Player</h2>
              <p>Mobile-optimized interface for participants</p>
              <div className="role-features">
                <li>Company dashboard</li>
                <li>Decision card interface</li>
                <li>Employee roster</li>
              </div>
              {loading ? (
                <div className="role-button-disabled">
                  Checking for games...
                </div>
              ) : activeGameId ? (
                <Link to={`/player/${activeGameId}`} className="role-button">
                  Join as Player
                </Link>
              ) : (
                <div className="role-button-disabled">
                  Join as Player
                  <small>(Create game first)</small>
                </div>
              )}
            </div>

            <div className="role-card">
              <h2>🎮 Game Master</h2>
              <p>Control panel for session facilitators</p>
              <div className="role-features">
                <li>Game controls</li>
                <li>Economic parameters</li>
                <li>Shock events</li>
              </div>
              <Link to="/gm" className="role-button">
                Open GM Panel
              </Link>
            </div>
          </div>

          <div className="quick-start">
            <h3>Quick Start</h3>
            <ol>
              <li><strong>Game Master:</strong> Create and start a game</li>
              <li><strong>Observer:</strong> Display QR code for players</li>
              <li><strong>Players:</strong> Join via QR code or direct link</li>
              <li><strong>Play:</strong> Make decisions and watch the economy evolve</li>
            </ol>
          </div>

          <div className="status-info">
            <h3>System Status</h3>
            <div className="status-checks">
              <div className="status-item">
                <span className="status-label">Backend API:</span>
                <span className="status-value">http://localhost:3100</span>
              </div>
              <div className="status-item">
                <span className="status-label">Frontend:</span>
                <span className="status-value">http://localhost:5173</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="home-footer">
          <p>
            Educational economic simulation exploring post-labor scenarios
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomeView;