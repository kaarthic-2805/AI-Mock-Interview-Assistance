"use client"
import React, { useEffect, useState } from 'react'
import { MockInterview } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Webcam from 'react-webcam';
import Link from 'next/link';

function Interview({params}) {
  const [interviewData, setInterviewData] = useState({});
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  
  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  
  useEffect(() => {
    console.log(resolvedParams.interviewId)
    GetInterviewDetails();
  }, [resolvedParams.interviewId]);

  const GetInterviewDetails = async() => {
    const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId, resolvedParams.interviewId))

    console.log(result);
    setInterviewData(result[0]);
  }

  const handleUserMedia = () => {
    setWebCamEnabled(true);
  };

  const handleUserMediaError = () => {
    setWebCamEnabled(false);
    console.error('Webcam access denied or failed');
  };

  return (
    <div className='h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 overflow-hidden'>
      <div className='h-full max-w-7xl mx-auto flex flex-col'>
        {/* Enhanced Compact Header */}
        <div className='text-center mb-4'>
          <h2 className='font-bold text-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm'>
            Let's Get Started
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto rounded-full mt-2 shadow-sm'></div>
        </div>

        {/* Enhanced Main Content - Two Column Layout */}
        <div className='flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Left Column - Interview Details & Info */}
          <div className='flex flex-col gap-4'>
            {/* Enhanced Interview Information Card */}
            <div className='bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]'>
              <div className='mb-5'>
                <h3 className='text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3'>
                  <div className='w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-md'></div>
                  Interview Details
                </h3>
                <div className='w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full'></div>
              </div>
              
              <div className='space-y-4'>
                <div className='group'>
                  <div className='flex items-center gap-2 mb-1'>
                    <div className='w-1.5 h-1.5 bg-indigo-500 rounded-full'></div>
                    <span className='font-semibold text-gray-700 text-xs uppercase tracking-wider'>Job Position</span>
                  </div>
                  <p className='text-xl font-medium text-gray-900 ml-4 group-hover:text-indigo-600 transition-colors'>
                    {interviewData.jobPosition}
                  </p>
                </div>
                
                <div className='group'>
                  <div className='flex items-center gap-2 mb-1'>
                    <div className='w-1.5 h-1.5 bg-purple-500 rounded-full'></div>
                    <span className='font-semibold text-gray-700 text-xs uppercase tracking-wider'>Tech Stack</span>
                  </div>
                  <p className='text-xl font-medium text-gray-900 ml-4 group-hover:text-purple-600 transition-colors'>
                    {interviewData.jobDesc}
                  </p>
                </div>
                
                <div className='group'>
                  <div className='flex items-center gap-2 mb-1'>
                    <div className='w-1.5 h-1.5 bg-pink-500 rounded-full'></div>
                    <span className='font-semibold text-gray-700 text-xs uppercase tracking-wider'>Experience Required</span>
                  </div>
                  <p className='text-xl font-medium text-gray-900 ml-4 group-hover:text-pink-600 transition-colors'>
                    {interviewData.jobExperience} Years
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Information Alert Card */}
            <div className='relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200/60 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400'></div>
              <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full -mr-10 -mt-10'></div>
              
              <div className='flex items-start gap-4'>
                <div className='bg-gradient-to-br from-amber-100 to-yellow-100 p-3 rounded-full shadow-md'>
                  <Lightbulb className='h-5 w-5 text-amber-600' />
                </div>
                <div>
                  <h3 className='font-bold text-lg text-amber-800 mb-2 flex items-center gap-2'>
                    Important Information
                    <div className='w-2 h-2 bg-amber-500 rounded-full animate-pulse'></div>
                  </h3>
                  <p className='text-amber-700 leading-relaxed text-sm'>
                    {process.env.NEXT_PUBLIC_INFORMATION}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Webcam Section */}
          <div className='flex flex-col items-center justify-center'>
            <div className='bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/30 w-full max-w-md hover:shadow-2xl transition-all duration-300'>
              <div className='text-center mb-6'>
                <h3 className='text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3'>
                  <div className='w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md'></div>
                  Camera Setup
                </h3>
                <div className='w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto'></div>
              </div>

              <div className='flex flex-col items-center'>
                {webCamEnabled ? (
                  <div className='relative group'>
                    <Webcam
                      onUserMedia={handleUserMedia}
                      onUserMediaError={handleUserMediaError}
                      mirrored={true}
                      className='rounded-2xl shadow-2xl border-4 border-white'
                      style={{
                        height: 260,
                        width: 260
                      }}
                    />
                    <div className='absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity'></div>
                    <div className='absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full shadow-lg animate-pulse'></div>
                  </div>
                ) : (
                  <div className='text-center'>
                    <div className='relative mb-6 group'>
                      <div className='bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-2xl border-2 border-dashed border-gray-300 group-hover:border-indigo-400 group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-purple-50 transition-all duration-300'>
                        <WebcamIcon className='h-24 w-24 text-gray-400 mx-auto group-hover:text-indigo-500 transition-colors duration-300' />
                      </div>
                      <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </div>
                    
                    <button 
                      onClick={() => setWebCamEnabled(true)} 
                      className='group relative px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-out font-semibold text-base tracking-wide overflow-hidden'
                    >
                      <span className='relative z-10'>Enable Camera & Microphone</span>
                      <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div className='absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Start Interview Button */}
        <div className='flex justify-center mt-4'>
          <Link href={`/dashboard/interview/${resolvedParams.interviewId}/start`}>
            <button className='group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-out font-bold text-xl tracking-wide overflow-hidden'>
              <span className='relative z-10 flex items-center gap-3'>
                Start Interview
                <svg className='w-6 h-6 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </span>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='absolute top-0 left-0 w-full h-full bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300'></div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Interview