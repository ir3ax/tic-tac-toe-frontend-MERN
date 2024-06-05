import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../components/input/input.tsx'
import { IoChevronBackSharp } from "react-icons/io5";

const NewGame = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const navigate = useNavigate();

  const startGame = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/games`, { player1, player2 }).then(response => {
      navigate(`/game/${response.data._id}`);
    });
  };

  return (
    <div className='w-full h-[90dvh] flex flex-col justify-center items-center'>
      <div className='w-[30%] max-sm:w-[95%] md:w-[50%] max-md:w-[50%]'>
        <button onClick={() => navigate('/')} className='flex justify-start items-start text-lg hover:underline tracking-wide font-semibold text-[#535252]'>
          <IoChevronBackSharp className='w-7 h-7' />
          Back
        </button>
      </div>
      <div className='mt-10 w-[30%] flex flex-col justify-center items-center gap-12 max-h-[60dvh] h-[60dvh] border-2 p-12 max-sm:w-[95%] md:w-[50%] max-md:w-[50%]'>
        <h1 className='text-4xl font-bold text-[#888888] max-sm:text-xl'>New Game</h1>
        <div className='w-full flex flex-col gap-2'>
          <Input
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            placeholder="Player 1 Name"
            type='text'
          />
          <Input
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            placeholder="Player 2 Name"
            type='text'
          />
        </div>
        <button className={`${!player1 || !player2 ? 'opacity-60 disabled:cursor-not-allowed' : null} w-full text-center rounded-md border-2 border-[#919191] bg-[#353535] pt-4 pb-4 text-2xl font-semibold text-[#ffffff] hover:bg-[#616161]`} 
        onClick={startGame}
        disabled={!player1 || !player2}
        >Start
        </button>
      </div>
    </div>
  );
};

export default NewGame;
