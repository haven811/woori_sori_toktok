import { useEffect, useRef, useState } from 'react';

interface TransparentCharacterImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * 검정(또는 거의 검정) 픽셀을 투명하게 변환하여 표시합니다.
 */
const TransparentCharacterImage = ({ src, alt, className = '' }: TransparentCharacterImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();

    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 검정/어두운 픽셀을 투명하게 (임계값: 밝기가 낮으면 alpha를 0으로)
      const threshold = 40; // 0~255, 이보다 어두우면 투명 처리
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        if (brightness <= threshold) {
          data[i + 3] = 0; // alpha
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setLoaded(true);
    };

    img.onerror = () => setLoaded(false);
    img.src = src;
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      className={className}
      style={{ display: loaded ? 'block' : 'none', width: '100%', height: '100%' }}
    />
  );
};

export default TransparentCharacterImage;
