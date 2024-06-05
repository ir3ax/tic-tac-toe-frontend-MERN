import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Player {
  name: string;
  wins: number;
  losses: number;
  draws: number;
}

interface GameData {
  player1: Player;
  player2: Player;
  rounds: number;
}

const Game: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameData | null>(null);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);

  useEffect(() => {
    axios.get<GameData>(`http://localhost:5000/games/${id}`).then(response => {
      const gameData = response.data;
      setGame({ ...gameData, rounds: gameData.rounds || 1 });
    });
  }, [id]);

  const handleMove = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = board.slice();
    newBoard[index] = isPlayer1Turn ? 'X' : 'O';
    setBoard(newBoard);
    setIsPlayer1Turn(!isPlayer1Turn);
  };

  const calculateWinner = (board: (string | null)[]) => {
    const lines: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const endGame = () => {
    if (game) {
      const winner = calculateWinner(board);
      if (winner) {
        if (winner === 'X') {
          game.player1.wins++;
          game.player2.losses++;
        } else {
          game.player2.wins++;
          game.player1.losses++;
        }
      } else {
        game.player1.draws++;
        game.player2.draws++;
      }
  
      axios.put(`http://localhost:5000/games/${id}`, game).then(() => {
        navigate('/');
      });
    }
  };

  const continueGame = () => {
    const winner = calculateWinner(board);
    if (winner) {
      if (winner === 'X' && game) {
        game.player1.wins++;
        game.player2.losses++;
      } else if (game) {
        game.player2.wins++;
        game.player1.losses++;
      }
    } else if (!board.includes(null) && game) {
      game.player1.draws++;
      game.player2.draws++;
    }

    if (game) {
      game.rounds++;
      setGame(game);
      setBoard(Array(9).fill(null));
      setIsPlayer1Turn(true);

      axios.put<GameData>(`http://localhost:5000/games/${id}`, game).then(response => {
        setGame(response.data);
      });
    }
  };

  if (!game) return <div>Loading...</div>;

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = 'Winner: ' + (winner === 'X' ? game.player1.name : game.player2.name);
  } else if (!board.includes(null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (isPlayer1Turn ? game.player1.name : game.player2.name);
  }

  return (
    <div className='w-full flex justify-center items-center flex-col gap-4'>
      <p className='mt-4 text-xl'>{status}</p>
      <h1 className=''>{game.player1.name} vs {game.player2.name}</h1>
      <div className='grid grid-cols-3 gap-4'>
        {board.map((value, index) => (
          <button key={index} onClick={() => handleMove(index)} className="boxes flex justify-center items-center h-36 w-36 bg-gray-700 border-4 border-gray-900 rounded-lg cursor-pointer">
            <span className='text-6xl font-bold text-white'>{value}</span>
          </button>
        ))}
      </div>
      <div className='py-4 flex justify-evenly items-center w-[25%] gap-4'>
        <button onClick={endGame} className='flex justify-start w-full border rounded-md p-4 hover:bg-red-400'>
          <span className='text-center w-full'>Stop</span>
        </button>
        <button onClick={continueGame} className='flex justify-start w-full border rounded-md p-4 hover:bg-blue-400'>
          <span className='text-center w-full'>Continue</span>
        </button>
      </div>
    </div>
  );
};

export default Game;
