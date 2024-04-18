# MuseAI

MuseAI is a web interface where users can generate, listen to, and download AI-generated music produced by Facebook MusicGen. [Visit MuseAI here](http://your-website-url.com).

![Description of the Image](img/MuseAI_Visual.png)

## Key Features

- **Generate Music:** Leverage AI to create unique music pieces.
- **Audio Visualization:** Visual representations of generated music through real-time audio waveforms.
- **Save Creations:** Users can log in to save their music and access it anytime.
- **Download Tracks:** Easy download options for sharing and playback.

## Tech Stack

- **Frontend:** React
- **Backend:** Express, WebSocket
- **Database:** PostgreSQL
- **Containerization:** Docker-Compose
- **Deployment:** AWS EC2

## Local Installation

To set up MuseAI locally using Docker-Compose, follow these instructions:

1. **Clone the Repository**
   ```bash
   git clone git@github.com:saahas-kohli/MuseAI.git
   cd MuseAI
   git checkout music-docker-local
2. **Build and Run Docker Containers**
   ```bash
   docker-compose build
   docker-compose up
   ```
   Note: This step might take a while to run.       
   Finally, visit the site on http://localhost:3000/

## Credits

This project was written by Daniel Fields (dfields@uchicago.edu) and Saahas Kohli (skohli2@g.ucla.edu).

Meta's recent research and insights into single-stage transformer language models with efficient token interleaving patterns
were instrumental in enabling us to implement conditional music generation.


