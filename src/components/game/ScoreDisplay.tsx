interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-2 rounded-full shadow-lg border-2 border-white/50">
      <span className="text-xl sm:text-2xl">⭐</span>
      <span className="text-white font-game text-xl sm:text-2xl font-bold drop-shadow">
        {Math.floor(score).toLocaleString()}
      </span>
    </div>
  );
};

export default ScoreDisplay;
