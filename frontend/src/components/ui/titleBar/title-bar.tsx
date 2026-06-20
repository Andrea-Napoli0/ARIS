import { Minus, Square, X } from 'lucide-react';

export function TitleBar() {
  return (
    <div className="fixed top-0 left-0 w-full h-6 flex justify-end items-center z-[9999] [-webkit-app-region:drag]">
      <div className="flex [-webkit-app-region:no-drag]">
        <button
          onClick={() => window.electronAPI.minimizeWindow()}
          className="w-11 h-6 flex items-center justify-center border-none shadow-none outline-none bg-transparent!   hover:bg-white/10! not-[]:transition-colors text-cyan-400"
        >
          <Minus className="h-5 w-5" strokeWidth={2} />
        </button>

        <button
          onClick={() => window.electronAPI.maximizeWindow()}
          className="w-11 h-6 flex items-center justify-center border-none shadow-none outline-none bg-transparent!  hover:bg-white/10! transition-colors text-cyan-400"
        >
          <Square className="h-4 w-4" strokeWidth={2} />
        </button>

        <button
          onClick={() => window.electronAPI.closeWindow()}
          className="w-11 h-6 flex items-center justify-center border-none shadow-none outline-none bg-transparent! hover:bg-white/10!  transition-colors text-cyan-400"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}