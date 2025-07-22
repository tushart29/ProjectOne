import React, { useState } from 'react';
import './SpeechRecorder.css';

const SpeechRecorder = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  
  const API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY; 
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setText('');
    } else {
      setText('Error: Please select a valid audio file');
      setAudioFile(null);
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) {
      setText('Error: No audio file selected');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model_id', 'scribe_v1'); // Use ElevenLabs Scribe v1 model
      formData.append('enable_diarization', 'true'); // Optional: Enable speaker diarization

      const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setText(result.text || 'No transcription available');
    } catch (error) {
      console.error('Transcription error:', error);
      setText('Error: Could not transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="speech-recorder-container">
      <h1 className="speech-recorder-title">AI Recorder</h1>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="speech-recorder-input"
        disabled={isProcessing}
      />
      <button
        className={isProcessing ? 'speech-recorder-button processing' : 'speech-recorder-button'}
        onClick={handleTranscribe}
        disabled={!audioFile || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Transcribe Audio'}
      </button>
      {text && <p className="speech-recorder-text">Transcribed Text: {text}</p>}
    </div>
  );
};

export default SpeechRecorder;