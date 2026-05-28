import React from 'react';
import { useGame } from '../context/GameContext';
import { Undo, Lightbulb, Edit3, Trash2 } from 'lucide-react';

export default function Controls() {
  const { updateCellValue, undoAction, triggerHint, isNoteMode, setIsNoteMode } = useGame();

  return (
    <div className="flex flex-col gap-4 max-w-[480px] w-full mt-4 px-2">
      {/* Dynamic Gaming Core Actions Utility Grid */}
      <div className="grid grid-cols-4 gap-3">
        <button 
          onClick={undoAction} 
          className="flex flex-col items-center justify-center p-3 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 hover:border-slate-500 hover:shadow-neonGlow transition-all duration-200"
        >
          <Undo className="text-neonCyan" size={20} />
          <span className="text-xs font-bold mt-1 text-slate-200">Undo</span>
        </button>

        <button 
          onClick={() => setIsNoteMode(!isNoteMode)} 
          className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all duration-200 ${
            isNoteMode 
              ? 'bg-purple-950 border-purple-500 shadow-lg text-purple-400' 
              : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-slate-500'
          }`}
        >
          <Edit3 className={isNoteMode ? "text-purple-400" : "text-neonPurp"} size={20} />
          <span className="text-xs font-bold mt-1 text-slate-200">Notes</span>
        </button>

        <button 
          onClick={triggerHint} 
          className="flex flex-col items-center justify-center p-3 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 hover:border-slate-500 hover:shadow-neonGlow transition-all duration-200"
        >
          <Lightbulb className="text-yellow-400" size={20} />
          <span className="text-xs font-bold mt-1 text-slate-200">Hint</span>
        </button>

        <button 
          onClick={() => updateCellValue(0)} 
          className="flex flex-col items-center justify-center p-3 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 hover:border-slate-500 hover:shadow-neonRed transition-all duration-200"
        >
          <Trash2 className="text-red-400" size={20} />
          <span className="text-xs font-bold mt-1 text-slate-200">Erase</span>
        </button>
      </div>

      {/* Numerical Matrix Input Grid */}
      <div className="grid grid-cols-9 gap-1.5 mt-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => updateCellValue(num)}
            className="py-3.5 bg-slate-800 border border-slate-700 font-black rounded-xl text-xl text-slate-100 hover:bg-neonCyan hover:text-slate-950 hover:border-white hover:shadow-neonGlow active:scale-90 transition-all duration-150"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
