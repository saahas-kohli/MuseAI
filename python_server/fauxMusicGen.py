import asyncio
import json
import websockets
import torch
from base64 import b64encode
import scipy.io.wavfile

from transformers import AutoProcessor, MusicgenForConditionalGeneration
processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")

async def run_model(websocket, path):
    async for message in websocket:
        try:
            data = json.loads(message)
            prompt = data['prompt']

            inputs = processor(
                text=[prompt],
                padding=True,
                return_tensors="pt",
            )

            audio_values = model.generate(**inputs, max_new_tokens=256)
            sampling_rate = model.config.audio_encoder.sampling_rate
            
            # Save the generated audio to a file
            scipy.io.wavfile.write("musicgen_out.wav", rate=sampling_rate, data=audio_values[0, 0].numpy())
            
            # Encode the audio file in base64
            with open("musicgen_out.wav", 'rb') as f:
                enc = b64encode(f.read()).decode('utf-8')  # decode('utf-8') to convert bytes to string for JSON serialization

            await websocket.send(json.dumps({'output': enc}))
        except Exception as e:
            print(f"Error: {e}")
            await websocket.send(json.dumps({'output': str(e)}))

start_server = websockets.serve(run_model, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
