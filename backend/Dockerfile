FROM node:18-bullseye

# Install Python 3.10 and pip
RUN apt-get update && \
    apt-get install -y python3.10 python3-pip && \
    ln -sf python3.10 /usr/bin/python3 && \
    ln -sf python3.10 /usr/bin/python

WORKDIR /usr/src/app

# Copy Node.js dependencies and install
COPY package.json ./
RUN npm install

# Copy Python requirements and install
COPY requirements.txt ./
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

# Copy the rest of the backend code
COPY . .

EXPOSE 5000

ENV PORT=5000

CMD ["npm", "start"]
