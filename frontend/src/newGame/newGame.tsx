import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewGame = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const navigate = useNavigate();

  const startGame = () => {
    axios.post('http://localhost:5000/games', { player1, player2 }).then(response => {
      navigate(`/game/${response.data._id}`);
    });
  };

  return (
    <div>
      <h1>New Game</h1>
      <input
        type="text"
        placeholder="Player 1 Name"
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
      />
      <input
        type="text"
        placeholder="Player 2 Name"
        value={player2}
        onChange={(e) => setPlayer2(e.target.value)}
      />
      <button onClick={startGame}>Start</button>
    </div>
  );
};

export default NewGame;
