const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json());

// ================= SUPPORTED LANGUAGES =================
const SUPPORTED_LANGUAGES = {
  en: { name: "English", code: "en-US" },
  hi: { name: "Hindi", code: "hi-IN" },
  te: { name: "Telugu", code: "te-IN" },
  ta: { name: "Tamil", code: "ta-IN" },
  kn: { name: "Kannada", code: "kn-IN" },
  ml: { name: "Malayalam", code: "ml-IN" },
  mr: { name: "Marathi", code: "mr-IN" },
  bn: { name: "Bengali", code: "bn-IN" }
};

// ================= LANGUAGE DETECTION =================
function detectLanguage(text) {
  if (/[\u0900-\u097F]/.test(text)) return "hi"; // Hindi
  if (/[\u0C00-\u0C7F]/.test(text)) return "te"; // Telugu
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta"; // Tamil
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn"; // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml"; // Malayalam
  if (/[\u0980-\u09FF]/.test(text)) return "bn"; // Bengali
  return "en"; // Default to English
}

// ================= ML INTEGRATION =================
function runPythonScript(command, text = "") {
  return new Promise((resolve, reject) => {
    const pythonPath = "python";
    const scriptPath = path.join(__dirname, "ml_fraud_detector.py");
    
    const args = [scriptPath, command];
    if (text) args.push(text);
    
    const pythonProcess = spawn(pythonPath, args);
    
    let output = "";
    let errorOutput = "";
    
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output.trim());
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse Python output: ${output}`));
        }
      } else {
        reject(new Error(`Python script failed: ${errorOutput}`));
      }
    });
    
    pythonProcess.on("error", (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}

// ================= ML-POWERED ANALYSIS =================
async function analyzeTranscriptML(transcript) {
  try {
    const mlResult = await runPythonScript("predict", transcript);
    
    if (mlResult.status !== "success") {
      throw new Error(mlResult.error || "ML prediction failed");
    }
    
    const prediction = mlResult.prediction;
    const detectedLang = detectLanguage(transcript);
    let scamPercentage = Math.round(prediction.fraud_probability * 100);
    
    let finalRiskLevel = "Low";
    let finalMessage = "Call appears safe";
    
    if (prediction.risk_level === "Critical") {
      finalRiskLevel = "Critical";
      finalMessage = "🚨 CRITICAL SCAM ALERT: Extremely high fraud probability detected!";
    } else if (prediction.risk_level === "High") {
      finalRiskLevel = "High";
      finalMessage = "⚠️ HIGH RISK SCAM: Strong fraud indicators detected!";
    } else if (prediction.risk_level === "Medium") {
      finalRiskLevel = "Medium";
      finalMessage = "⚠️ SUSPICIOUS: Potential fraud patterns detected.";
    } else {
      finalRiskLevel = "Low";
      finalMessage = "✅ Call appears legitimate.";
    }
    
    return {
      riskLevel: finalRiskLevel,
      scamPercentage,
      confidence: prediction.confidence,
      message: finalMessage,
      mlPrediction: {
        isFraud: prediction.is_fraud,
        fraudProbability: prediction.fraud_probability,
        riskLevel: prediction.risk_level
      },
      detectedLanguage: detectedLang,
      languageName: SUPPORTED_LANGUAGES[detectedLang]?.name || "Unknown",
      originalText: transcript,
      analysisMethod: "ML-Powered Detection"
    };
  } catch (error) {
    console.error("ML Analysis failed:", error.message);
    return {
      riskLevel: "Low",
      scamPercentage: 10,
      confidence: 0.1,
      message: "Analysis unavailable - system error",
      analysisMethod: "Error Fallback",
      mlError: error.message,
      detectedLanguage: detectLanguage(transcript),
      languageName: SUPPORTED_LANGUAGES[detectLanguage(transcript)]?.name || "Unknown",
      originalText: transcript
    };
  }
}

// ================= API ENDPOINTS =================
app.post("/api/analyze-text", async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }

  const analysis = await analyzeTranscriptML(transcript);
  res.json(analysis);
});

app.post("/api/train-model", async (req, res) => {
  try {
    console.log("Starting ML model training...");
    const result = await runPythonScript("train");
    
    if (result.status === "success") {
      res.json({
        success: true,
        message: "Model trained successfully",
        results: result.results
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || "Training failed"
      });
    }
  } catch (error) {
    console.error("Training error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/api/languages", (req, res) => {
  res.json({
    supported: SUPPORTED_LANGUAGES,
    total: Object.keys(SUPPORTED_LANGUAGES).length
  });
});

app.post("/api/emergency-alert", async (req, res) => {
  const { phoneNumber, transcript, userLocation } = req.body;
  
  console.log("🚨 EMERGENCY FRAUD ALERT:", {
    timestamp: new Date().toISOString(),
    phoneNumber,
    transcript,
    userLocation
  });
  
  res.json({
    success: true,
    message: "Emergency alert logged",
    alertId: Date.now().toString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    supportedLanguages: Object.keys(SUPPORTED_LANGUAGES).length,
    mlEnabled: true,
    version: "2.0-ML"
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🛡️ ScamShield ML Backend running on http://localhost:${PORT}`);
  console.log(`🤖 ML-Powered Fraud Detection Active`);
  console.log(`🌐 Languages supported: ${Object.keys(SUPPORTED_LANGUAGES).length}`);
  console.log(`📊 Training model on startup...`);
  
  // Auto-train model on startup
  runPythonScript("train")
    .then(result => {
      if (result.status === "success") {
        console.log(`✅ Model trained successfully with ${result.results.accuracy * 100}% accuracy`);
        console.log(`📈 Training samples: ${result.results.training_samples}`);
      }
    })
    .catch(error => {
      console.log(`⚠️ Model training failed: ${error.message}`);
    });
});