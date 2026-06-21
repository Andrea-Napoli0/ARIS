// TestComponent.tsx
import { useState, useEffect } from 'react';
import { socket } from './socket';
import { useARISMode } from '@/store/ArisStore';

export default function TestComponent() {
  const [response, setResponse] = useState('');
  const mode = useARISMode((state) => state.mode)
  const setMode = useARISMode((state) => state.setMode)

  const handleClick = () => {
  if (socket) {
    setMode("thinking");
    
    socket.emit('test_request', { message: 'Ciao backend!' });
  }
};

useEffect(() => {
  socket.on('test_response', (data) => {
    // Aggiungi un delay artificiale prima di mostrare la risposta
    setTimeout(() => {
      setResponse(data.message);
      setMode("speaking");
    }, 2000); // 2 second
  });

  return () => {
    socket.off('test_response');
    setMode("idle");
  };
}, []);

  return (
    <div className="p-4 bg-amber-300">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Testa connessione
      </button>

      {response && (
        <p className="mt-4 text-white">{response}</p>
      )}
    </div>
  );
}