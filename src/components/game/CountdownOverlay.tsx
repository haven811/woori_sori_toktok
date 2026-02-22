import countdown1 from '@/assets/countdown-1.svg';
import countdown2 from '@/assets/countdown-2.svg';
import countdown3 from '@/assets/countdown-3.svg';

interface CountdownOverlayProps {
  value: number;
}

const countdownImages: Record<number, string> = {
  1: countdown1,
  2: countdown2,
  3: countdown3,
};

const CountdownOverlay = ({ value }: CountdownOverlayProps) => {
  if (value <= 0) return null;

  const imgSrc = countdownImages[value];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {imgSrc ? (
        <img
          key={value}
          src={imgSrc}
          alt={`${value}`}
          className="h-48 sm:h-56 md:h-64 object-contain animate-bounce-in drop-shadow-2xl"
        />
      ) : (
        <div
          className="text-9xl font-game text-amber-500 animate-bounce-in drop-shadow-2xl"
          style={{ textShadow: '4px 4px 0px #fff, -2px -2px 0px #fff' }}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default CountdownOverlay;
