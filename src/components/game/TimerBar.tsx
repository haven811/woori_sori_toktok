interface TimerBarProps {
  timeLeft: number;
  maxTime: number;
}

const TimerBar = ({ timeLeft, maxTime }: TimerBarProps) => {
  const percentage = (timeLeft / maxTime) * 100;
  
  const getBarColor = () => {
    if (percentage > 50) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (percentage > 25) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  return (
    <div className="flex items-center gap-3 flex-1 max-w-md">
      <div className="text-amber-700 font-game text-lg sm:text-xl">⏱️</div>
      <div className="flex-1 h-4 sm:h-5 bg-white/50 rounded-full overflow-hidden shadow-inner border-2 border-amber-400">
        <div
          className={`h-full ${getBarColor()} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-amber-700 font-game text-lg sm:text-xl min-w-[40px] text-right font-bold">
        {timeLeft}s
      </div>
    </div>
  );
};

export default TimerBar;
