import { Route, Routes } from 'react-router-dom';
import HomeView from './views/Home/HomeView';
import ObserverView from './views/Observer/ObserverView';
import PlayerView from './views/Player/PlayerView';
import GMView from './views/GM/GMView';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/observer/:id" element={<ObserverView />} />
        <Route path="/player/:id" element={<PlayerView />} />
        <Route path="/gm/:id" element={<GMView />} />
        <Route path="/gm" element={<GMView />} />
      </Routes>
    </div>
  );
}

export default App;
