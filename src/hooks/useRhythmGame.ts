import { useState, useCallback, useEffect, useRef } from 'react';
import {
  GamePhase,
  Note,
  NoteType,
  GameStats,
  JudgmentType,
  CharacterAction,
  INITIAL_STATS,
  GAME_CONSTANTS,
} from '@/types/game';
import bgmSound from '@/assets/bgm.wav';
import resultSound from '@/assets/result-sound.mp3';
import buttonSound from '@/assets/button-sound.mp3';
import countdownSound from '@/assets/countdown-sound.mp3';

export const useRhythmGame = () => {
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [countdown, setCountdown] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONSTANTS.GAME_DURATION);
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [currentAction, setCurrentAction] = useState<CharacterAction>('idle');
  const [lastJudgment, setLastJudgment] = useState<JudgmentType>(null);

  const noteIdRef = useRef<number>(0);
  const noteSpawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const notesRef = useRef<Note[]>([]);
  const phaseRef = useRef<GamePhase>('ready');

  notesRef.current = notes;
  phaseRef.current = phase;

  const maxTime = GAME_CONSTANTS.GAME_DURATION;
  const noteFallDuration = GAME_CONSTANTS.NOTE_FALL_DURATION;

  const preloadBgm = useCallback(() => {
    if (!bgmRef.current) {
      const audio = new Audio(bgmSound);
      audio.loop = true;
      audio.volume = 0.5;
      audio.preload = 'auto';
      audio.load();
      bgmRef.current = audio;
    }
  }, []);

  const playBgm = useCallback(() => {
    preloadBgm();
    bgmRef.current!.currentTime = 0;
    bgmRef.current!.play().catch(console.error);
  }, [preloadBgm]);

  const stopBgm = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  }, []);

  const playSound = useCallback((src: string, volume = 0.6) => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(console.error);
  }, []);

  const cleanupIntervals = useCallback(() => {
    if (noteSpawnIntervalRef.current) {
      clearInterval(noteSpawnIntervalRef.current);
      noteSpawnIntervalRef.current = null;
    }
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
  }, []);

  const endGameRef = useRef<() => void>(() => {});
  const spawnNoteRef = useRef<() => void>(() => {});
  const startGameRef = useRef<() => void>(() => {});

  spawnNoteRef.current = () => {
    const noteTypes: NoteType[] = ['sangmo', 'kkwaenggwari', 'stomp'];
    const randomType = noteTypes[Math.floor(Math.random() * noteTypes.length)];
    const newNote: Note = {
      id: noteIdRef.current++,
      type: randomType,
      createdAt: Date.now(),
      hit: false,
    };
    setNotes((prev) => [...prev, newNote]);
  };

  endGameRef.current = () => {
    setPhase('result');
    stopBgm();
    playSound(resultSound, 0.7);
    cleanupIntervals();
  };

  startGameRef.current = () => {
    setPhase('playing');
    playBgm();

    spawnNoteRef.current();
    noteSpawnIntervalRef.current = setInterval(() => {
      spawnNoteRef.current();
    }, GAME_CONSTANTS.NOTE_SPAWN_INTERVAL);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGameRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startCountdown = useCallback(() => {
    playSound(buttonSound);
    preloadBgm();
    setPhase('countdown');
    setCountdown(3);
    playSound(countdownSound);

    let count = 3;
    const countdownInterval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        playSound(countdownSound);
      } else {
        clearInterval(countdownInterval);
        startGameRef.current();
      }
    }, 1000);
  }, [playSound, preloadBgm]);

  const calculateJudgment = (timeDiff: number): JudgmentType => {
    const absDiff = Math.abs(timeDiff);
    if (absDiff <= GAME_CONSTANTS.HIT_WINDOW.PERFECT) return 'perfect';
    if (absDiff <= GAME_CONSTANTS.HIT_WINDOW.GREAT) return 'great';
    if (absDiff <= GAME_CONSTANTS.HIT_WINDOW.GOOD) return 'good';
    return 'miss';
  };

  const handlePlayerInput = useCallback(
    (inputType: NoteType) => {
      if (phaseRef.current !== 'playing') return;

      setCurrentAction(inputType as CharacterAction);
      setTimeout(() => setCurrentAction('idle'), 300);

      const now = Date.now();
      const targetTime = noteFallDuration * GAME_CONSTANTS.HIT_LINE_RATIO;

      let closestNote: Note | null = null;
      let closestTimeDiff = Infinity;

      notesRef.current.forEach((note) => {
        if (note.hit || note.type !== inputType) return;
        const noteAge = now - note.createdAt;
        const timeDiff = noteAge - targetTime;

        if (
          Math.abs(timeDiff) < Math.abs(closestTimeDiff) &&
          Math.abs(timeDiff) <= GAME_CONSTANTS.HIT_WINDOW.GOOD + 50
        ) {
          closestTimeDiff = timeDiff;
          closestNote = note;
        }
      });

      if (closestNote) {
        const judgment = calculateJudgment(closestTimeDiff);
        setLastJudgment(judgment);
        setTimeout(() => setLastJudgment(null), 500);

        setNotes((prev) =>
          prev.map((n) =>
            n.id === (closestNote as Note).id
              ? { ...n, hit: true, hitJudgment: judgment, hitTime: Date.now() }
              : n
          )
        );

        setStats((prev) => {
          const newCombo = judgment === 'miss' ? 0 : prev.combo + 1;
          const score =
            judgment === 'perfect'
              ? GAME_CONSTANTS.SCORE.PERFECT
              : judgment === 'great'
              ? GAME_CONSTANTS.SCORE.GREAT
              : judgment === 'good'
              ? GAME_CONSTANTS.SCORE.GOOD
              : 0;

          return {
            ...prev,
            score: prev.score + score * (1 + Math.floor(newCombo / 10) * 0.1),
            [judgment!]: prev[judgment!] + 1,
            combo: newCombo,
            maxCombo: Math.max(prev.maxCombo, newCombo),
          };
        });
      } else {
        setLastJudgment('miss');
        setTimeout(() => setLastJudgment(null), 500);
        setStats((prev) => ({
          ...prev,
          miss: prev.miss + 1,
          combo: 0,
        }));
      }
    },
    [noteFallDuration]
  );

  // Missed notes detection & cleanup
  useEffect(() => {
    if (phase !== 'playing') return;

    const missThreshold =
      noteFallDuration * GAME_CONSTANTS.HIT_LINE_RATIO + GAME_CONSTANTS.HIT_WINDOW.GOOD + 100;

    const interval = setInterval(() => {
      const now = Date.now();
      const currentNotes = notesRef.current;
      let missCount = 0;
      const missedIds: number[] = [];

      currentNotes.forEach((note) => {
        if (note.hit) return;
        const noteAge = now - note.createdAt;
        if (noteAge > missThreshold) {
          missCount++;
          missedIds.push(note.id);
        }
      });

      if (missCount > 0) {
        setNotes((prev) =>
          prev.map((n) => (missedIds.includes(n.id) ? { ...n, hit: true } : n))
        );
        setStats((s) => ({ ...s, miss: s.miss + missCount, combo: 0 }));
      }

      setNotes((prev) =>
        prev.filter((note) => {
          const noteAge = now - note.createdAt;
          return noteAge <= noteFallDuration + 500;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [phase, noteFallDuration]);

  const resetGame = useCallback(() => {
    setPhase('ready');
    setCountdown(3);
    setTimeLeft(GAME_CONSTANTS.GAME_DURATION);
    setNotes([]);
    setStats(INITIAL_STATS);
    setCurrentAction('idle');
    setLastJudgment(null);
    noteIdRef.current = 0;
    stopBgm();
    cleanupIntervals();
  }, [stopBgm, cleanupIntervals]);

  const restartGame = useCallback(() => {
    playSound(buttonSound);
    resetGame();
  }, [resetGame, playSound]);

  useEffect(() => {
    preloadBgm();
    return () => {
      stopBgm();
      cleanupIntervals();
    };
  }, [preloadBgm, stopBgm, cleanupIntervals]);

  return {
    phase,
    countdown,
    timeLeft,
    maxTime,
    notes,
    stats,
    currentAction,
    lastJudgment,
    noteFallDuration,
    startCountdown,
    handlePlayerInput,
    restartGame,
  };
};
