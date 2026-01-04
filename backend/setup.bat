@echo off
echo Installing Python dependencies for ML fraud detection...
pip install -r requirements.txt

echo.
echo Training ML model with comprehensive dataset...
python ml_fraud_detector.py train

echo.
echo Setup complete! ML-powered fraud detection is ready.
echo You can now start the server with: node server.js
pause