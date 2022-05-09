import { useRef, useEffect } from 'react';
import { CANVAS_SIZE, IMAGE_SIZE } from '../../utils/constants';

const frameRenderer = (
  ctx: any, // canvas context
  canvasSize: { width: number; height: number },
  image: HTMLImageElement,
  imgRef: { x: number; y: number }
) => {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

  ctx.drawImage(
    image,
    imgRef.x,
    imgRef.y,
    IMAGE_SIZE * window.devicePixelRatio,
    IMAGE_SIZE * window.devicePixelRatio
  );
};

interface TriggerCanvasProps {
  imgSrc: string;
  triggerLevel: number;
}

const TriggerCanvas = ({ imgSrc, triggerLevel }: TriggerCanvasProps) => {
  const canvasRef = useRef<any>(null);
  const requestIdRef = useRef<any>(null);
  const imgRef = useRef({
    x: 100,
    y: 100,
  });
  const canvasSizeX = CANVAS_SIZE * window.devicePixelRatio;
  const canvaSizeY = CANVAS_SIZE * window.devicePixelRatio;
  const canvasSize = { width: canvasSizeX, height: canvaSizeY };

  const calculateTriggerLevel = (): { x: number; y: number } => {
    if (triggerLevel === 0) return { x: 100, y: 100 };

    const min = Math.ceil(100 - 5 * triggerLevel);
    const max = Math.floor(100 + 5 * triggerLevel);

    const randomX = Math.floor(Math.random() * (max - min) + min);
    const randomY = Math.floor(Math.random() * (max - min) + min);

    return { x: randomX, y: randomY };
  };

  const updatePosition = () => {
    const img = imgRef.current;
    const triggerLevel = calculateTriggerLevel();
    img.x = triggerLevel.x;
    img.y = triggerLevel.y;
  };

  const renderFrame = () => {
    const ctx = canvasRef.current.getContext('2d');
    const image = new Image();
    image.src = imgSrc;
    image.onload = () => {
      ctx.imageSmoothingEnabled = false;
      frameRenderer(ctx, canvasSize, image, imgRef.current);
    };
    updatePosition();
  };

  const tick = () => {
    if (!canvasRef.current) return;
    renderFrame();
    requestIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, [imgSrc, triggerLevel]);

  return <canvas {...canvasSize} ref={canvasRef} />;
};

export default TriggerCanvas;
