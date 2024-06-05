import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IoChevronBackSharp } from "react-icons/io5";
import ClickSound from '../assets/audio/click.wav'
import VictorySound from '../assets/audio/victory.mp3'
import DrawSound from '../assets/audio/draw.mp3';
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
  const [isRoundEnded, setIsRoundEnded] = useState(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  useEffect(() => {
    axios.get<GameData>(`${process.env.REACT_APP_API_URL}/games/${id}`).then(response => {
      const gameData = response.data;
      setGame({ ...gameData, rounds: gameData.rounds || 1 });
    });
  }, [id]);

  const handleMove = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const clickSound = new Audio(ClickSound);
    clickSound.play();

    const newBoard = board.slice();
    newBoard[index] = isPlayer1Turn ? 'X' : 'O';
    setBoard(newBoard);
    setIsPlayer1Turn(!isPlayer1Turn);

    const winnerInfo = calculateWinner(newBoard);
    if (winnerInfo || !newBoard.includes(null)) {
      setIsRoundEnded(true);
      if (winnerInfo) {
        setWinningLine(winnerInfo.line);
        const victorySound = new Audio(VictorySound);
        victorySound.play();
      }else {
        const drawSound = new Audio(DrawSound);
        drawSound.play();
      }
    }
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
        return { winner: board[a], line: lines[i] };
      }
    }
    return null;
  };

  const endGame = () => {
    setIsRoundEnded(false);
    setWinningLine(null);
    if (game) {
      const winnerInfo = calculateWinner(board);
      if (winnerInfo) {
        if (winnerInfo.winner === 'X') {
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

      axios.put(`${process.env.REACT_APP_API_URL}/games/${id}`, game).then(() => {
        navigate('/');
      });
    }
  };

  const continueGame = () => {
    setIsRoundEnded(false);
    setWinningLine(null);
    const winnerInfo = calculateWinner(board);
    if (winnerInfo) {
      if (winnerInfo.winner === 'X' && game) {
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

      axios.put<GameData>(`${process.env.REACT_APP_API_URL}/games/${id}`, game).then(response => {
        setGame(response.data);
      });
    }
  };

  if (!game) return <div>Loading...</div>;

  const winnerInfo = calculateWinner(board);
  let status;
  if (winnerInfo) {
    status = 'Winner: ' + (winnerInfo.winner === 'X' ? game.player1.name : game.player2.name);
  } else if (!board.includes(null)) {
    status = 'Draw';
  } else {
    status = (isPlayer1Turn ? game.player1.name : game.player2.name) + ' Turn';
  }

  const handleBack = () => {
    setIsRoundEnded(false);
    setWinningLine(null);
    if (game) {
      const winnerInfo = calculateWinner(board);
      if (winnerInfo) {
        if (winnerInfo.winner === 'X') {
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

      axios.put(`${process.env.REACT_APP_API_URL}/games/${id}`, game).then(() => {
        navigate('/new');
      });
    }
  }

  return (
    <div className='w-full min-h-[90dvh] flex justify-center items-center flex-col gap-4 pt-6'>
      <div className='w-[30%] max-sm:w-[95%] md:w-[70%] max-md:w-[70%]'>
        <button onClick={handleBack} className='flex justify-start items-start text-lg hover:underline tracking-wide font-semibold text-[#535252]'>
          <IoChevronBackSharp className='w-7 h-7' />
          Back
        </button>
      </div>
      <div className='flex justify-center items-center gap-4 w-[30%] max-sm:w-[95%] max-sm:gap-0 md:w-[70%] max-md:w-[70%]'>
        <div className='border-2 p-2 rounded-xl w-full flex flex-col justify-center items-center gap-1'>
          <h1 className='text-xl font-semibold text-blue-400'>{game.player1.name}</h1>
          <h1 className='text-xl font-semibold text-gray-500'>( {game.player1.wins} )</h1>
        </div>
        <div className='p-4 w-full flex flex-col justify-center items-center gap-1'>
          <h1 className='text-xl font-semibold'>TIE</h1>
          <h1 className='text-xl font-semibold text-gray-500'>( {(game.player1.draws + game.player2.draws) / 2} )</h1>
        </div>
        <div className='border-2 p-2 rounded-xl w-full flex flex-col justify-center items-center gap-1'>
          <h1 className='text-xl font-semibold text-red-400'>{game.player2.name}</h1>
          <h1 className='text-xl font-semibold text-gray-500'>( {game.player2.wins} )</h1>
        </div>
      </div>
      <p className='mt-4 text-xl'>{status}</p>
      <div className='grid grid-cols-3 gap-4'>
        {board.map((value, index) => (
          <button key={index} onClick={() => handleMove(index)} className={`h-36 w-36 max-sm:w-24 max-sm:h-24 flex justify-center items-center bg-gray-700 border-4 border-gray-900 rounded-lg cursor-pointer ${winningLine && winningLine.includes(index) ? 'bg-slate-300 border-slate-500' : ''}`}>
            <span className={`text-6xl font-extrabold ${value === 'X' ? 'text-blue-400' : 'text-red-400'}`}>{value}</span>
          </button>
        ))}
      </div>
      {
        isRoundEnded ?
        <div className='py-4 flex justify-evenly items-center w-[30%] gap-4 max-sm:w-[95%] md:w-[70%] max-md:w-[70%]'>
          <button onClick={endGame} className='flex justify-start w-full border-2 rounded-md p-4 hover:bg-red-400'>
            <span className='text-center w-full font-bold'>Stop</span>
          </button>
          <button onClick={continueGame} className='flex justify-start w-full border-2 rounded-md p-4 hover:bg-blue-400'>
            <span className='text-center w-full font-bold'>Continue</span>
          </button>
        </div>
        :
        null
      }
    </div>
  );
};

export default Game;
