"use client"
import { eq } from 'drizzle-orm';
import React,{ useEffect, useState } from 'react'
import { MockInterview } from '../../../../../utils/schema';
import { db } from '@/utils/db';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import Link from 'next/link';

function StartInterview({params}) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestions] =  useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(1);
  
  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  
  useEffect(()=>{
    GetInterviewDetails();
  },[resolvedParams.interviewId])

  const GetInterviewDetails = async() => {
      const result = await db.select().from(MockInterview)
      .where(eq(MockInterview.mockId, resolvedParams.interviewId))

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      console.log(jsonMockResp);
      setMockInterviewQuestions(jsonMockResp);
      setInterviewData(result[0]);
  
      console.log(result);
      setInterviewData(result[0]);
    }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <QuestionsSection 
          mockInterviewQuestion={mockInterviewQuestion} 
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion} 
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          />
      </div>

       <div className="flex justify-end space-x-4 mt-4 mb-6">
        {activeQuestionIndex>0 && 
        <button onClick={()=>setActiveQuestionIndex(activeQuestionIndex - 1)} className="bg-gray-200 hover:bg-gray-300 text-black font-medium py-2 px-4 rounded-lg transition duration-200">
          Previous Question
        </button>}
        {activeQuestionIndex!=mockInterviewQuestion?.length-1&&
        <button onClick={()=>setActiveQuestionIndex(activeQuestionIndex + 1)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
          Next Question
        </button>}
        {activeQuestionIndex==mockInterviewQuestion?.length-1&& 
        <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
          End Interview
        </button>
        </Link>}
        
      </div>

    </div>
  )
}

export default StartInterview