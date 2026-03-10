const NOTES = [
  {
    id: 1,
    fill: '#D96050',
    type: 'double' as const,
    left: '8%', top: '12%',
    size: 0.7,
    duration: 6.2,
    delay: 0,
    drift: 12,
  },
  {
    id: 2,
    fill: '#D87565',
    type: 'flag' as const,
    left: '62%', top: '8%',
    size: 0.65,
    duration: 7.5,
    delay: 1.2,
    drift: 10,
  },
  {
    id: 3,
    fill: '#D66050',
    type: 'double' as const,
    left: '22%', top: '38%',
    size: 0.6,
    duration: 5.8,
    delay: 0.5,
    drift: 14,
  },
  {
    id: 4,
    fill: '#C85040',
    type: 'flag' as const,
    left: '38%', top: '42%',
    size: 0.5,
    duration: 8.0,
    delay: 2.0,
    drift: 8,
  },
  {
    id: 5,
    fill: '#D87050',
    type: 'double' as const,
    left: '52%', top: '32%',
    size: 0.6,
    duration: 6.8,
    delay: 1.5,
    drift: 11,
  },
  {
    id: 6,
    fill: '#D88055',
    type: 'double' as const,
    left: '72%', top: '28%',
    size: 0.55,
    duration: 7.2,
    delay: 0.8,
    drift: 13,
  },
  {
    id: 7,
    fill: '#D89060',
    type: 'flag' as const,
    left: '82%', top: '18%',
    size: 0.58,
    duration: 6.5,
    delay: 2.5,
    drift: 9,
  },
  {
    id: 8,
    fill: '#E06055',
    type: 'flag' as const,
    left: '6%', top: '65%',
    size: 0.7,
    duration: 7.0,
    delay: 3.0,
    drift: 10,
  },
  {
    id: 9,
    fill: '#C89030',
    type: 'flag' as const,
    left: '85%', top: '52%',
    size: 0.65,
    duration: 5.5,
    delay: 1.8,
    drift: 15,
  },
];

const DoubleNote = ({ fill }: { fill: string }) => (
  <svg viewBox="-5 -80 70 95" width="70" height="95">
    <g fill={fill}>
      <ellipse cx="0" cy="0" rx="11" ry="7.5" transform="rotate(-25)" />
      <rect x="9.5" y="-52" width="3" height="52" rx="1.5" />
      <ellipse cx="44" cy="-19" rx="11" ry="7.5" transform="rotate(-25,44,-19)" />
      <rect x="53.5" y="-71" width="3" height="52" rx="1.5" />
      <polygon points="9.5,-52 53.5,-71 56.5,-71 12.5,-52" />
      <polygon points="9.5,-43 53.5,-62 56.5,-62 12.5,-43" />
    </g>
  </svg>
);

const FlagNote = ({ fill }: { fill: string }) => (
  <svg viewBox="-5 -60 40 70" width="40" height="70">
    <g fill={fill}>
      <ellipse cx="0" cy="0" rx="11" ry="7.5" transform="rotate(-25)" />
      <rect x="9.5" y="-52" width="3" height="52" rx="1.5" />
      <path d="M12.5,-52 C32,-49 38,-36 30,-23 C24,-14 27,-5 17,-1 C25,-5 27,-15 22,-25 C16,-35 14,-45 12.5,-52Z" />
    </g>
  </svg>
);

const FloatingNotes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {NOTES.map((note) => (
        <div
          key={note.id}
          className="absolute floating-note"
          style={{
            left: note.left,
            top: note.top,
            transform: `scale(${note.size})`,
            opacity: 0.35,
            animationDuration: `${note.duration}s`,
            animationDelay: `${note.delay}s`,
            '--drift': `${note.drift}px`,
          } as React.CSSProperties}
        >
          {note.type === 'double' ? (
            <DoubleNote fill={note.fill} />
          ) : (
            <FlagNote fill={note.fill} />
          )}
        </div>
      ))}
    </div>
  );
};

export default FloatingNotes;
