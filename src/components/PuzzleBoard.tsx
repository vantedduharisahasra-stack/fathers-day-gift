/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye, EyeOff, Trophy } from 'lucide-react';
import { audio } from './AudioEngine';
import { PuzzlePhoto } from '../types';

interface PuzzleBoardProps {
  photo: PuzzlePhoto;
  onSolved: () => void;
  isSolved: boolean;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  photo,
  onSolved,
  isSolved,
}) => {
  const [size, setSize] = useState<3>(3); // Keep it standard 3x3 for a balanced and fun challenge
  const [grid, setGrid] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showNumbers, setShowNumbers] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const totalTiles = 9;
  const emptyVal = 8; // Last index is empty (index 8)

  // Generate initial solved grid
  const initializeGrid = (boardSize: number) => {
    const list = Array.from({ length: boardSize * boardSize }, (_, i) => i);
    setGrid(list);
    setMoves(0);
    setTimer(0);
    setIsTimerRunning(false);
  };

  // Perform legal random slides to shuffle the grid
  const shuffleGrid = () => {
    let tempGrid = Array.from({ length: 9 }, (_, i) => i);
    let emptyIndex = tempGrid.indexOf(emptyVal);

    const getAdjNeighbors = (idx: number, bSize: number) => {
      const row = Math.floor(idx / bSize);
      const col = idx % bSize;
      const neighbors: number[] = [];
      if (row > 0) neighbors.push(idx - bSize);
      if (row < bSize - 1) neighbors.push(idx + bSize);
      if (col > 0) neighbors.push(idx - 1);
      if (col < bSize - 1) neighbors.push(idx + 1);
      return neighbors;
    };

    // Make 200 random swaps with the empty tile to guarantee solvability
    for (let i = 0; i < 200; i++) {
      const neighbors = getAdjNeighbors(emptyIndex, 3);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Swap emptyVal and randomNeighbor
      const neighborVal = tempGrid[randomNeighbor];
      tempGrid[emptyIndex] = neighborVal;
      tempGrid[randomNeighbor] = emptyVal;
      emptyIndex = randomNeighbor;
    }

    setGrid(tempGrid);
    setMoves(0);
    setTimer(0);
    setIsTimerRunning(true);
  };

  // React to size changes on start
  useEffect(() => {
    initializeGrid(3);
    setTimeout(() => {
      shuffleGrid();
    }, 150);
  }, []);

  // Handle timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isSolved) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isSolved]);

  // Click a tile
  const handleTileClick = (index: number) => {
    if (isSolved) return;

    const emptyIndex = grid.indexOf(emptyVal);
    const tileRow = Math.floor(index / 3);
    const tileCol = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    const isAdjacent = Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1;

    if (isAdjacent) {
      audio.playMove();
      const updated = [...grid];
      updated[emptyIndex] = grid[index];
      updated[index] = emptyVal;
      setGrid(updated);
      setMoves((m) => m + 1);

      // Check if solved
      const solved = updated.every((val, idx) => val === idx);
      if (solved) {
        setIsTimerRunning(false);
        audio.playSuccess();
        onSolved();
      }
    }
  };

  // Solve instantly (cheat helper)
  const handleAutoSolve = () => {
    initializeGrid(3);
    audio.playSuccess();
    onSolved();
  };

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">

      {/* Stats bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-white border border-amber-100 rounded-2xl mb-4 shadow-sm font-mono text-xs text-slate-705">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Moves:</span>
          <span className="font-bold text-slate-900 text-sm">{moves}</span>
        </div>
        <div className="text-amber-800 font-bold bg-amber-50 border border-amber-100/50 px-2.5 py-1 rounded-full uppercase tracking-wider text-[10px]">
          Classic 3x3
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Time:</span>
          <span className="font-bold text-slate-900 text-sm">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Grid Canvas Wrapper with responsive bounds */}
      <div className="relative w-full aspect-square bg-[#fbf8f0] rounded-2xl p-2 border-2 border-[#e9c176]/50 shadow-xl overflow-hidden max-w-[340px] sm:max-w-[360px]">
        
        {/* Actual Interactive sliding board */}
        <div
          className="w-full h-full grid gap-1.5"
          style={{
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
          }}
          id="puzzle-board"
        >
          {grid.map((tileVal, idx) => {
            const isTileEmpty = tileVal === emptyVal;

            if (isTileEmpty) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="bg-transparent border border-slate-200/20 rounded-xl"
                  id={`empty-slot-${idx}`}
                />
              );
            }

            // Original absolute grid coordinate
            const origRow = Math.floor(tileVal / 3);
            const origCol = tileVal % 3;

            // Background percentages
            const bgX = (origCol / 2) * 100;
            const bgY = (origRow / 2) * 100;

            // Is the tile currently in its correct matched slot?
            const isCorrect = tileVal === idx;

            return (
              <button
                key={`tile-${tileVal}`}
                onClick={() => handleTileClick(idx)}
                className={`relative w-full h-full rounded-xl border overflow-hidden select-none cursor-pointer transition-all duration-150 ${
                  isSolved
                    ? 'border-emerald-500 ring-2 ring-emerald-400'
                    : isCorrect
                    ? 'border-amber-300 hover:border-amber-400 hover:ring-2 hover:ring-amber-300'
                    : 'border-[#e9c176]/40 hover:border-amber-400 hover:ring-2 hover:ring-slate-350'
                }`}
                style={{
                  backgroundImage: `url(${photo.url})`,
                  backgroundSize: '300% 300%',
                  backgroundPosition: `${bgX}% ${bgY}%`,
                }}
                id={`puzzle-tile-${tileVal}`}
              >
                {/* Visual Helpers (Numbers) */}
                {(showNumbers || isSolved) && (
                  <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono shadow ${
                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-900/80 text-white'
                  }`}>
                    {tileVal + 1}
                  </div>
                )}
                
                {/* Correct badge shimmer */}
                {isCorrect && !isSolved && (
                  <div className="absolute bottom-1.5 right-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Full solved state overlay card feedback */}
        {isSolved && (
          <div className="absolute inset-4 bg-white rounded-xl overflow-hidden shadow-md flex flex-col items-center justify-center animate-fade-in z-30">
            <div className="relative w-full h-full">
              <img
                src={photo.url}
                alt="Memory Restored"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-4 text-center">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1 animate-bounce" />
                <h4 className="font-headline text-base text-amber-200 font-semibold leading-tight">Memory Restored perfectly! ❤️</h4>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                  Recreated in {moves} moves! Unlocking envelope next...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Temporary complete photo preview overlay */}
        {showPreview && (
          <div className="absolute inset-0 bg-white/95 p-3 rounded-2xl animate-fade-in flex flex-col items-center justify-center">
            <h5 className="text-xs font-semibold text-slate-500 mb-2 font-mono uppercase">Full Memory Guide</h5>
            <div className="relative flex-1 w-full rounded-xl overflow-hidden border border-[#e9c176]/30">
              <img
                src={photo.url}
                alt="Guide target"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="mt-3 px-5 py-2 bg-[#051125] text-white text-xs font-medium rounded-full cursor-pointer hover:bg-slate-800 transition-colors"
            >
              Back to Puzzle
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons Block */}
      <div className="w-full mt-4 grid grid-cols-2 gap-3">
        {/* Shuffle / Reset Button */}
        <button
          onClick={shuffleGrid}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-amber-50 hover:text-amber-900 text-slate-700 font-semibold text-[11px] uppercase tracking-wider rounded-xl transition-all border border-slate-200 shadow-sm active:scale-95 cursor-pointer"
          id="shuffle-board"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
          Mix Memories
        </button>

        {/* Guide Eye Toggle */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-amber-50 hover:text-amber-900 text-slate-700 font-semibold text-[11px] uppercase tracking-wider rounded-xl transition-all border border-slate-200 shadow-sm active:scale-95 cursor-pointer"
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-amber-600" />}
          View Target
        </button>
      </div>

      {/* Secondary micro-helpers row */}
      <div className="w-full mt-3 flex justify-between px-1 text-slate-400">
        <button
          onClick={() => setShowNumbers(!showNumbers)}
          className="text-[10px] font-medium border-b border-transparent hover:border-slate-300 transition-colors font-mono"
        >
          {showNumbers ? 'Hide Tile Numbers' : 'Show Tile Numbers'}
        </button>

        <button
          onClick={handleAutoSolve}
          className="text-[10px] font-medium hover:text-amber-800 border-b border-transparent hover:border-amber-700/60 transition-colors font-mono"
        >
          Auto Solve (Cheat)
        </button>
      </div>
    </div>
  );
};
