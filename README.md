# 🛡️ ScamShield - AI-Powered Real-Time Fraud Detection

<div align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Version-2.0--ML-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Mobile-lightgrey" alt="Platform">
  <img src="https://img.shields.io/badge/Languages-8-orange" alt="Languages">
  <img src="https://img.shields.io/badge/ML%20Accuracy-75%25+-success" alt="ML Accuracy">
</div>

## 1️⃣ Problem Statement

**PS 11: Real-Time Audio Fraud Detection for Scam Prevention**

With the rapid rise of voice-based scams, fraudsters increasingly exploit phone calls to deceive users. Particularly vulnerable groups such as elderly individuals, digitally unaware users, and first-time internet adopters. These scams often involve impersonation, emotional manipulation, urgency tactics, and psychological pressure, making them difficult to detect in real time.

Traditional fraud detection systems primarily focus on post-transaction analysis or text-based signals, offering little to no protection during live phone conversations, where most financial and emotional damage occurs.

There is a critical need for an AI-powered, real-time audio intelligence system that can detect scam patterns as a call is happening and proactively protect users before fraud occurs.

### Objective
Develop an innovative AI-driven solution that leverages real-time audio analysis and fraud detection to:
- Identify scam or fraudulent phone calls as they occur
- Protect users, especially elderly and vulnerable populations from financial and emotional harm
- Provide timely alerts, guidance, or interventions during suspicious calls

## 2️⃣ Project Name
**ScamShield - AI-Powered Real-Time Fraud Detection**

## 3️⃣ Team Name
**Team Syndicate Members**

## 4️⃣ Deployed Link
🌐 **Live Application**: [Coming Soon - Local Deployment Available]

## 5️⃣ 2-Minute Demonstration Video Link
🎥 **Demo Video**: [Upload Your Video Link Here]

## 6️⃣ PPT Link
📊 **Presentation**: [Upload Your PPT Link Here]



## 🚀 Overview

**ScamShield** is an advanced AI-powered system that provides real-time protection against fraud calls. Using sophisticated speech recognition, natural language processing, and machine learning, it helps protect vulnerable users (especially elderly) from financial scams across 8 Indian languages.

### ✨ Key Features

- 🎤 **Real-time Speech Recognition** - Browser-based speech-to-text conversion
- 🤖 **AI-Powered ML Analysis** - Advanced ensemble model with 75%+ accuracy
- 🌍 **8-Language Support** - English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali
- 📱 **Elderly-Friendly UI** - Large text, clear colors, simple messaging
- ⚡ **Instant Alerts** - Immediate warnings for high-risk calls
- 📊 **Comprehensive Training** - 487 real-world fraud patterns
- 🕒 **Real-time Analysis** - Live fraud probability scoring
- 🔒 **Privacy First** - No personal data storage, local processing

## 🏗️ Architecture

```
Audio Input → Speech-to-Text → ML Processing → Risk Analysis → Alert Generation
```

### Technology Stack

**Frontend:**
- React.js with modern JavaScript
- Web Speech API for real-time transcription
- Responsive design with CSS3 animations
- Multi-language UI support

**Backend:**
- Node.js with Express.js
- Python ML integration
- RESTful API architecture
- Real-time fraud detection pipeline

**Machine Learning:**
- Advanced ensemble model (LogisticRegression + SVM + NaiveBayes + GradientBoosting)
- TF-IDF vectorization with 5000 features
- 4-gram analysis for pattern detection
- 487 comprehensive training samples

## 🤖 ML Model Performance

| Metric | Value |
|--------|-------|
| **Overall Accuracy** | 75.4% |
| **Training Samples** | 487 |
| **Fraud Samples** | 225 |
| **Legitimate Samples** | 262 |
| **Features** | 5000 TF-IDF |
| **N-gram Range** | (1, 4) |

### Language-Specific Performance
- **Malayalam**: 91.7% fraud detection
- **Marathi**: 93.9% fraud detection  
- **Bengali**: 90.8% fraud detection
- **Telugu**: 91.0% fraud detection
- **All Languages**: 90%+ critical fraud detection

## 🌍 Multi-Language Support

| Language | Script | Code | Status |
|----------|--------|------|--------|
| English | Latin | en-US | ✅ Active |
| Hindi | Devanagari | hi-IN | ✅ Active |
| Telugu | Telugu | te-IN | ✅ Active |
| Tamil | Tamil | ta-IN | ✅ Active |
| Kannada | Kannada | kn-IN | ✅ Active |
| Malayalam | Malayalam | ml-IN | ✅ Active |
| Marathi | Devanagari | mr-IN | ✅ Active |
| Bengali | Bengali | bn-IN | ✅ Active |

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.7+ with pip
- Modern web browser with microphone access
- Internet connection for API calls

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ByteQuest-2025/GFGBQ-Team-syndicate-members.git
   cd GFGBQ-Team-syndicate-members/fraud-audio-detection
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   pip install -r requirements.txt
   python ml_fraud_detector.py train  # Train ML model
   npm start
   ```
   Server runs on `http://localhost:5000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   App runs on `http://localhost:3000`

## 🎯 Usage

1. **Start Protection** - Click "Start Protection" to begin monitoring
2. **Grant Permissions** - Allow microphone access when prompted
3. **Select Language** - Choose your preferred language from dropdown
4. **Real-time Analysis** - System analyzes speech in real-time
5. **Instant Alerts** - Receive immediate warnings for suspicious calls
6. **Stay Safe** - Follow the system's recommendations

## 🔍 API Documentation

### Analyze Text
```http
POST /api/analyze-text
Content-Type: application/json

{
  "transcript": "Your bank account has been blocked share OTP immediately"
}
```

**Response:**
```json
{
  "riskLevel": "Critical",
  "scamPercentage": 91,
  "confidence": 0.91,
  "message": "🚨 CRITICAL SCAM ALERT: Extremely high fraud probability detected!",
  "mlPrediction": {
    "isFraud": true,
    "fraudProbability": 0.91,
    "riskLevel": "Critical"
  },
  "detectedLanguage": "en",
  "languageName": "English",
  "analysisMethod": "ML-Powered Detection"
}
```

### Train Model
```http
POST /api/train-model
```

### Get Supported Languages
```http
GET /api/languages
```

### Emergency Alert
```http
POST /api/emergency-alert
Content-Type: application/json

{
  "phoneNumber": "+91-9876543210",
  "transcript": "Scam call transcript",
  "userLocation": "Mumbai, India"
}
```

## 🛡️ Security Features

- **Advanced ML Detection** - Ensemble model with multiple algorithms
- **Multi-language Analysis** - Unicode-aware text processing
- **Real-world Patterns** - 487 actual fraud techniques
- **Privacy First** - No personal data storage
- **Local Processing** - Speech recognition in browser
- **Emergency Alerts** - Automatic threat logging

## 📊 Fraud Detection Categories

| Category | Examples | Risk Level |
|----------|----------|------------|
| **Banking Scams** | "Account blocked", "Share OTP" | Critical |
| **Government Threats** | "Police case", "Arrest warrant" | Critical |
| **Prize Scams** | "Lottery winner", "Processing fee" | High |
| **Tech Support** | "Computer virus", "Remote access" | High |
| **Delivery Scams** | "Parcel held", "Customs fee" | Medium |

## 🎨 UI/UX Highlights

- **Modern Design** - Gradient backgrounds and smooth animations
- **Accessibility** - Large fonts and high contrast for elderly users
- **Visual Feedback** - Color-coded risk levels (Red/Yellow/Green)
- **Responsive** - Works on desktop and mobile devices
- **Multi-language UI** - Native language support
- **Intuitive** - Simple interface with clear instructions

## 📁 Project Structure

```
fraud-audio-detection/
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   └── index.js        # Entry point
│   ├── package.json        # Frontend dependencies
│   └── package-lock.json
├── backend/
│   ├── server.js           # Node.js server
│   ├── ml_fraud_detector.py # Python ML model
│   ├── requirements.txt    # Python dependencies
│   ├── package.json        # Backend dependencies
│   ├── setup.bat          # Windows setup script
│   └── ML_TEST_RESULTS.md # ML performance results
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔮 Future Roadmap

- [ ] Mobile app development (Android/iOS)
- [ ] Voice pattern analysis integration
- [ ] Government database integration
- [ ] Community reporting features
- [ ] Smart home integration
- [ ] Advanced ML models (BERT, Transformers)
- [ ] Real-time collaboration features
- [ ] Blockchain-based fraud reporting

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📸 Live Application Screenshots

### 🏠 Main Dashboard
<div align="center">
  <img src="./screenshot pics/main home page.png" alt="ScamShield Main Interface" width="600">
  <p><em>Clean, elderly-friendly interface with intuitive controls</em></p>
</div>

### 🌐 Multi-Language Support
<div align="center">
  <img src="./screenshot pics/language show.png" alt="Language Selection" width="600">
  <p><em>8 Indian languages with native script support</em></p>
</div>

### 🎤 Real-Time Speech Processing
<div align="center">
  <img src="./screenshot pics/voice to speech conversion ui.png" alt="Speech Recognition" width="600">
  <p><em>Live speech-to-text with instant fraud analysis</em></p>
</div>

### 🚨 Fraud Detection System

<table align="center">
<tr>
<td align="center">
<img src="./screenshot pics/complete Fraud Detection popup.jpeg" alt="Critical Alert" width="280">
<br><strong>Critical Risk Alert</strong>
</td>
<td align="center">
<img src="./screenshot pics/High Risk of Call.jpeg" alt="High Risk" width="280">
<br><strong>High Risk Warning</strong>
</td>
</tr>
<tr>
<td align="center">
<img src="./screenshot pics/medium Risk Call popup.jpeg" alt="Medium Risk" width="280">
<br><strong>Medium Risk Caution</strong>
</td>
<td align="center">
<img src="./screenshot pics/Test Results.png" alt="Live Testing" width="280">
<br><strong>Live Test Results</strong>
</td>
</tr>
</table>

### 🤖 ML Model Training & Performance

<div align="center">
  <img src="./screenshot pics/train Result 1.png" alt="ML Training Results" width="500">
  <p><em>ML model training with 487 samples achieving 75.4% accuracy</em></p>
</div>

<div align="center">
  <img src="./screenshot pics/Train Result 2.png" alt="Training Metrics" width="500">
  <p><em>Comprehensive performance metrics and validation results</em></p>
</div>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Team Syndicate Members

**ByteQuest 2025 - GeeksforGeeks Hackathon**

- Advanced ML implementation with ensemble models
- Multi-language fraud detection system
- Real-time speech processing
- Production-ready deployment

## 🙏 Acknowledgments

- Web Speech API for real-time transcription
- scikit-learn for machine learning capabilities
- React.js community for excellent documentation
- Fraud research organizations for pattern data
- Beta testers and elderly user feedback
- GeeksforGeeks for hosting ByteQuest 2025

## 📞 Support

For support, create an issue in this repository or contact the development team.

---

<div align="center">
  <h3>🏆 ByteQuest 2025 - GeeksforGeeks Hackathon</h3>
  <strong>🛡️ Protecting millions from fraud, one call at a time</strong>
  <br><br>
  <em>Built with ❤️ by Team Syndicate Members</em>
  <br>
  <img src="https://img.shields.io/badge/Hackathon-ByteQuest%202025-ff6b6b?style=for-the-badge" alt="Hackathon">
  <img src="https://img.shields.io/badge/Team-Syndicate%20Members-4ecdc4?style=for-the-badge" alt="Team">
</div>
