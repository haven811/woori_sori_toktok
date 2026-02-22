import { useState, useEffect, useMemo } from 'react';
import { Note, GAME_CONSTANTS } from '@/types/game';
import sangmoButton from '@/assets/button-sangmo.png';
import kkwaenggwariButton from '@/assets/button-kkwaenggwari.png';
import shoesButton from '@/assets/button-shoes.png';

interface FallingNotesProps {
  notes: Note[];
  fallDuration: number;
}

const HIT_LINE_PERCENT = GAME_CONSTANTS.HIT_LINE_RATIO * 100;

const getLanePosition = (type: string) => {
  switch (type) {
    case 'sangmo': return 20;
    case 'kkwaenggwari': return 50;
    case 'stomp': return 80;
    default: return 50;
  }
};

const getNoteImage = (type: string) => {
  switch (type) {
    case 'sangmo': return sangmoButton;
    case 'kkwaenggwari': return kkwaenggwariButton;
    case 'stomp': return shoesButton;
    default: return '';
  }
};

const PARTICLE_SYMBOLS = ['♪', '♫', '♩', '♬', '✦', '♪', '♫', '✦'];

interface ParticleConfig {
  symbol: string;
  angle: number;
  distance: number;
  delay: number;
  size: number;
}

const generateParticles = (noteId: number): ParticleConfig[] => {
  const seed = noteId * 7;
  return PARTICLE_SYMBOLS.map((symbol, i) => ({
    symbol,
    angle: (i * 45) + ((seed + i * 13) % 30) - 15,
    distance: 40 + ((seed + i * 17) % 30),
    delay: ((seed + i * 11) % 150),
    size: 10 + ((seed + i * 7) % 8),
  }));
};

const NoteParticles = ({ noteId }: { noteId: number }) => {
  const particles = useMemo(() => generateParticles(noteId), [noteId]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;

        return (
          <span
            key={i}
            className="note-particle absolute left-1/2 top-1/2"
            style={{
              fontSize: `${p.size}px`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              animationDelay: `${p.delay}ms`,
            } as React.CSSProperties}
          >
            {p.symbol}
          </span>
        );
      })}
    </div>
  );
};

const FallingNotes = ({ notes, fallDuration }: FallingNotesProps) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let animId: number;
    const update = () => {
      setNow(Date.now());
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 레인 구분선 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute h-full w-px bg-white/8" style={{ left: '20%' }} />
        <div className="absolute h-full w-px bg-white/8" style={{ left: '50%' }} />
        <div className="absolute h-full w-px bg-white/8" style={{ left: '80%' }} />
      </div>

      {/* 히트라인 글로우 영역 */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ top: `${HIT_LINE_PERCENT - 6}%`, height: '12%' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/20 to-transparent" />
      </div>

      {/* 히트라인 (2배 두껍게) */}
      <div
        className="absolute left-0 right-0 z-10"
        style={{ top: `${HIT_LINE_PERCENT}%`, transform: 'translateY(-50%)' }}
      >
        <div className="h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-90" />
        <div className="h-[2px] bg-white/40" />
      </div>

      {/* 히트라인 블러 글로우 (2배) */}
      <div
        className="absolute left-0 right-0 h-4 bg-amber-400/25 blur-lg z-10"
        style={{ top: `${HIT_LINE_PERCENT}%`, transform: 'translateY(-50%)' }}
      />

      {/* 히트라인 아래 어둡게 */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{ top: `${HIT_LINE_PERCENT + 2}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/30 backdrop-blur-[1px]" />
      </div>

      {/* 노트들 */}
      {notes.map((note) => {
        const elapsed = now - note.createdAt;
        const progress = elapsed / fallDuration;
        const topPercent = progress * 100;

        if (topPercent > 115) return null;

        const isSuccessHit =
          note.hit &&
          note.hitJudgment &&
          note.hitJudgment !== 'miss' &&
          note.hitTime != null;

        const showParticles =
          isSuccessHit && now - note.hitTime! < 1000;

        return (
          <div
            key={note.id}
            className="absolute"
            style={{
              left: `${getLanePosition(note.type)}%`,
              top: `${topPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-lg
                ${note.hit ? 'note-hit-effect' : ''}`}
            >
              <img
                src={getNoteImage(note.type)}
                alt={note.type}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            {showParticles && <NoteParticles noteId={note.id} />}
          </div>
        );
      })}
    </div>
  );
};

export default FallingNotes;
