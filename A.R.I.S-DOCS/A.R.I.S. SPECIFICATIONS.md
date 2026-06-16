## Visione

ARIS è un assistente AI personale ispirato a J.A.R.V.I.S.

L'obiettivo del sistema è fornire un'interfaccia naturale e multimodale per interagire con il computer, il web e servizi esterni attraverso voce, testo, visione artificiale e automazione.

ARIS deve essere in grado di assistere l'utente nelle attività quotidiane, nello sviluppo software, nella ricerca di informazioni, nella progettazione CAD e nell'automazione del computer.

Il sistema dovrà essere modulare, estensibile e composto da agenti specializzati coordinati da un orchestratore centrale.

---

# Obiettivi

## Conversazione Naturale

- Conversazione vocale realtime
    
- Conversazione testuale
    
- Comprensione del contesto
    
- Memoria a lungo termine
    
- Memoria conversazionale
    

## Controllo Computer

- Apertura applicazioni
    
- Chiusura applicazioni
    
- Utilizzo mouse
    
- Utilizzo tastiera
    
- Interazione con finestre
    
- Automazione desktop
    

## Web Automation

- Ricerca web
    
- Navigazione web
    
- Compilazione form
    
- Raccolta dati
    
- Automazione browser
    

## CAD

- Generazione modelli CAD tramite linguaggio naturale
    
- Utilizzo build123d
    
- Esportazione STL
    
- Esportazione STEP
    
- Modifica iterativa dei modelli
    

## Visione Artificiale

- Object Detection
    
- Face Tracking
    
- Hand Tracking
    
- Gesture Recognition
    
- Screen Understanding
    
- OCR
    

## Integrazioni

- Email
    
- Calendario
    
- Messaggistica
    
- Planning
    
- Applicazioni custom
    
- API esterne
    

---

# Architettura

## Frontend

Stack:

- Electron
    
- React
    
- TypeScript
    

Responsabilità:

- UI
    
- Voice Interface
    
- 3D Viewer
    
- Gesture Interface
    
- Dashboard
    
- Settings
    

## Backend

Stack:

- Python
    
- FastAPI
    
- Socket.IO
    

Responsabilità:

- Orchestrazione
    
- Tool Calling
    
- Agent Runtime
    
- Memory
    
- Sicurezza
    

## AI Layer

Conversazione:

- Gemini Live
    

Vision:

- MediaPipe
    
- Gemini Vision
    

CAD:

- build123d
    

Browser:

- Playwright
    

---

# Agenti

## Orchestrator Agent

Responsabile del coordinamento dell'intero sistema.

Funzioni:

- Routing richieste
    
- Gestione contesto
    
- Selezione agenti
    
- Gestione tool
    

## Coding Agent

Funzioni:

- Scrittura codice
    
- Refactoring
    
- Analisi repository
    
- Debugging
    

## Web Agent

Funzioni:

- Ricerca informazioni
    
- Browser automation
    
- Data extraction
    

## CAD Agent

Funzioni:

- Generazione modelli CAD
    
- Iterazione design
    
- Esportazione file
    

## OS Agent

Funzioni:

- Controllo sistema operativo
    
- Mouse
    
- Tastiera
    
- Gestione applicazioni
    

---

# Tool

## File System

- Read File
    
- Write File
    
- Delete File
    
- Move File
    
- List Directory
    
- Grep
    
- Glob
    

## Communication

- Read Email
    
- Send Email
    

## Browser

- Open Page
    
- Click
    
- Type
    
- Screenshot
    
- Extract Content
    

## Operating System

- Open Application
    
- Close Application
    
- Focus Window
    
- Mouse Control
    
- Keyboard Control
    

---

# Memoria

Sistema basato su LLM_WIKI.

Componenti:

## Short Term Memory

Memoria della sessione corrente.

## Long Term Memory

Informazioni persistenti.

## Knowledge Base

Documentazione e conoscenza organizzata.

---

# Sicurezza

## Restrizioni Assolute

ARIS non può:

- effettuare pagamenti
    
- autorizzare transazioni finanziarie
    
- acquistare prodotti autonomamente
    

## Controllo Computer

L'utente può:

- attivare il controllo PC
    
- disattivare il controllo PC
    
- limitare i permessi
    

## Tool Permissions

Ogni tool deve poter essere:

- consentito
    
- negato
    
- richiesto con conferma
    

---

# Roadmap

## Fase 1

Frontend Foundation

- Electron
    
- React
    
- Layout principale
    
- Sidebar
    
- Chat Interface
    
- Settings
    

## Fase 2

Backend Foundation

- FastAPI
    
- Socket.IO
    
- Event System
    
- Tool Framework
    

## Fase 3

Conversazione

- Gemini Live
    
- Voice Streaming
    
- Context Management
    

## Fase 4

Memory

- LLM_WIKI
    
- Long Term Memory
    
- Retrieval
    

## Fase 5

OS Agent

- Mouse
    
- Tastiera
    
- Applicazioni
    

## Fase 6

Web Agent

- Playwright
    
- Browser Automation
    

## Fase 7

CAD Agent

- build123d
    
- STL Export
    
- STEP Export
    

## Fase 8

Vision System

- MediaPipe
    
- Face Tracking
    
- Hand Tracking
    
- Object Detection
    

## Fase 9

Ecosystem Integrations

- Email
    
- Calendario
    
- Messaggistica
    
- API custom