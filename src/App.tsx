import GameCharacter from '@/components/game/GameCharacter';
import ActionButton from '@/components/game/ActionButton';
import TimerBar from '@/components/game/TimerBar';
import ScoreDisplay from '@/components/game/ScoreDisplay';
import CountdownOverlay from '@/components/game/CountdownOverlay';
import FallingNotes from '@/components/game/FallingNotes';
import JudgmentDisplay from '@/components/game/JudgmentDisplay';
import RhythmResultModal from '@/components/game/RhythmResultModal';
import { useRhythmGame } from '@/hooks/useRhythmGame';
import backgroundImage from '@/assets/background.png';
import logoImage from '@/assets/logo.png';

const App = () => {
  const {
    phase,
    countdown,
    timeLeft,
    maxTime,
    notes,
    stats,
    lastJudgment,
    noteFallDuration,
    startCountdown,
    handlePlayerInput,
    restartGame,
  } = useRhythmGame();

  const isInputDisabled = phase !== 'playing';

  return (
    <div
      className="h-screen flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 타이틀 / 상태 바 영역 */}
      <header className="flex flex-col items-center pt-6 sm:pt-10 pb-3 relative z-10 shrink-0">
        {phase === 'playing' ? (
          <div className="w-full flex items-center justify-between px-4 gap-4">
            <TimerBar timeLeft={timeLeft} maxTime={maxTime} />
            <ScoreDisplay score={stats.score} />
          </div>
        ) : (
          <div className="text-center">
            <img
              src={logoImage}
              alt="우리소리톡톡"
              className="h-20 sm:h-24 md:h-28 object-contain mx-auto drop-shadow-lg"
            />
          </div>
        )}
      </header>

      {/* 메인 게임 영역 */}
      <main className="flex-1 flex flex-col items-center relative min-h-0">
        {/* 리듬 노트 영역 */}
        {phase === 'playing' && (
          <div className="absolute inset-0">
            <FallingNotes notes={notes} fallDuration={noteFallDuration} />
          </div>
        )}

        {phase === 'playing' ? (
          <>
            {/* 판별선 위 여백 */}
            <div className="flex-1" />
            {/* 캐릭터 - 판별선 아래, 버튼 위 */}
            <div className="relative z-10 shrink-0 flex justify-center pb-1">
              <div className="scale-[0.65] sm:scale-[0.78] origin-bottom relative">
                <GameCharacter phase={phase} />
                <JudgmentDisplay judgment={lastJudgment} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 flex justify-center items-center">
              <GameCharacter phase={phase} />
            </div>
            {phase === 'ready' && (
              <button
                onClick={startCountdown}
                className="mb-8 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-2xl
                  hover:scale-105 active:scale-95 transition-transform shadow-lg
                  animate-pulse-glow font-game border-4 border-white/50"
              >
                게임 시작
              </button>
            )}
          </>
        )}
      </main>

      {/* 액션 버튼 영역 */}
      {phase === 'playing' && (
        <footer className="p-3 sm:p-5 relative z-20 shrink-0 bg-gradient-to-t from-black/30 to-transparent">
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
            <ActionButton
              type="sangmo"
              onClick={() => handlePlayerInput('sangmo')}
              disabled={isInputDisabled}
            />
            <ActionButton
              type="kkwaenggwari"
              onClick={() => handlePlayerInput('kkwaenggwari')}
              disabled={isInputDisabled}
            />
            <ActionButton
              type="shoes"
              onClick={() => handlePlayerInput('stomp')}
              disabled={isInputDisabled}
            />
          </div>
        </footer>
      )}

      {/* 오버레이 */}
      {phase === 'countdown' && <CountdownOverlay value={countdown} />}

      {phase === 'result' && (
        <RhythmResultModal stats={stats} onRestart={restartGame} />
      )}
    </div>
  );
};

export default App;
