"use client"
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function Dashboard() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Header Section */}
      <div className='bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                AI Interview Studio
              </h1>
            </div>
          </div>
          <UserButton />
        </div>
      </div>
      
      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Welcome Section */}
        <div className='mb-10'>
          <div className='relative'>
            <h2 className='text-4xl font-bold text-gray-900 mb-3'>
              Welcome to the Dashboard
            </h2>
            <div className='absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 animate-pulse'></div>
          </div>
          <p className='text-xl text-gray-600 max-w-2xl leading-relaxed'>
            Create and start your AI-powered mock interviews to ace your next job opportunity. 
            Practice makes perfect! 🚀
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Interviews</p>
                <p className='text-2xl font-bold text-gray-900'>12</p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
          </div>
          
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>This Week</p>
                <p className='text-2xl font-bold text-gray-900'>3</p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
                </svg>
              </div>
            </div>
          </div>
          
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Success Rate</p>
                <p className='text-2xl font-bold text-gray-900'>85%</p>
              </div>
              <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Interview Section */}
        <div className='mb-12'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center'>
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>Create New Interview</h3>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <AddNewInterview />
          </div>
        </div>

        {/* Previous Interviews Section */}
        <div className=''>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center'>
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>Previous Interviews</h3>
          </div>
          
          <div className='bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg'>
            <InterviewList />
          </div>
        </div>
      </div>
      
      
    </div>
  )
}

export default Dashboard