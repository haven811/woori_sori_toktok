import { JudgmentType } from '@/types/game';

interface JudgmentDisplayProps {
  judgment: JudgmentType;
}

const JudgmentDisplay = ({ judgment }: JudgmentDisplayProps) => {
  if (!judgment) return null;

  const getJudgmentStyle = () => {
    switch (judgment) {
      case 'perfect':
        return 'text-yellow-500 animate-bounce-in';
      case 'great':
        return 'text-green-500 animate-bounce-in';
      case 'good':
        return 'text-blue-500 animate-bounce-in';
      case 'miss':
        return 'text-red-400 animate-shake';
      default:
        return '';
    }
  };

  const getJudgmentText = () => {
    switch (judgment) {
      case 'perfect':
        return 'PERFECT!';
      case 'great':
        return 'GREAT!';
      case 'good':
        return 'GOOD!';
      case 'miss':
        return 'MISS...';
      default:
        return '';
    }
  };

  return (
    <div
      className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-20
        font-game text-3xl sm:text-4xl font-bold
        ${getJudgmentStyle()}`}
      style={{ textShadow: '2px 2px 0px #fff, -1px -1px 0px #fff' }}
    >
      {getJudgmentText()}
    </div>
  );
};

export default JudgmentDisplay;
