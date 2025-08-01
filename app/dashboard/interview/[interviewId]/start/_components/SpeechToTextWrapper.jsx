"use client"
import React, { useEffect } from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import { Square, Play } from 'lucide-react';

function SpeechToTextWrapper({ 
  userAnswer, 
  setUserAnswer, 
  setFeedback, 
  loading, 
  onUpdateAnswer 
}) {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    if (results && results.length > 0) {
      results.forEach((result) => {
        if (result?.transcript) {
          setUserAnswer(prevAns => prevAns + result.transcript)
        }
      })
    }
  }, [results, setUserAnswer])

  useEffect(() => {
    if(!isRecording && userAnswer.length > 10) {
      onUpdateAnswer();
    }
  }, [userAnswer, isRecording, onUpdateAnswer])

  const StartStopRecording = async() => {
    if(isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
      setUserAnswer("");
      setFeedback(null);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 my-10">
      {!isRecording ? (
        <button 
          onClick={StartStopRecording} 
          disabled={loading}
          className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 transition flex items-center gap-2 ${
            loading 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400'
          }`}
        >
          <Play size={20} />
          {loading ? 'Processing...' : 'Start Recording'}
        </button>
      ) : (
        <button 
          disabled={loading}
          onClick={StartStopRecording} 
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition flex items-center gap-2 animate-pulse"
        >
          <Square size={20} />
          Stop Recording
        </button>
      )}

      {/* Recording Status Indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 text-red-600">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Recording in progress...</span>
        </div>
      )}

      {/* Processing Indicator */}
      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Generating feedback...</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg max-w-md border border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">Speech Recognition Error:</h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}

export default SpeechToTextWrapper