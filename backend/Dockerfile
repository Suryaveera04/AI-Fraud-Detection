FROM node:18-bullseye

# Install Python 3.10 and ensure pip is available
RUN apt-get update && \
    apt-get install -y python3.10 curl && \
    ln -sf python3.10 /usr/bin/python3 && \
    ln -sf python3.10 /usr/bin/python && \
    curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10

WORKDIR /usr/src/app

# Copy Node.js dependencies and install
COPY package.json ./
RUN npm install

# Copy Python requirements and install
COPY requirements.txt ./
RUN python3.10 -m pip install --upgrade pip && python3.10 -m pip install -r requirements.txt

# Copy the rest of the backend code
COPY . .

EXPOSE 5000

ENV PORT=5000

CMD ["npm", "start"]
