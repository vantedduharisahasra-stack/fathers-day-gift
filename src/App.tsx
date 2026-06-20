/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  CheckCircle,
  Volume2, 
  VolumeX, 
  Heart,
  ArrowRight,
  ArrowLeft,
  MousePointerClick
} from 'lucide-react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { EnvelopeCard } from './components/EnvelopeCard';
import { DEFAULT_PHOTOS, TEMPLATE_CARDS } from './constants';
import { audio } from './components/AudioEngine';

export default function App() {
  // Screen state: 'puzzle' (Screen 1) | 'envelope' (Screen 2)
  const [screen, setScreen] = useState<'puzzle' | 'envelope'>('puzzle');
  const [puzzleSolved, setPuzzleSolved] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  
  // Custom states for check work feedback visual buzzer and shake
  const [chkState, setChkState] = useState<'idle' | 'success' | 'fail'>('idle');

  // Set the visual target to our beautiful "cozy living room hug" original preset
  const selectedPhoto = DEFAULT_PHOTOS[0];

  // Locked card template for absolute focus with zero editing/personalizing clutter
  const cardData = TEMPLATE_CARDS.sincere;

  // Puzzle Solved Handler
  const handlePuzzleSolved = () => {
    setPuzzleSolved(true);
    setChkState('success');
    audio.playSuccess();
    
    // Automatically transition to the beautiful envelope card after showing the full restored photo for ~3.8 seconds!
    setTimeout(() => {
      setScreen('envelope');
    }, 3800);
  };

  // Manual Check My Work trigger (Screenshot #1 action)
  const handleManualCheck = () => {
    if (puzzleSolved) {
      setScreen('envelope');
      return;
    }

    // Read the query selector to determine if all tiles are in sequence
    const boardEl = document.getElementById('puzzle-board');
    if (boardEl) {
      const childSlots = Array.from(boardEl.children);
      let isSequenced = true;
      
      // Let's check matching index patterns
      for (let i = 0; i < childSlots.length; i++) {
        const id = childSlots[i].id;
        if (id.includes('puzzle-tile-')) {
          const tileValStr = id.split('puzzle-tile-')[1];
          if (parseInt(tileValStr) !== i) {
            isSequenced = false;
            break;
          }
        } else if (id.includes('empty-slot-')) {
          const emptySlotIndex = parseInt(id.split('empty-slot-')[1]);
          if (i !== childSlots.length - 1) {
            isSequenced = false;
          }
        }
      }

      if (isSequenced) {
        handlePuzzleSolved();
      } else {
        audio.playMove(); // Dry buzz or click
        setChkState('fail');
        setTimeout(() => {
          setChkState('idle');
        }, 1500);
      }
    }
  };

  const toggleMute = () => {
    const isMutedNow = audio.toggleMute();
    setMuted(isMutedNow);
  };

  const resetAllAndPlayAgain = () => {
    setPuzzleSolved(false);
    setChkState('idle');
    setScreen('puzzle');
    // Reload logic is handled by standard slide mounts and shuffles in PuzzleBoard
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-[#fcfbf7] text-slate-800 selection:bg-amber-200 overflow-hidden">
      
      {/* Premium Sticky Navigation bar with linear indicators */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#e9c176]/30 shadow-sm shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-[#e9c176]/40 shadow-sm">
              <Gift className="text-amber-800 fill-amber-700/20 w-4 h-4" />
            </div>
            <div>
              <h1 className="font-headline font-semibold text-sm sm:text-base text-slate-900 tracking-tight leading-none">
                Father's Day Memory Game
              </h1>
              <span className="text-[9px] font-mono text-amber-800 uppercase tracking-widest block mt-0.5">
                {screen === 'puzzle' ? 'Step 1: Sliding Grid' : 'Step 2: Letter Envelope'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Step navigation display labels */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono">
              <span className={`px-2 py-0.5 rounded-full ${screen === 'puzzle' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-100 text-slate-450'}`}>1. Game</span>
              <span className="text-slate-200">→</span>
              <span className={`px-2 py-0.5 rounded-full ${screen === 'envelope' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-100 text-slate-450'}`}>2. Letter</span>
            </div>

            {/* Premium Client Audio feedback state toggle */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-amber-300 hover:scale-105 cursor-pointer text-slate-500 hover:text-slate-800 transition-all shadow-sm"
              title={muted ? "Unmute Audio" : "Mute Sound Effects"}
            >
              {muted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#5d4201]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container viewport */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-2 overflow-hidden flex flex-col justify-center items-center">
        
        {/* Screen 1: Sliding picture puzzle page */}
        {screen === 'puzzle' ? (
          <div className="animate-fade-in w-full max-w-sm flex flex-col items-center">
            {/* Minimal Hero Section */}
            <div className="text-center mb-2 max-w-md mx-auto">
              <h2 className="font-headline text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                For Papa ❤️
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Slide the tiles into order to unlock your message.
              </p>
            </div>

            {/* Puzzle board slot */}
            <div className="relative w-full">
              <PuzzleBoard 
                photo={selectedPhoto}
                onSolved={handlePuzzleSolved}
                isSolved={puzzleSolved}
              />
            </div>

            {/* Quiet bypass skip link centered with zero extra box borders */}
            <div className="mt-3 text-center">
              <button
                onClick={() => {
                  setPuzzleSolved(true);
                  audio.playSuccess();
                  setScreen('envelope');
                }}
                className="text-[10px] font-mono tracking-wider font-semibold text-[#785a1a] hover:text-amber-900 outline-none flex items-center justify-center gap-1 opacity-70 hover:opacity-100 transition-all cursor-pointer"
              >
                Skip straight to Papa's Letter <MousePointerClick className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          
          /* Screen 2: Beautiful Read-only Envelope card view */
          <div className="animate-fade-in relative w-full max-w-md flex flex-col items-center">
            <div className="text-center mb-1 max-w-md mx-auto">
              <h2 className="font-headline text-lg sm:text-xl font-bold text-[#051125] tracking-tight">
                To the World's Best Papa ❤️
              </h2>
            </div>

            {/* Read-only slide stack envelope card wrapper */}
            <EnvelopeCard
              cardData={cardData}
              selectedPhotoUrl={selectedPhoto.url}
              onResetToPuzzle={resetAllAndPlayAgain}
            />

            {/* Floating button to go back to puzzle game */}
            <div className="mt-2 text-center">
              <button
                onClick={() => setScreen('puzzle')}
                className="text-[11px] font-mono font-bold tracking-widest text-[#5d4201] hover:text-amber-805 transition-colors border-b border-[#e9c176]/50 hover:border-amber-700/60 pb-0.5 cursor-pointer"
              >
                ← Back to Sliding Game
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Styled Footer (Minimal Style) */}
      <footer className="py-2.5 text-center text-[10px] text-slate-400 w-full shrink-0 select-none border-t border-slate-100 font-mono">
        With love on Father's Day 2026
      </footer>

      {/* Custom Keyframe Styles */}
      <style>{`
        .animate-shake {
          animation: button-shake 0.4s ease-in-out;
        }
        @keyframes button-shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
