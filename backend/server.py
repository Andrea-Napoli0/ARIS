# main.py
from fastapi import FastAPI
import socketio
from events import sio

app = FastAPI()
app_socketio = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app_socketio, host="0.0.0.0", port=8000)