FROM node:18-bullseye

# Install Python 3.9 and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip curl && \
    ln -sf python3 /usr/bin/python

WORKDIR /usr/src/app

# Copy Node.js dependencies and install
COPY package.json ./
RUN npm install

# Copy Python requirements and install
COPY requirements.txt ./
RUN python3 -m pip install --upgrade pip && python3 -m pip install -r requirements.txt

# Copy the rest of the backend code
COPY . .

EXPOSE 5000

ENV PORT=5000

CMD ["npm", "start"]
