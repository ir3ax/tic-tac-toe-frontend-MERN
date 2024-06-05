import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Game {
  _id: string;
  player1: {
    name: string;
    wins: number;
  };
  player2: {
    name: string;
    wins: number;
  };
  rounds: number;
}

const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios.get<Game[]>('http://localhost:5000/games').then(response => setGames(response.data));
  }, []);

  return (
    <div>
      <h1 className='border p-4 w-full h-12 bg-slate-400'>Previous Games</h1>
      <ul>
        {games.map(game => (
          <li key={game._id}>
            {game.player1.name}({game.player1.wins}) vs {game.player2.name}({game.player2.wins}) - {game.rounds} rounds
          </li>
        ))}
      </ul>
      <Link to="/new">Start New Game</Link>
    </div>
  );
};

export default Home;
