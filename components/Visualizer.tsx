import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { TOMBSTONE_IMAGE_URL, GRID_CONFIG } from '../constants';
import { FloatingText } from '../types';

interface Props {
  mode: 'sprite' | 'video' | 'static';
  src: string | null;
  isDead: boolean;
  visualHpPercentage: number;
  effectType: string | null;
  flashColor: string | null;
  floatingTexts: FloatingText[];
}

// Math Constants for 2x2 Grid with Zoom
// Zoom 1.1x to ensure no border bleed from adjacent sprites
const ZOOM = 1.1; 
const COLS = GRID_CONFIG.COLS;
const ROWS = GRID_CONFIG.ROWS;

// Dynamic offset calculation based on grid dimensions and zoom
const getSpriteTransform = (hpPercentage: number): React.CSSProperties => {
  // 0: 100-76%, 1: 75-51%, 2: 50-26%, 3: 25-0%
  let stateIndex = 3;
  if (hpPercentage > 75) stateIndex = 0;
  else if (hpPercentage > 50) stateIndex = 1;
  else if (hpPercentage > 25) stateIndex = 2;

  const col = stateIndex % COLS;
  const row = Math.floor(stateIndex / COLS);

  // The CSS translation moves the image so that the target quadrant (row, col) is centered in the container.
  // We apply a scale (ZOOM) to the container's content.
  // Formula derived: xPercent = -100 * ( (0.5 / (COLS * ZOOM)) - ( (col + 0.5) / COLS ) )
  // Simplified: -100 * (0.5 - ZOOM*(col + 0.5)) / (COLS * ZOOM) is relative to element width.
  // Let's use the explicit calculated offsets to be precise.
  
  const xPercent = -100 * ( (col + 0.5) / COLS - (0.5 / (COLS * ZOOM)) );
  const yPercent = -100 * ( (row + 0.5) / ROWS - (0.5 / (ROWS * ZOOM)) );

  return {
      width: `${100 * COLS * ZOOM}%`,
      height: `${100 * ROWS * ZOOM}%`,
      maxWidth: 'none',
      transform: `translate(${xPercent}%, ${yPercent}%)`,
      imageRendering: 'pixelated', // crisp edges for sprites
      willChange: 'transform',
  };
};

const Visualizer: React.FC<Props> = ({ 
  mode, 
  src, 
  isDead, 
  visualHpPercentage, 
  effectType, 
  flashColor, 
  floatingTexts
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State for Sprite Transition
  const [activeTransform, setActiveTransform] = useState<React.CSSProperties>(() => getSpriteTransform(visualHpPercentage));
  const [prevTransform, setPrevTransform] = useState<React.CSSProperties>(() => getSpriteTransform(visualHpPercentage));
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle Sprite Transition Logic
  useEffect(() => {
    if (mode !== 'sprite') return;

    const targetTransform = getSpriteTransform(visualHpPercentage);
    
    // Check if transform changed significantly (string comparison is enough for styles)
    if (JSON.stringify(targetTransform) !== JSON.stringify(activeTransform)) {
        setPrevTransform(activeTransform); // Keep showing old state
        setActiveTransform(targetTransform); // Prepare new state
        setIsTransitioning(true);

        const timer = setTimeout(() => {
            setIsTransitioning(false);
            setPrevTransform(targetTransform); // Sync up
        }, 400); // Match CSS transition duration

        return () => clearTimeout(timer);
    }
  }, [visualHpPercentage, mode, activeTransform]);

  // Handle Video Scrubbing
  useEffect(() => {
    if (isDead || mode !== 'video' || !videoRef.current) return;
    const vid = videoRef.current;
    
    const updateVideoFrame = () => {
        if (!Number.isFinite(vid.duration)) return;
        const damageRatio = 1 - (visualHpPercentage / 100);
        // Clamp to ensure we don't seek past end
        const safeRatio = Math.max(0.001, Math.min(0.999, damageRatio));
        vid.currentTime = vid.duration * safeRatio;
    };
    
    updateVideoFrame();
    // Re-check in case metadata wasn't loaded
    if (vid.readyState < 2) {
        vid.onloadedmetadata = updateVideoFrame;
    }
  }, [mode, visualHpPercentage, isDead]);

  const animationClass = {
    'physical': 'animate-impact-shake',
    'elemental': 'animate-elemental-shock',
    'energy': 'animate-energy-surge',
    'chemical': 'animate-chemical-melt',
    'healing': 'animate-divine-light'
  }[effectType || ''] || '';

  if (isDead) {
    return (
      <div className={`flex flex-col items-center justify-center animate-fade-in w-full h-full relative overflow-hidden bg-black ${animationClass}`}>
        <img 
          src={TOMBSTONE_IMAGE_URL} 
          alt="R.I.P." 
          className="max-h-[80vh] object-contain grayscale opacity-60 mix-blend-luminosity z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <h2 className="text-6xl font-black font-cinzel text-red-900 uppercase tracking-widest drop-shadow-[0_0_20px_rgba(0,0,0,1)] border-y-4 border-red-900/50 p-8 bg-black/80 backdrop-blur-sm -rotate-6">
            Vanquished
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex items-center justify-center relative ${animationClass}`}>
      
      {/* Visual Content Layer */}
      {mode === 'sprite' && src ? (
        <div className="aspect-square h-full max-w-full relative bg-gray-950 rounded-lg shadow-2xl overflow-hidden border border-gray-900">
          
          {/* Base Layer (Transitioning From) */}
          <div className="absolute inset-0 overflow-hidden">
             <img 
               src={src} 
               alt="" 
               style={isTransitioning ? prevTransform : activeTransform} 
               className="absolute top-0 left-0 max-w-none" 
             />
          </div>

          {/* Overlay Layer (Transitioning To) */}
          <div 
              className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
          >
              <img 
                src={src} 
                alt="Character Vitality Sprite" 
                style={activeTransform} 
                className="absolute top-0 left-0 max-w-none" 
              />
          </div>

          {/* Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-10"></div>
        </div>
      ) : mode === 'video' && src ? (
        <video 
          ref={videoRef}
          src={src}
          className="max-h-full max-w-full object-contain shadow-2xl drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-black rounded-lg"
          muted
          playsInline
        />
      ) : src ? (
         // Fallback/Static Mode
         <img src={src} className="max-h-full max-w-full object-contain shadow-2xl rounded-lg" alt="Character" />
      ) : (
        <div className="text-stone-700 flex flex-col items-center gap-4">
          <ImageIcon className="w-16 h-16 opacity-20"/>
          <p className="font-cinzel text-sm opacity-50">No visual asset bound.</p>
        </div>
      )}

      {/* Dynamic Flash Overlay */}
      {flashColor && (
         <div 
            className="absolute inset-0 z-40 pointer-events-none animate-flash-generic mix-blend-overlay"
            style={{ backgroundColor: flashColor }}
         ></div>
      )}

      {/* Floating Text Overlay */}
      {floatingTexts.map(ft => (
        <div 
          key={ft.id}
          className={`absolute z-50 font-cinzel font-black text-6xl md:text-8xl tracking-widest pointer-events-none animate-float-up drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] opacity-90 ${ft.color}`}
          style={{ left: `${ft.left}%`, top: `${ft.top}%`, textShadow: '0 0 10px rgba(0,0,0,1)' }}
        >
          {ft.text}
        </div>
      ))}
    </div>
  );
};

export default Visualizer;