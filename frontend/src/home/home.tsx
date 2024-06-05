import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NoData from '../assets/images/NoDataFound.png';
import TicTacToeLogo from '../assets/images/TicTacToeLogo.png';
interface Game {
  _id: string;
  player1: {
    name: string;
    wins: number;
    draws: number;
  };
  player2: {
    name: string;
    wins: number;
    draws: number;
  };
  rounds: number;
}

const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios.get<Game[]>(`${process.env.REACT_APP_API_URL}/games`).then(response => setGames(response.data));
  }, []);

  return (
    <div className='w-full min-h-[90dvh] flex flex-col justify-center items-center pb-24'>
      <div className='mt-10 w-[30%] max-sm:w-[95%] md:w-[70%] max-md:w-[70%] flex justify-center items-center'>
          <img src={TicTacToeLogo} className='w-40 h-40' alt='Tic-Tac-Toe Logo' />
      </div>
      <div className='mt-10 w-[30%] flex justify-center items-center flex-col border-2 p-4 pb-12 max-sm:w-[95%] md:w-[70%] max-md:w-[70%]'>
        <h1 className='text-4xl font-bold text-[#888888] max-sm:text-xl'>Previous Game Data</h1>
        <ul className='mt-4 p-4 max-h-96 overflow-auto max-sm:w-[95%] md:w-[70%] max-md:w-[70%]'>
          {games.length === 0 ? (
            <div className='md:w-[100%] max-md:w-[100%] flex justify-center items-center p-4'>
              <img src={NoData} className='w-52 h-52' alt='NoData Logo' />
            </div>
          ) : (
            games.map(game => (
              <li className='border p-4 flex flex-col justify-start gap-2 tracking-wider text-lg max-sm:gap-2 max-sm:text-sm' key={game._id}>
                <div className='flex justify-center items-center gap-4'>
                  <span>
                    {game.player1.name}
                    <span className='font-semibold text-blue-400'>({game.player1.wins})</span>
                  </span>
                  <span className='font-bold text-[#202020]'> VS </span>
                  <span>
                    {game.player2.name}
                    <span className='font-semibold text-red-400'>({game.player2.wins})</span>
                  </span>
                </div>
                <div className='flex justify-center items-center gap-4'>
                  <span>
                    TIE
                    <span className='font-semibold text-gray-400'>({(game.player1.draws + game.player2.draws) / 2})</span>
                  </span>
                  <span>|</span>
                  {game.rounds} rounds
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className='w-[30%] flex justify-center items-center mt-10 max-sm:w-[95%] md:w-[70%] max-md:w-[70%]'>
        <Link className='w-full text-center rounded-md border-2 border-[#919191] bg-[#353535] pt-6 pb-6 text-2xl font-semibold text-[#ffffff] hover:bg-[#616161]' to="/new">Start New Game</Link>
      </div>
    </div>
  );
};

export default Home;
