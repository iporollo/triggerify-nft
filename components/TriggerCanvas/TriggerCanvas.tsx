import { useRef, useEffect } from 'react';
import GIF from 'gif.js';
import { CANVAS_SIZE, IMAGE_SIZE } from '../../utils/constants';
import GIF_WORKER_STRING from '../../utils/gifWorker';

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
  isSaving: boolean;
}

const TriggerCanvas = ({
  imgSrc,
  triggerLevel,
  isSaving,
}: TriggerCanvasProps) => {
  const canvasRef = useRef<any>(null);
  const requestIdRef = useRef<any>(null);
  const imgRef = useRef({
    x: 100,
    y: 100,
  });
  const gifRef = useRef<any>({ frames: 0, isRendering: false });
  const canvasSizeX = CANVAS_SIZE * window.devicePixelRatio;
  const canvaSizeY = CANVAS_SIZE * window.devicePixelRatio;
  const canvasSize = { width: canvasSizeX, height: canvaSizeY };

  const workerBlob = new Blob([GIF_WORKER_STRING], {
    type: 'application/javascript',
  });

  const gif = new GIF({
    workers: 2,
    workerScript: URL.createObjectURL(workerBlob),
    quality: 10,
    width: canvasSizeX,
    height: canvaSizeY,
    background: 'rgba(0,0,0,0)',
  });

  gif.on('finished', function (blob) {
    console.log('Finished rendering GIF');
    const tempLink = document.createElement('a');
    tempLink.href = URL.createObjectURL(blob);
    tempLink.setAttribute('download', 'filename.gif');
    tempLink.click();
  });

  gif.on('progress', function (percent: number) {
    console.log('progress', percent);
  });

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
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      ctx.imageSmoothingEnabled = false;
      frameRenderer(ctx, canvasSize, image, imgRef.current);
    };
    if (isSaving && gifRef.current.frames < 300) {
      gif.addFrame(ctx, { copy: true, delay: 20 });
      gifRef.current.frames++;
    } else if (gifRef.current.frames === 300 && !gifRef.current.isRendering) {
      gif.render();
      gifRef.current.isRendering = true;
    }
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
  }, [imgSrc, triggerLevel, isSaving]);

  return <canvas {...canvasSize} ref={canvasRef} />;
};

export default TriggerCanvas;
