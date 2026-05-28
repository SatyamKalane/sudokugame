import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Board from './components/Board';
import Controls from './components/Controls';
import VictoryModal from './components/VictoryModal';
import ParticleBackground from './components/ParticleBackground';
import AnalyticsSidebar from './components/AnalyticsSidebar';
import { Trophy, AlertTriangle, Timer, Play, Pause, Palette, RefreshCw, BarChart2, Volume2, VolumeX } from 'lucide-react';

function GameDashboard() {
  const { 
    score, mistakes, difficulty, setDifficulty, startNewGame, seconds, isPaused, togglePause, 
    theme, setTheme, combo, soundEnabled, setSoundEnabled 
  } = useGame();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const themeClasses = {
    cyberpunk: { bg: 'bg-[#050914]', border: 'border-cyan-500/20', neonText: 'text-neonCyan', themeAccent: 'from-cyan-400 to-purple-500' },
    amoled: { bg: 'bg-black', border: 'border-zinc-800', neonText: 'text-white', themeAccent: 'from-zinc-200 to-zinc-600' },
    matrix: { bg: 'bg-[#010601]', border: 'border-green-500/20', neonText: 'text-green-400', themeAccent: 'from-green-400 to-emerald-600' }
  };

  const activeTheme = themeClasses[theme] || themeClasses.cyberpunk;

  return (
    <div className={`min-h-screen ${activeTheme.bg} text-white flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-500 select-none`}>
      <ParticleBackground />

      <header className="w-full max-w-[480px] flex justify-between items-center mb-4 z-10 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl font-black tracking-wider bg-gradient-to-r ${activeTheme.themeAccent} bg-clip-text text-transparent uppercase`}>
              NEON MATRIX
            </h1>
            {/* Combo Streak Indicator Flash row */}
            {combo > 1 && (
              <div className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-red-500 text-black text-[10px] font-black uppercase rounded-md tracking-wider animate-pulse shadow-lg shadow-amber-500/20">
                Combo x{combo}
              </div>
            )}
          </div>
          <div className="flex gap-1.5 mt-1">
            {['easy', 'medium', 'hard', 'expert'].map((d) => (
              <button 
                key={d} onClick={() => setDifficulty(d)}
                className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded border transition-all duration-200 ${difficulty === d ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400' : 'border-white/5 text-white/30'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Action controls array row */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-slate-900/80 border border-slate-800 rounded-xl hover:bg-slate-800 text-white transition-all"
            title="Toggle Audio Channels"
          >
            {soundEnabled ? <Volume2 size={15} className="text-emerald-400" /> : <VolumeX size={15} className="text-slate-500" />}
          </button>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-slate-900/80 border border-slate-800 rounded-xl hover:bg-slate-800 text-cyan-400 transition-all"
            title="Open Diagnostic Logs"
          >
            <BarChart2 size={15} />
          </button>
          <button 
            onClick={() => setTheme(prev => prev === 'cyberpunk' ? 'amoled' : prev === 'amoled' ? 'matrix' : 'cyberpunk')}
            className="p-2 bg-slate-900/80 border border-slate-800 rounded-xl hover:bg-slate-800 text-purple-400 transition-all"
          >
            <Palette size={15} />
          </button>
          <button 
            onClick={() => startNewGame()} 
            className="p-2 bg-slate-900/80 border border-slate-800 rounded-xl hover:bg-slate-800 flex items-center gap-1 text-xs font-bold transition-all text-slate-200"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </header>

      {/* Main Stats display bars layout HUD */}
      <div className="w-full max-w-[480px] grid grid-cols-3 gap-2 mb-4 z-10 px-1">
        <div className="bg-slate-900/50 border border-white/5 p-2.5 rounded-xl flex items-center gap-2 backdrop-blur-md">
          <Trophy className="text-yellow-400" size={18} />
          <div>
            <div className="text-[9px] text-white/40 uppercase font-bold tracking-tight">XP Core</div>
            <div className="text-sm font-mono font-black">{score}</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 p-2.5 rounded-xl flex items-center gap-2 backdrop-blur-md">
          <AlertTriangle className="text-red-400" size={18} />
          <div>
            <div className="text-[9px] text-white/40 uppercase font-bold tracking-tight">Anomalies</div>
            <div className="text-sm font-mono font-black text-red-400">{mistakes}</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 p-2.5 rounded-xl flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Timer className={activeTheme.neonText} size={18} />
            <div>
              <div className="text-[9px] text-white/40 uppercase font-bold tracking-tight">Chronos</div>
              <div className={`text-sm font-mono font-black ${isPaused ? 'text-white/40 animate-pulse' : ''}`}>{formatTime(seconds)}</div>
            </div>
          </div>
          <button onClick={togglePause} className="p-1 hover:bg-white/10 rounded transition-all">
            {isPaused ? <Play className="text-green-400" size={13} /> : <Pause className="text-amber-400" size={13} />}
          </button>
        </div>
      </div>

      <main className="w-full flex flex-col items-center z-10 relative">
        {isPaused ? (
          <div className="w-full max-w-[480px] aspect-square bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-2xl animate-fade-in">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
              <Pause className="text-cyan-400" size={32} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-cyan-400">Chronos Frozen</h3>
            <button 
              onClick={togglePause}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
            >
              Resume Operation
            </button>
          </div>
        ) : (
          <>
            <Board />
            <Controls />
          </>
        )}
      </main>

      <VictoryModal />
      
      {/* Sliding diagnostic analysis menu element */}
      <AnalyticsSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameDashboard />
    </GameProvider>
  );
}
