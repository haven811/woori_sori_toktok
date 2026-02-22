import Lottie from 'lottie-react';
import { GamePhase } from '@/types/game';
import characterSvg from '@/assets/character.svg';
import stompLottie from '@/assets/stomp-lottie.json';

interface GameCharacterProps {
  phase: GamePhase;
}

const GameCharacter = ({ phase }: GameCharacterProps) => {
  const isPlaying = phase === 'playing';

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
      {isPlaying ? (
        <Lottie
          animationData={stompLottie}
          loop
          autoplay
          className="w-full h-full"
        />
      ) : (
        <img
          src={characterSvg}
          alt="캐릭터"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      )}
    </div>
  );
};

export default GameCharacter;
