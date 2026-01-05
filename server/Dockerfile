# Use lightweight Node image
FROM node:18-alpine

WORKDIR /app

# 1. Install Python3 and FFmpeg (Required for yt-dlp)
RUN apk add --no-cache python3 py3-pip ffmpeg

# 2. Create virtual environment for Python (Prevents system conflict)
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 3. Install yt-dlp
RUN pip install --upgrade pip && pip install yt-dlp

# 4. Install Node Dependencies
COPY package*.json ./
RUN npm install

# 5. Copy App Code
COPY . .

# 6. Start
EXPOSE 5000
CMD ["node", "server.js"]