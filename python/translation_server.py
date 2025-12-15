"""
Free Local Translation Server with improved reliability
Features: Retry logic, timeout handling, and better error messages
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator
import logging
import time
from functools import wraps

app = Flask(__name__)
CORS(app)  # Enable CORS for Electron app

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Retry decorator for handling transient errors
def retry_on_failure(max_attempts=3, delay=1, backoff=2):
    """Retry decorator with exponential backoff"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            current_delay = delay
            
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempts += 1
                    if attempts >= max_attempts:
                        raise e
                    
                    error_msg = str(e)
                    if 'handshake' in error_msg.lower() or 'timeout' in error_msg.lower():
                        logger.warning(f"Attempt {attempts}/{max_attempts} failed: {error_msg}. Retrying in {current_delay}s...")
                        time.sleep(current_delay)
                        current_delay *= backoff
                    else:
                        raise e
            return None
        return wrapper
    return decorator

@retry_on_failure(max_attempts=3, delay=1, backoff=2)
def translate_with_retry(text, src, dest):
    """Translate with retry logic"""
    # Create a fresh translator instance for each request to avoid connection reuse issues
    translator = Translator()
    result = translator.translate(text, src=src, dest=dest)
    return result

@retry_on_failure(max_attempts=3, delay=1, backoff=2)
def detect_with_retry(text):
    """Detect language with retry logic"""
    translator = Translator()
    result = translator.detect(text)
    return result

@app.route('/translate', methods=['POST'])
def translate():
    """Translate text from source language to target language"""
    try:
        data = request.get_json()
        
        text = data.get('q', '')
        source = data.get('source', 'auto')
        target = data.get('target', 'en')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Limit text length to avoid timeout issues
        max_length = 5000
        if len(text) > max_length:
            text = text[:max_length]
            logger.warning(f"Text truncated to {max_length} characters")
        
        # Translate using googletrans with retry logic
        result = translate_with_retry(text, source, target)
        
        if result is None:
            return jsonify({'error': 'Translation failed after multiple attempts'}), 500
        
        response = {
            'translatedText': result.text,
            'detectedLanguage': {
                'language': result.src
            }
        }
        
        logger.info(f"✓ Translated: {text[:50]}... ({source} -> {target})")
        return jsonify(response)
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Translation error: {error_msg}")
        
        # Provide more helpful error messages
        if 'handshake' in error_msg.lower() or 'timeout' in error_msg.lower():
            return jsonify({
                'error': 'Connection timeout - Google Translate servers may be slow or blocking requests. Please try again.'
            }), 503
        elif 'ssl' in error_msg.lower():
            return jsonify({
                'error': 'SSL connection error. Please check your internet connection.'
            }), 503
        else:
            return jsonify({'error': error_msg}), 500

@app.route('/detect', methods=['POST'])
def detect():
    """Detect language of text"""
    try:
        data = request.get_json()
        text = data.get('q', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Detect language with retry logic
        result = detect_with_retry(text)
        
        if result is None:
            return jsonify({'error': 'Detection failed after multiple attempts'}), 500
        
        response = [{
            'language': result.lang,
            'confidence': result.confidence
        }]
        
        logger.info(f"✓ Detected: {result.lang} (confidence: {result.confidence})")
        return jsonify(response)
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Detection error: {error_msg}")
        
        if 'handshake' in error_msg.lower() or 'timeout' in error_msg.lower():
            return jsonify({
                'error': 'Connection timeout during language detection'
            }), 503
        else:
            return jsonify({'error': error_msg}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok', 
        'message': 'Translation server is running',
        'features': {
            'retry_logic': True,
            'timeout_handling': True,
            'max_retries': 3
        }
    })

if __name__ == '__main__':
    print("="*50)
    print("🌍 Enhanced Translation Server Starting...")
    print("Features: Auto-retry, timeout handling, error recovery")
    print("Using Google Translate (no API key needed)")
    print("Server running on http://localhost:5000")
    print("="*50)
    app.run(host='0.0.0.0', port=5000, debug=False)
