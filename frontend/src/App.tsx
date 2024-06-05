import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/home.tsx'
import NewGame from './newGame/newGame.tsx';
import Game from './game/game.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewGame />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
