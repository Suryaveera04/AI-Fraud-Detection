# 1. Use an official Node.js image with Python 3.10 installed
FROM node:18-bullseye

# 2. Install Python 3.10 and pip
RUN apt-get update && \
    apt-get install -y python3.10 python3-pip && \
    ln -sf python3.10 /usr/bin/python3 && \
    ln -sf python3.10 /usr/bin/python

# 3. Set working directory
WORKDIR /usr/src/app

# 4. Copy package.json and install Node.js dependencies
COPY package.json ./
RUN npm install

# 5. Copy Python requirements and install Python dependencies
COPY requirements.txt ./
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

# 6. Copy the rest of the backend code
COPY . .

# 7. Expose the backend port
EXPOSE 5000

# 8. Set environment variables (optional, override in deployment)
ENV PORT=5000

# 9. Start the Node.js server
CMD ["npm", "start"]
