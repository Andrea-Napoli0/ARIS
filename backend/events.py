# events.py
import socketio
import time

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")

@sio.event
async def test_request(sid, data):
    print(f"Richiesta ricevuta da {sid}: {data}")
    
    # Risposta predefinita (placeholder)
    await sio.emit(
    "test_response",
    {
        "status": "success",
        "message": "Backend funziona correttamente!",
        "timestamp": time.time()
    }
)



@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")