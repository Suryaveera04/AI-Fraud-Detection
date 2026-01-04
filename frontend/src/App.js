import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [riskLevel, setRiskLevel] = useState('Low');
  const [confidence, setConfidence] = useState(0);
  const [scamPercentage, setScamPercentage] = useState(0);
  const [message, setMessage] = useState('System ready');
  const [status, setStatus] = useState('Ready');
  const [callDuration, setCallDuration] = useState(0);
  const [showFraudAlert, setShowFraudAlert] = useState(false);
  const [showSpamAlert, setShowSpamAlert] = useState(false);
  const [lastSpeechTime, setLastSpeechTime] = useState(Date.now());
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [detectedLanguage, setDetectedLanguage] = useState('English');
  const [supportedLanguages, setSupportedLanguages] = useState({});
  const [translatedText, setTranslatedText] = useState('');
  const intervalRef = useRef(null);
  const recognitionRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const alertTimeoutRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const spamAlertTimeoutRef = useRef(null);

  // Load supported languages on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/languages')
      .then(response => response.json())
      .then(data => setSupportedLanguages(data.supported))
      .catch(err => console.log('Failed to load languages:', err));
  }, []);

  // Initialize Speech Recognition
  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMessage('Speech recognition not supported in this browser');
      setStatus('Error');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage; // Use selected language

    recognition.onstart = () => {
      setStatus('Listening');
      setMessage('Listening for speech...');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      // Update last speech time when any speech is detected
      if (finalTranscript || interimTranscript) {
        setLastSpeechTime(Date.now());
        resetSilenceTimer();
      }
      
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        analyzeAudio(transcript + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setMessage('Microphone access denied. Please allow microphone access.');
        setStatus('Error');
      } else {
        setMessage(`Speech recognition error: ${event.error}`);
        setStatus('Error');
      }
    };

    recognition.onend = () => {
      if (isMonitoring) {
        recognition.start(); // Restart if still monitoring
      }
    };

    return recognition;
  };

  // Analyze transcript with backend
  const analyzeAudio = async (text) => {
    setStatus('Analyzing');
    try {
      const response = await fetch('http://localhost:5000/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text })
      });
      const result = await response.json();
      setRiskLevel(result.riskLevel);
      setMessage(result.message);
      setScamPercentage(result.scamPercentage || 0);
      setDetectedLanguage(result.languageName || 'Unknown');
      setTranslatedText(result.translatedText || '');
      
      if (result.riskLevel === 'High') {
        setStatus('Scam Detected');
        triggerFraudAlert();
      } else if (result.riskLevel === 'Medium') {
        setStatus('Spam Detected');
        triggerSpamAlert();
      } else {
        setStatus('Listening');
      }
    } catch (error) {
      setMessage('Connection error');
      setStatus('Error');
    }
  };

  // Trigger spam alert for medium risk calls
  const triggerSpamAlert = () => {
    setShowSpamAlert(true);
    
    // Browser notification for spam
    if (Notification.permission === 'granted') {
      new Notification('⚠️ SPAM CALL DETECTED', {
        body: 'This call may be spam. Be cautious about sharing information.',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚠️</text></svg>',
        tag: 'spam-alert'
      });
    }
    
    // Gentle audio alert for spam (less aggressive than fraud)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Spam audio alert failed:', error);
    }
    
    // Auto-hide spam alert after 8 seconds
    spamAlertTimeoutRef.current = setTimeout(() => {
      setShowSpamAlert(false);
    }, 8000);
  };

  // Trigger fraud alert with sound and visual effects
  const triggerFraudAlert = () => {
    setShowFraudAlert(true);
    
    // Send emergency alert to backend
    fetch('http://localhost:5000/api/emergency-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: 'Unknown',
        transcript: transcript,
        userLocation: 'Browser'
      })
    }).catch(err => console.log('Emergency alert failed:', err));
    
    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification('🚨 SCAM ALERT!', {
        body: 'Fraud detected! Do not share personal information!',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🚨</text></svg>',
        requireInteraction: true,
        tag: 'scam-alert'
      });
    }
    
    // Enhanced audio alert with siren pattern
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create siren-like sound pattern
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Alternating high-low frequency for siren effect
          const freq = i % 2 === 0 ? 800 : 1200;
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.4);
        }, i * 500);
      }
    } catch (error) {
      console.log('Audio alert failed:', error);
    }
    
    // Vibration on mobile devices
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Auto-hide alert after 15 seconds
    alertTimeoutRef.current = setTimeout(() => {
      setShowFraudAlert(false);
    }, 15000);
  };

  // Auto-stop monitoring when call ends (silence detection)
  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    // Stop monitoring after 10 seconds of silence
    silenceTimeoutRef.current = setTimeout(() => {
      if (isMonitoring) {
        setStatus('Call Ended');
        setMessage('Call ended - monitoring stopped automatically');
        stopMonitoring();
      }
    }, 10000); // 10 seconds of silence
  };

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Start monitoring
  const startMonitoring = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize speech recognition
      const recognition = initSpeechRecognition();
      if (!recognition) return;
      
      recognitionRef.current = recognition;
      setIsMonitoring(true);
      setTranscript('');
      setCallDuration(0);
      setLastSpeechTime(Date.now());
      
      // Start call duration timer
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Start silence detection
      resetSilenceTimer();
      
      // Start speech recognition
      recognition.start();
      
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setMessage('Microphone access denied. Please allow microphone access and try again.');
      } else if (error.name === 'NotFoundError') {
        setMessage('No microphone found. Please connect a microphone.');
      } else {
        setMessage(`Microphone error: ${error.message}`);
      }
      setStatus('Error');
    }
  };

  // Stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);
    setStatus('Ready');
    setMessage('Monitoring stopped');
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    if (spamAlertTimeoutRef.current) {
      clearTimeout(spamAlertTimeoutRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (spamAlertTimeoutRef.current) {
        clearTimeout(spamAlertTimeoutRef.current);
      }
    };
  }, []);

  // Enhanced styles for better visual appeal
  const styles = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      fontSize: '48px',
      fontWeight: '700',
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
    },
    subtitle: {
      textAlign: 'center',
      fontSize: '20px',
      color: '#666',
      marginBottom: '40px',
      fontWeight: '300'
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      marginBottom: '40px'
    },
    button: {
      padding: '18px 40px',
      fontSize: '20px',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    startButton: {
      background: 'linear-gradient(45deg, #4CAF50, #45a049)',
      color: 'white'
    },
    stopButton: {
      background: 'linear-gradient(45deg, #f44336, #d32f2f)',
      color: 'white'
    },
    alertCard: {
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      textAlign: 'center',
      border: '3px solid',
      position: 'relative',
      overflow: 'hidden'
    },
    alertCardBefore: {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '4px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      animation: 'shimmer 2s infinite'
    },
    highRiskAlert: {
      background: 'linear-gradient(135deg, #ff4757, #ff3742)',
      color: 'white',
      borderColor: '#ff1744',
      boxShadow: '0 15px 35px rgba(255, 71, 87, 0.3)'
    },
    mediumRiskAlert: {
      background: 'linear-gradient(135deg, #ffa726, #ff9800)',
      color: 'white',
      borderColor: '#ff8f00',
      boxShadow: '0 15px 35px rgba(255, 167, 38, 0.3)'
    },
    safeAlert: {
      background: 'linear-gradient(135deg, #66bb6a, #4caf50)',
      color: 'white',
      borderColor: '#388e3c',
      boxShadow: '0 15px 35px rgba(102, 187, 106, 0.3)'
    },
    riskIcon: {
      fontSize: '60px',
      marginBottom: '15px',
      display: 'block'
    },
    riskTitle: {
      fontSize: '36px',
      fontWeight: '700',
      marginBottom: '15px',
      textTransform: 'uppercase',
      letterSpacing: '2px'
    },
    warningMessage: {
      fontSize: '24px',
      fontWeight: '600',
      padding: '20px',
      borderRadius: '15px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginTop: '20px',
      border: '2px dashed rgba(255,255,255,0.5)'
    },
    infoCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '25px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
      border: '1px solid #e0e0e0'
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    transcript: {
      backgroundColor: '#f8f9fa',
      padding: '25px',
      borderRadius: '12px',
      minHeight: '120px',
      maxHeight: '200px',
      overflow: 'auto',
      fontSize: '18px',
      lineHeight: '1.6',
      border: '2px solid #e9ecef',
      color: '#495057',
      fontFamily: 'Monaco, Consolas, monospace'
    },
    statusBar: {
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      color: 'white',
      padding: '20px',
      borderRadius: '15px',
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: '600',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    statusLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    statusRight: {
      fontSize: '18px',
      fontWeight: '500'
    },
    durationDisplay: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#4caf50',
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
    },
    fraudAlert: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(255, 0, 0, 0.95)',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      animation: 'alertPulse 1s infinite',
      color: 'white',
      backdropFilter: 'blur(5px)'
    },
    fraudAlertIcon: {
      fontSize: '150px',
      marginBottom: '30px',
      animation: 'bounce 0.5s infinite alternate',
      textShadow: '0 0 20px rgba(255,255,255,0.8)'
    },
    fraudAlertTitle: {
      fontSize: '64px',
      fontWeight: '900',
      marginBottom: '30px',
      textAlign: 'center',
      textShadow: '4px 4px 8px rgba(0,0,0,0.7)',
      letterSpacing: '3px'
    },
    fraudAlertMessage: {
      fontSize: '36px',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '40px',
      maxWidth: '900px',
      lineHeight: '1.4',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
    },
    fraudAlertActions: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    fraudAlertButton: {
      padding: '20px 40px',
      fontSize: '24px',
      backgroundColor: 'white',
      color: '#ff0000',
      border: 'none',
      borderRadius: '50px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease'
    },
    emergencyButton: {
      backgroundColor: '#ffeb3b',
      color: '#d32f2f'
    },
    spamAlert: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#ff9800',
      color: 'white',
      padding: '20px 30px',
      borderRadius: '15px',
      zIndex: '8888',
      boxShadow: '0 8px 25px rgba(255, 152, 0, 0.4)',
      animation: 'slideIn 0.5s ease-out',
      maxWidth: '400px',
      border: '3px solid #f57c00'
    },
    spamAlertIcon: {
      fontSize: '32px',
      marginRight: '15px',
      verticalAlign: 'middle'
    },
    spamAlertContent: {
      display: 'inline-block',
      verticalAlign: 'middle'
    },
    spamAlertTitle: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '5px'
    },
    spamAlertMessage: {
      fontSize: '14px',
      fontWeight: '500',
      opacity: '0.9'
    },
    spamAlertClose: {
      position: 'absolute',
      top: '10px',
      right: '15px',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    percentageDisplay: {
      fontSize: '48px',
      fontWeight: '900',
      marginBottom: '10px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    percentageLabel: {
      fontSize: '18px',
      fontWeight: '600',
      opacity: '0.9',
      marginBottom: '15px'
    },
    languageSelector: {
      textAlign: 'center',
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      backdropFilter: 'blur(10px)'
    },
    languageLabel: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'white',
      marginRight: '15px'
    },
    languageSelect: {
      padding: '12px 20px',
      fontSize: '16px',
      borderRadius: '25px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#333',
      fontWeight: '500',
      cursor: 'pointer',
      minWidth: '250px'
    },
    translationSection: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#e3f2fd',
      borderRadius: '10px',
      border: '2px solid #2196f3'
    },
    translationTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1976d2',
      marginBottom: '10px'
    },
    translationContent: {
      fontSize: '16px',
      color: '#333',
      fontStyle: 'italic',
      lineHeight: '1.5'
    },
    statusIndicator: {
      display: 'inline-block',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      marginRight: '10px',
      animation: 'pulse 2s infinite'
    },
    pulseAnimation: {
      '@keyframes pulse': {
        '0%': { opacity: 1 },
        '50%': { opacity: 0.5 },
        '100%': { opacity: 1 }
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAlertStyle = () => {
    if (riskLevel === 'High') {
      return { ...styles.alertCard, ...styles.highRiskAlert };
    } else if (riskLevel === 'Medium') {
      return { ...styles.alertCard, ...styles.mediumRiskAlert };
    } else {
      return { ...styles.alertCard, ...styles.safeAlert };
    }
  };

  const getRiskIcon = () => {
    if (riskLevel === 'High') return '🚨';
    if (riskLevel === 'Medium') return '⚠️';
    return '✅';
  };

  const getStatusColor = () => {
    if (status === 'Scam Detected') return '#ff4757';
    if (status === 'Analyzing') return '#ffa726';
    if (status === 'Listening') return '#4caf50';
    return '#667eea';
  };

  return React.createElement('div', { style: styles.container }, [
    React.createElement('div', { key: 'content', style: styles.contentWrapper }, [
      React.createElement('h1', { key: 'header', style: styles.header }, 'ScamShield'),
      React.createElement('p', { key: 'subtitle', style: styles.subtitle }, 'AI-Powered Real-Time Scam Call Protection - Multi-Language Support'),
      
      // Language Selector
      React.createElement('div', { key: 'language-selector', style: styles.languageSelector }, [
        React.createElement('label', { key: 'lang-label', style: styles.languageLabel }, 'Select Language: '),
        React.createElement('select', {
          key: 'lang-select',
          style: styles.languageSelect,
          value: selectedLanguage,
          onChange: (e) => setSelectedLanguage(e.target.value)
        }, [
          React.createElement('option', { key: 'en', value: 'en-US' }, '🇺🇸 English'),
          React.createElement('option', { key: 'hi', value: 'hi-IN' }, '🇮🇳 हिंदी (Hindi)'),
          React.createElement('option', { key: 'te', value: 'te-IN' }, '🇮🇳 తెలుగు (Telugu)'),
          React.createElement('option', { key: 'ta', value: 'ta-IN' }, '🇮🇳 தமிழ் (Tamil)'),
          React.createElement('option', { key: 'kn', value: 'kn-IN' }, '🇮🇳 ಕನ್ನಡ (Kannada)'),
          React.createElement('option', { key: 'bn', value: 'bn-IN' }, '🇮🇳 বাংলা (Bengali)'),
          React.createElement('option', { key: 'mr', value: 'mr-IN' }, '🇮🇳 मराठी (Marathi)'),
          React.createElement('option', { key: 'gu', value: 'gu-IN' }, '🇮🇳 ગુજરાતી (Gujarati)'),
          React.createElement('option', { key: 'ml', value: 'ml-IN' }, '🇮🇳 മലയാളം (Malayalam)'),
          React.createElement('option', { key: 'pa', value: 'pa-IN' }, '🇮🇳 ਪੰਜਾਬੀ (Punjabi)')
        ])
      ]),
      
      React.createElement('div', { key: 'controls', style: styles.controls }, [
        React.createElement('button', {
          key: 'start',
          style: { ...styles.button, ...styles.startButton },
          onClick: startMonitoring,
          disabled: isMonitoring
        }, isMonitoring ? 'Listening...' : '🎤 Start Protection'),
        React.createElement('button', {
          key: 'stop',
          style: { ...styles.button, ...styles.stopButton },
          onClick: stopMonitoring,
          disabled: !isMonitoring
        }, '🛑 Stop Protection')
      ]),

      React.createElement('div', { key: 'alert', style: getAlertStyle() }, [
        React.createElement('span', { key: 'icon', style: styles.riskIcon }, getRiskIcon()),
        React.createElement('div', { key: 'title', style: styles.riskTitle }, `${riskLevel.toUpperCase()} RISK`),
        React.createElement('div', { key: 'percentage', style: styles.percentageDisplay }, `${scamPercentage}%`),
        React.createElement('div', { key: 'percentage-label', style: styles.percentageLabel }, 'Scam Probability'),
        React.createElement('div', { key: 'message', style: { fontSize: '20px', marginBottom: '15px' } }, message),
        (riskLevel === 'High' || riskLevel === 'Medium') && React.createElement('div', {
          key: 'warning-msg',
          style: styles.warningMessage
        }, '🔒 NEVER share OTP, passwords, or bank details over phone calls')
      ]),

      React.createElement('div', { key: 'transcript-card', style: styles.infoCard }, [
        React.createElement('h3', { key: 'transcript-title', style: styles.cardTitle }, [
          React.createElement('span', { key: 'icon' }, '📝'),
          `Live Transcript (${detectedLanguage})`
        ]),
        React.createElement('div', { key: 'transcript-content', style: styles.transcript }, 
          transcript || 'Start protection to see real-time transcript of your calls...'
        ),
        translatedText && React.createElement('div', { key: 'translation-section', style: styles.translationSection }, [
          React.createElement('h4', { key: 'translation-title', style: styles.translationTitle }, '🌍 English Translation:'),
          React.createElement('div', { key: 'translation-content', style: styles.translationContent }, translatedText)
        ])
      ]),

      React.createElement('div', { key: 'status', style: styles.statusBar }, [
        React.createElement('div', { key: 'status-left', style: styles.statusLeft }, [
          React.createElement('span', {
            key: 'indicator',
            style: {
              ...styles.statusIndicator,
              backgroundColor: getStatusColor()
            }
          }),
          `Status: ${status}`
        ]),
        isMonitoring && React.createElement('div', { key: 'status-right', style: styles.statusRight }, [
          React.createElement('div', { key: 'duration-label' }, 'Call Duration:'),
          React.createElement('div', { key: 'duration-time', style: styles.durationDisplay }, formatDuration(callDuration))
        ])
      ])
    ]),

    // Spam Alert Notification (top-right corner)
    showSpamAlert && React.createElement('div', { key: 'spam-alert', style: styles.spamAlert }, [
      React.createElement('span', { key: 'spam-icon', style: styles.spamAlertIcon }, '⚠️'),
      React.createElement('div', { key: 'spam-content', style: styles.spamAlertContent }, [
        React.createElement('div', { key: 'spam-title', style: styles.spamAlertTitle }, `SPAM CALL - ${scamPercentage}% Risk`),
        React.createElement('div', { key: 'spam-message', style: styles.spamAlertMessage }, 'Be cautious - this may be a spam call')
      ]),
      React.createElement('button', {
        key: 'spam-close',
        style: styles.spamAlertClose,
        onClick: () => setShowSpamAlert(false)
      }, '×')
    ]),

    // Fraud Alert Overlay
    showFraudAlert && React.createElement('div', { key: 'fraud-alert', style: styles.fraudAlert }, [
      React.createElement('div', { key: 'alert-icon', style: styles.fraudAlertIcon }, '🚨'),
      React.createElement('div', { key: 'alert-title', style: styles.fraudAlertTitle }, 'FRAUD DETECTED!'),
      React.createElement('div', { key: 'alert-message', style: styles.fraudAlertMessage }, 
        'This call appears to be a SCAM! Do NOT share any personal information, OTP, passwords, or bank details. Hang up immediately!'
      ),
      React.createElement('div', { key: 'alert-actions', style: styles.fraudAlertActions }, [
        React.createElement('button', {
          key: 'hang-up-button',
          style: { ...styles.fraudAlertButton, ...styles.emergencyButton },
          onClick: () => {
            setShowFraudAlert(false);
            stopMonitoring();
          }
        }, '📞 Hang Up Now'),
        React.createElement('button', {
          key: 'close-button',
          style: styles.fraudAlertButton,
          onClick: () => setShowFraudAlert(false)
        }, 'I Understand')
      ])
    ])
  ]);
};

export default App;