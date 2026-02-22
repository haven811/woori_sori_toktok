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

      {/* 판정 영역 원형 타겟 */}
      {['sangmo', 'kkwaenggwari', 'stomp'].map((type) => (
        <div
          key={type}
          className="absolute z-10 pointer-events-none"
          style={{
            left: `${getLanePosition(type)}%`,
            top: `${HIT_LINE_PERCENT}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full
            border-2 border-white/30 bg-white/5
            shadow-[0_0_12px_2px_rgba(255,255,255,0.08),inset_0_0_8px_rgba(255,255,255,0.05)]"
          />
          <div className="absolute inset-0 rounded-full border border-white/10 scale-110" />
        </div>
      ))}

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
