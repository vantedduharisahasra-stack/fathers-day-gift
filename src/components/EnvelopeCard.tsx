/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, RefreshCw, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { audio } from './AudioEngine';
import { GreetingCardData } from '../types';
import { DEFAULT_PHOTOS } from '../constants';

interface EnvelopeCardProps {
  cardData: GreetingCardData;
  selectedPhotoUrl: string;
  onResetToPuzzle: () => void;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({
  cardData,
  selectedPhotoUrl,
  onResetToPuzzle,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [revealConfetti, setRevealConfetti] = useState<boolean>(false);
  
  // Track swipe state for the stacked Polaroid photo cards
  // 0: All photos active
  // 1-5: Photos swiped
  // 6: All 6 photos swiped -> Reveal the beautiful stationery card letters!
  const [swipeCount, setSwipeCount] = useState<number>(0);

  const handleOpenEnvelope = () => {
    if (isOpen) return; // Already open
    audio.playPaper();
    setIsOpen(true);
    setRevealConfetti(true);
    // Play sparkles sound arpeggio
    audio.playSuccess();
    setTimeout(() => {
      setRevealConfetti(false);
    }, 4000);
  };

  const handleSwipePhoto = () => {
    if (swipeCount >= 6) return;
    
    // Play a crisp paper rustle sound when swapping a memory
    audio.playPaper();
    setSwipeCount((prev) => prev + 1);
  };

  const handleFullReset = () => {
    setIsOpen(false);
    setSwipeCount(0);
    onResetToPuzzle();
  };

  // Stack of photos featuring the custom uploaded local pictures
  const polaroids = [
    {
      title: "Our Favorite Memory",
      desc: "Beautifully put together",
      url: selectedPhotoUrl, // Solved puzzle image
      rotation: "rotate-[-3deg]",
      translate: "translate-x-[-10px] translate-y-[-5px]",
    },
    {
      title: "Joyful Hearts",
      desc: "Warm family laughter",
      url: DEFAULT_PHOTOS[1]?.url || "/photos/20260617_085648.jpg",
      rotation: "rotate-[2deg]",
      translate: "translate-x-[5px] translate-y-[-10px]",
    },
    {
      title: "Sweet Smiles",
      desc: "Bright moments we cherish",
      url: DEFAULT_PHOTOS[2]?.url || "/photos/20260617_085600.jpg",
      rotation: "rotate-[-1.5deg]",
      translate: "translate-x-[-2px] translate-y-[-2px]",
    },
    {
      title: "Quiet Wisdom",
      desc: "Deep and peaceful times",
      url: DEFAULT_PHOTOS[3]?.url || "/photos/20260617_085328.jpg",
      rotation: "rotate-[3deg]",
      translate: "translate-x-[8px] translate-y-[3px]",
    },
    {
      title: "Endless Laughter",
      desc: "Joy through the years",
      url: DEFAULT_PHOTOS[4]?.url || "/photos/20260617_085203.jpg",
      rotation: "rotate-[-2.5deg]",
      translate: "translate-x-[-6px] translate-y-[4px]",
    },
    {
      title: "Cherished Times",
      desc: "Every step is special",
      url: DEFAULT_PHOTOS[5]?.url || "/photos/20260617_090056.jpg",
      rotation: "rotate-[1.5deg]",
      translate: "translate-x-[4px] translate-y-[-6px]",
    }
  ];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center select-none py-4">
      
      {/* CONFETTI SPARKLE EFFECT */}
      {revealConfetti && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center">
          <div className="relative w-full h-full">
            {Array.from({ length: 40 }).map((_, idx) => {
              const randomX = Math.random() * 100;
              const randomY = Math.random() * 100;
              const size = Math.random() * 8 + 6;
              const delays = Math.random() * 1.5;
              return (
                <div
                  key={`confetti-${idx}`}
                  className="absolute bg-amber-400 rounded-full animate-ping opacity-85"
                  style={{
                    left: `${randomX}%`,
                    top: `${randomY}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: `${delays}s`,
                    boxShadow: '0 0 10px #f59e0b',
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Main Container Wrapper */}
      <div className="w-full relative flex flex-col items-center justify-center min-h-[380px] p-2">
        
        {/* ENVELOPE (Un-opened State) */}
        {!isOpen && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <p className="text-center text-xs font-mono font-bold tracking-widest text-[#785a1a] uppercase mb-4 bg-amber-100/80 px-4 py-1.5 rounded-full shadow-sm animate-pulse">
              🎁 Envelope Unlocked for Papa!
            </p>

            <div 
              onClick={handleOpenEnvelope}
              className="relative w-full max-w-[340px] aspect-[1.4/1] bg-gradient-to-br from-[#fdfbf7] to-[#ffead0] rounded-2xl border border-[#e9c176] shadow-2xl cursor-pointer hover:scale-103 transition-transform duration-300"
              id="sealed-envelope"
            >
              {/* Envelope back lining */}
              <div className="absolute inset-0 bg-[#faf5ea] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                <div className="w-full h-full opacity-5 pointer-events-none" style={{
                  backgroundImage: 'radial-gradient(circle, #e6c27e 12%, transparent 13%)',
                  backgroundSize: '15px 15px'
                }} />
              </div>

              {/* Classic Physical diagonal shadow folds */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* Left fold fold */}
                <div className="absolute bottom-0 left-0 top-0 w-[51%] bg-gradient-to-tr from-[#faf1e2] to-[#f3e1cb] border-r border-[#dcb35f]/15" style={{
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
                }} />
                {/* Right fold fold */}
                <div className="absolute bottom-0 right-0 top-0 w-[51%] bg-gradient-to-tl from-[#f6ebd5] to-[#edd7be] border-l border-[#dcb35f]/15" style={{
                  clipPath: 'polygon(100% 0, 0 50%, 100% 100%)'
                }} />
                {/* Bottom fold fold */}
                <div className="absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-[#fdecd3] to-[#f5dcbb] border-t border-[#e3bf73]/20" style={{
                  clipPath: 'polygon(0 100%, 50% 0, 100% 100%)'
                }} />
              </div>

              {/* Golden crimson wax Heart seal closure */}
              <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-20%] z-20 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-amber-100 shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center transition-all bg-stone-50">
                  <Heart className="w-7 h-7 text-amber-600 fill-amber-600 animate-pulse" />
                </div>
                
                <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-amber-900 mt-2.5 animate-bounce">
                  Tap to open seal
                </span>
              </div>
            </div>
          </div>
        )}

        {/* OPENED STATE: Memories Stack pop up & then Happy Father's Day message */}
        {isOpen && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            
            {/* Phase 1: Interactive stacked polaroids loop */}
            {swipeCount < polaroids.length ? (
              <div className="w-full flex flex-col items-center">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-250 text-[#785a1a] text-[11px] font-semibold mb-1">
                    <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
                    <span>Memory Album ({swipeCount + 1} / {polaroids.length})</span>
                  </div>
                  <h4 className="font-headline text-base text-slate-900 font-bold">
                    Flip through our sweetest memories!
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Tap the photo stack card to peel it away and reveal the next memory card underneath.
                  </p>
                </div>

                {/* Stacking container of physical Polaroid photo frames */}
                <div className="relative w-full max-w-[275px] h-[330px] my-3 flex items-center justify-center">
                  {polaroids.map((p, idx) => {
                    const isSwiped = swipeCount > idx;
                    const isTop = swipeCount === idx;

                    // Skip rendering already swiped frames to keep render tree lightweight
                    if (isSwiped) return null;

                    // Layer zIndex based on list sequence
                    const zIndexVal = 30 - idx;

                    return (
                      <div
                        key={`stacked-${idx}`}
                        onClick={handleSwipePhoto}
                        className={`absolute w-full bg-white p-3.5 pb-6 rounded-2xl shadow-xl border border-slate-200/65 cursor-pointer select-none transition-all duration-500 ease-out ${p.rotation} ${p.translate} ${
                          isTop 
                            ? 'hover:scale-[1.02] hover:rotate-[0deg] hover:shadow-2xl ring-2 ring-[#e9c176]/30' 
                            : 'pointer-events-none opacity-90 scale-95'
                        }`}
                        style={{
                          zIndex: zIndexVal,
                          transformOrigin: 'bottom center',
                        }}
                      >
                        {/* High quality Gloss image container */}
                        <div className="w-full aspect-square rounded-xl overflow-hidden shadow-inner bg-slate-50 relative border border-slate-100">
                          <img
                            src={p.url}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-slate-900/75 text-white text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-widest">
                            Memory #{idx + 1}
                          </div>
                        </div>

                        {/* Handwritten style Polaroids footer label */}
                        <div className="mt-4 text-center">
                          <p className="font-headline text-slate-900 font-bold text-base leading-none">
                            {p.title}
                          </p>
                          <p className="text-amber-800 text-[11px] font-medium font-sans italic mt-1.5 uppercase tracking-wide">
                            {p.desc}
                          </p>
                        </div>

                        {/* Hover tactile tap card indicator */}
                        {isTop && (
                          <div className="absolute right-3 bottom-2 flex items-center gap-1.5 text-slate-400">
                            <span className="text-[10px] font-bold font-mono tracking-wider uppercase animate-pulse">Swipe / Tap</span>
                            <ArrowRight className="w-3.5 h-3.5 animate-bounce-horizontal" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-center text-[11px] font-mono text-slate-400 mt-2">
                  ▲ Click anywhere on the photograph card above to flip
                </p>
              </div>
            ) : (
              
              /* Phase 2: Happy Father's Day Stationery Letter (The ultimate card) */
              <div className="w-full max-w-[340px] bg-white rounded-2xl p-5 border border-[#e9c176]/40 shadow-xl animate-fade-in relative overflow-hidden flex flex-col items-center text-center">
                
                {/* Beautiful flower decoration elements top margins */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-100 rounded-full blur-2xl opacity-60" />
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-rose-100 rounded-full blur-2xl opacity-65" />

                <div className="relative z-10 py-3 flex flex-col items-center">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-200">
                    <Heart className="w-6 h-6 text-amber-600 fill-amber-500 animate-pulse" />
                  </div>

                  {/* Grand "Happy Father's Day Papa" Message requested */}
                  <h3 className="font-headline text-2xl sm:text-3xl text-slate-900 font-bold leading-tight tracking-tight mb-2">
                    Happy Father's Day, Papa!
                  </h3>
                  
                  <p className="text-[10px] font-mono font-semibold text-amber-800 uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full mt-2">
                    ❤️❤️❤️
                  </p>
                </div>

                {/* Bottom restart button loop */}
                <div className="w-full relative z-10 mt-4">
                  <button
                    onClick={handleFullReset}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-5 bg-[#051125] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-slate-800 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    Play again!
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bounce keyframe horizontal direction helper */}
      <style>{`
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s infinite;
        }
      `}</style>

    </div>
  );
};
