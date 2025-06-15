import { Route, Routes } from 'react-router-dom';
import ObserverView from './views/Observer/ObserverView';
import PlayerView from './views/Player/PlayerView';
import GMView from './views/GM/GMView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ObserverView />} />
      <Route path="/player/:id" element={<PlayerView />} />
      <Route path="/gm" element={<GMView />} />
    </Routes>
  );
}

export default App;
