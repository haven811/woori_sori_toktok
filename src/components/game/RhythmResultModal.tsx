import { GameStats } from '@/types/game';
import characterImage from '@/assets/character.png';

interface RhythmResultModalProps {
  stats: GameStats;
  onRestart: () => void;
}

const RhythmResultModal = ({ stats, onRestart }: RhythmResultModalProps) => {
  const totalNotes = stats.perfect + stats.great + stats.good + stats.miss;
  const accuracy = totalNotes > 0
    ? ((stats.perfect * 100 + stats.great * 75 + stats.good * 50) / (totalNotes * 100)) * 100
    : 0;

  const getGrade = () => {
    if (accuracy >= 95) return { grade: 'S', color: 'text-yellow-500', emoji: '🏆' };
    if (accuracy >= 85) return { grade: 'A', color: 'text-orange-500', emoji: '🥇' };
    if (accuracy >= 70) return { grade: 'B', color: 'text-amber-600', emoji: '🥈' };
    if (accuracy >= 50) return { grade: 'C', color: 'text-amber-700', emoji: '🥉' };
    return { grade: 'D', color: 'text-red-400', emoji: '💪' };
  };

  const { grade, color, emoji } = getGrade();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 animate-bounce-in">
        <h2 className="text-3xl sm:text-4xl font-game text-amber-700 text-center mb-4">
          🎊 게임 결과 🎊
        </h2>

        {/* 캐릭터 & 등급 */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <img src={characterImage} alt="캐릭터" className="w-24 h-24 object-contain" />
          <div className="text-center">
            <div className={`text-7xl font-game ${color} drop-shadow-lg`}>
              {grade}
            </div>
            <div className="text-3xl">{emoji}</div>
          </div>
        </div>

        {/* 점수 */}
        <div className="bg-amber-200/50 rounded-2xl p-4 mb-4">
          <div className="text-center">
            <span className="text-amber-700 text-lg font-game">최종 점수</span>
            <div className="text-4xl sm:text-5xl font-game text-amber-800 mt-1">
              {Math.floor(stats.score).toLocaleString()}
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-yellow-200 rounded-xl p-2 text-center">
            <div className="text-yellow-700 font-game text-xs">PERFECT</div>
            <div className="text-amber-800 font-game text-xl">{stats.perfect}</div>
          </div>
          <div className="bg-green-200 rounded-xl p-2 text-center">
            <div className="text-green-700 font-game text-xs">GREAT</div>
            <div className="text-amber-800 font-game text-xl">{stats.great}</div>
          </div>
          <div className="bg-blue-200 rounded-xl p-2 text-center">
            <div className="text-blue-700 font-game text-xs">GOOD</div>
            <div className="text-amber-800 font-game text-xl">{stats.good}</div>
          </div>
          <div className="bg-red-200 rounded-xl p-2 text-center">
            <div className="text-red-700 font-game text-xs">MISS</div>
            <div className="text-amber-800 font-game text-xl">{stats.miss}</div>
          </div>
        </div>

        {/* 추가 통계 */}
        <div className="flex justify-around mb-4 text-amber-800 font-game">
          <div className="text-center">
            <div className="text-sm text-amber-600">정확도</div>
            <div className="text-xl">{accuracy.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-amber-600">최대 콤보</div>
            <div className="text-xl">{stats.maxCombo}</div>
          </div>
        </div>

        {/* 재시작 버튼 */}
        <button
          onClick={onRestart}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 
            text-white font-game text-xl rounded-full
            hover:from-amber-600 hover:to-orange-600
            active:scale-95 transition-transform
            shadow-lg border-4 border-white/50"
        >
          다시 하기
        </button>
      </div>
    </div>
  );
};

export default RhythmResultModal;
