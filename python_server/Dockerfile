# Use an official Python runtime as a parent image
FROM python:3.9

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at working directory
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 6789 available to the world outside this container
# (Assuming your WebSocket app uses port 6789, change it if needed)
EXPOSE 6789

# Run fauxMusicGen.py when the container launches
CMD ["python3", "fauxMusicGen.py"]

