import asyncio
import json
import websockets
import torch
from base64 import b64encode
import scipy.io.wavfile
from io import BytesIO

from transformers import AutoProcessor, MusicgenForConditionalGeneration

# Load the processor and model outside the async function to do it only once
processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")

async def run_model(websocket, path):
    async for message in websocket:
        try:
            data = json.loads(message)
            prompt = data.get('prompt')
            if not prompt:
                raise ValueError("No prompt provided")

            inputs = processor(
                text=[prompt],
                padding=True,
                return_tensors="pt",
            )

            audio_values = model.generate(**inputs, max_new_tokens=256)
            sampling_rate = model.config.audio_encoder.sampling_rate

            # Convert generated audio to bytes and encode in base64 directly
            audio_buffer = BytesIO()
            scipy.io.wavfile.write(audio_buffer, rate=sampling_rate, data=audio_values[0, 0].numpy())
            audio_buffer.seek(0)  # Rewind the buffer
            encoded_audio = b64encode(audio_buffer.read()).decode('utf-8')

            await websocket.send(json.dumps({'output': encoded_audio}))
        except Exception as e:
            error_message = f"Error processing request: {e}"
            print(error_message)
            await websocket.send(json.dumps({'error': str(e)}))

# Set up and start the WebSocket server
start_server = websockets.serve(run_model, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

# import asyncio
# import json
# import websockets
# import torch
# from base64 import b64encode
# import scipy.io.wavfile

# from transformers import AutoProcessor, MusicgenForConditionalGeneration
# processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
# model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")

# async def run_model(websocket, path):
#     async for message in websocket:
#         try:
#             data = json.loads(message)
#             prompt = data['prompt']

#             inputs = processor(
#                 text=[prompt],
#                 padding=True,
#                 return_tensors="pt",
#             )

#             audio_values = model.generate(**inputs, max_new_tokens=256)
#             sampling_rate = model.config.audio_encoder.sampling_rate
            
#             # Save the generated audio to a file
#             scipy.io.wavfile.write("musicgen_out.wav", rate=sampling_rate, data=audio_values[0, 0].numpy())
            
#             # Encode the audio file in base64
#             with open("musicgen_out.wav", 'rb') as f:
#                 enc = b64encode(f.read()).decode('utf-8')  # decode('utf-8') to convert bytes to string for JSON serialization

#             await websocket.send(json.dumps({'output': enc}))
#         except Exception as e:
#             print(f"Error: {e}")
#             await websocket.send(json.dumps({'output': str(e)}))

# start_server = websockets.serve(run_model, "localhost", 6789)

# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()

