# Architettura Backend — Stato attuale (Test)

> Questo documento riflette lo stato reale del progetto: un test minimo
> per validare la pipeline client-server. Non rappresenta ancora
> un'architettura definitiva.

## Stack

- **Python** — linguaggio backend
- **FastAPI** — applicazione ASGI, monta Socket.IO
- **python-socketio** — comunicazione bidirezionale in tempo reale (WebSocket)
- **React + TypeScript** — frontend client

## Flusso attuale (testato e funzionante)
[Client React] --(socket.emit)--> [Server Socket.IO] --(asyncio.sleep, simula delay)--> [Server emit risposta] --(socket.on)--> [Client aggiorna UI]

## File coinvolti

- `backend/server.py` — entry point, monta `socketio.ASGIApp(sio, app)`
- `backend/events.py` — handler `connect`, `test_request`, `disconnect` (test)
- `frontend/socket.ts` — istanza client socket.io
- `frontend/TestComponent.tsx` — componente di test che invia/riceve

## Cosa NON c'è ancora

- Logica AI/agent reale
- Separazione degli eventi per dominio
- Gestione errori/riconnessione
- Persistenza dello stato

## Prossimi step

- [ ] Definire gli eventi semantici reali (es. `user_message`, `assistant_response`)
- [ ] Collegare `ARISModeValue` (Zustand) agli eventi di stato
- [ ] Valutare separazione `events.py` in moduli quando necessario