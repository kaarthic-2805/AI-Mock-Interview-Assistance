"use client"
import React, { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Mic, MicOff, Square, Play } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { UserAnswer } from '../../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import moment from 'moment';

// Dynamically import Webcam to avoid SSR issues
const Webcam = dynamic(() => import('react-webcam'), { 
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">Loading camera...</div>
});

function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex, interviewData}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const {user} = useUser();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Speech recognition states
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimResult, setInterimResult] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);

  // Handle component mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize speech recognition after component mounts
  useEffect(() => {
    if (!mounted) return;

    // Check if speech recognition is supported
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setSpeechSupported(isSupported);

    if (isSupported) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setUserAnswer(prev => (prev + ' ' + finalTranscript).trim());
        }
        setInterimResult(interimTranscript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
        setInterimResult('');
        
        // If error is 'aborted', it's intentional, so don't show error
        if (event.error === 'aborted') {
          console.log('Speech recognition was intentionally aborted');
          return;
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
        setInterimResult('');
      };

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [mounted]);

  // Auto-process answer when recording stops and we have sufficient content
  useEffect(() => {
    if (!mounted) return;
    
    // Only auto-process if we're not recording, have content, not already loading, and not currently processing
    if (!isRecording && userAnswer.trim().length > 10 && !loading && !isProcessing) {
      console.log("Recording stopped, scheduling answer processing...");
      setIsProcessing(true);
      
      const timer = setTimeout(() => {
        UpdateUserAnswer().finally(() => {
          setIsProcessing(false);
        });
      }, 2000); // Give user time to see the final transcript
      
      return () => {
        clearTimeout(timer);
        setIsProcessing(false);
      };
    }
  }, [isRecording, userAnswer, loading, mounted, isProcessing]);

  const StartStopRecording = useCallback(async () => {
    if (!mounted || !speechSupported) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    try {
      if (isRecording && recognition) {
        console.log("Manually stopping recording...");
        // Force stop the recognition
        recognition.abort(); // Use abort() instead of stop() for immediate termination
        setIsRecording(false);
        setInterimResult('');
        toast.info("Recording stopped");
      } else {
        console.log("Starting recording...");
        
        // Request microphone permission first
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permissionError) {
          console.error("Microphone permission denied:", permissionError);
          toast.error("Microphone permission is required for recording");
          return;
        }

        if (!recognition) {
          toast.error("Speech recognition not initialized. Please refresh and try again.");
          return;
        }

        // Clear previous data
        setUserAnswer("");
        setFeedback(null);
        setInterimResult('');
        
        // Start recording
        setIsRecording(true);
        
        try {
          recognition.start();
          toast.success("Recording started! Speak now...");
        } catch (startError) {
          console.error("Error starting recognition:", startError);
          setIsRecording(false);
          toast.error("Failed to start recording. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error in StartStopRecording:", error);
      toast.error("Error with recording: " + error.message);
      setIsRecording(false);
      setInterimResult('');
    }
  }, [mounted, speechSupported, isRecording, recognition]);

  const UpdateUserAnswer = useCallback(async () => {
    if (!userAnswer.trim()) {
      toast.error("No answer recorded. Please try speaking again.");
      return;
    }

    if (loading) {
      console.log("Already processing, skipping...");
      return;
    }

    console.log("Processing user answer:", userAnswer);
    setLoading(true);
    
    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
User Answer: ${userAnswer}

Based on the question and user answer for this interview question, please provide:
1. A rating (out of 10)
2. Feedback for improvement

Please respond in JSON format with 'rating' and 'feedback' fields. Keep feedback concise (3-5 lines).`;

      console.log("Sending prompt to AI:", feedbackPrompt);

      const result = await chatSession.sendMessage(feedbackPrompt);
      const rawResponse = result.response.text();
      const cleanedResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      console.log("Raw AI Response:", cleanedResponse);
      
      // Parse the JSON response
      const JsonFeedbackResp = JSON.parse(cleanedResponse);
      
      console.log("Parsed JSON Response:", JsonFeedbackResp);

      // Set feedback state for UI display
      setFeedback(JsonFeedbackResp);

      // Save to database
      const resp = await db.insert(UserAnswer)
        .values({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy')
        });

      if (resp) {
        toast.success('User Answer recorded successfully');
      }
      
    } catch (error) {
      console.error("Error in UpdateUserAnswer:", error);
      if (error.message.includes('JSON')) {
        toast.error("Error processing AI response. Please try again.");
      } else {
        toast.error("Error saving answer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [userAnswer, loading, mockInterviewQuestion, activeQuestionIndex, interviewData, user]);

  // Manual save button
  const ManualSave = useCallback(() => {
    if (userAnswer.trim()) {
      UpdateUserAnswer();
    } else {
      toast.error("Please enter or record an answer first");
    }
  }, [userAnswer, UpdateUserAnswer]);

  // Don't render anything until component is mounted (prevents hydration issues)
  if (!mounted) {
    return (
      <div className='flex items-center justify-center flex-col'>
        <div className="flex flex-col my-20 justify-center items-center rounded-lg p-5 bg-black">
          <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center flex-col'>
      {/* Video/Webcam Section */}
      <div className="flex flex-col my-20 justify-center items-center rounded-lg p-5 bg-black">
        <Image 
          src={"/webcam.jpg"} 
          width={200} 
          height={200} 
          className="absolute"
          alt="Webcam placeholder - interview recording interface"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10
          }}
        />
      </div>

      {/* Debug Information */}
      <div className="mb-4 text-sm text-gray-600 text-center">
        <p>Recording Status: {isRecording ? "🔴 Recording..." : "⚪ Ready"}</p>
        <p>Answer Length: {userAnswer.length} characters</p>
        <p>Speech Recognition: {speechSupported ? "✅ Available" : "❌ Not Available"}</p>
      </div>

      {/* Manual Text Input */}
      <div className="mb-4 w-full max-w-md">
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here or use voice recording..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          disabled={isRecording}
        />
      </div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center space-y-4 my-10">
          <div className="flex gap-4">
            {/* Recording/Stop Button */}
            {!isRecording ? (
              <button 
                onClick={StartStopRecording} 
                disabled={loading || !speechSupported}
                className={`px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 transition-all duration-200 flex items-center gap-2 ${
                  loading || !speechSupported
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400 hover:scale-105'
                }`}
              >
                <Mic size={20} />
                {loading ? 'Processing...' : 'Start Recording'}
              </button>
            ) : (
              <button 
                onClick={StartStopRecording} 
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 flex items-center gap-2 animate-pulse hover:scale-105"
              >
                <MicOff size={20} />
                Stop Recording
              </button>
            )}
            
            {/* Manual Save Button - Only show when not recording */}
            {!isRecording && (
              <button 
                onClick={ManualSave} 
                disabled={loading || !userAnswer.trim()}
                className={`px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 transition-all duration-200 flex items-center gap-2 ${
                  loading || !userAnswer.trim()
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400 hover:scale-105'
                }`}
              >
                Save Answer
              </button>
            )}
          </div>

        {/* Recording Status Indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">🎤 Recording in progress... Speak clearly!</span>
          </div>
        )}

        {/* Interim Results */}
        {isRecording && interimResult && (
          <div className="mt-2 p-3 bg-yellow-50 rounded-lg max-w-md border border-yellow-200">
            <h4 className="text-xs font-semibold text-yellow-700 mb-1">Listening:</h4>
            <p className="text-sm text-yellow-600 italic">{interimResult}</p>
          </div>
        )}

        {/* Processing Indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Generating feedback...</span>
          </div>
        )}

        {/* Answer Preview */}
        {userAnswer && !isRecording && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-md border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Your Answer:</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{userAnswer}</p>
          </div>
        )}

        {/* Feedback Display */}
        {feedback && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg max-w-md border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">AI Feedback:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-700">Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-blue-600">{feedback.rating}</span>
                  <span className="text-sm text-blue-500">/10</span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-700 block mb-1">Feedback:</span>
                <p className="text-sm text-blue-600 leading-relaxed">{feedback.feedback}</p>
              </div>
            </div>
          </div>
        )}

        {/* Browser Compatibility Notice */}
        {!speechSupported && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg max-w-md border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2">Speech Recognition Unavailable</h3>
            <p className="text-sm text-orange-600">
              Your browser doesn't support speech recognition. Please use a modern browser like Chrome, Edge, or Safari, or type your answer manually in the text area above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordAnswerSection