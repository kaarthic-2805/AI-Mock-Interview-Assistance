"use client"
import React, { useEffect,useState } from 'react'
import { db } from '@/utils/db'
import { UserAnswer } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

function Feedback({params}) {
  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();
  useEffect(()=>{
    GetFeedback();
  },[resolvedParams.interviewId])

  const GetFeedback = async() => {
    const result = await db.select().from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, resolvedParams.interviewId))
    .orderBy(UserAnswer.id)

    console.log('Feedback results:', result)
    setFeedbackList(result);
    
    // Store questions in array format
    const questionsArray = result.map((item, index) => ({
      questionNumber: index + 1,
      question: item.question,
      userAnswer: item.userAns,
      correctAnswer: item.correctAns,
      feedback: item.feedback,
      rating: item.rating
    }));
    
    console.log('Questions Array:', questionsArray);
  }

  return (
    <div>
      
      {feedbackList?.length === 0?
      <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Found</h2>:
      <>
      <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
      <h2 className='font-bold text-2xl'>Here is your Interview feedback</h2>
      <h2 className='text-primary text-lg my-3'>Your Overall Interview Rating: <strong>7/10</strong></h2>
      <h2 className='text-sm text-gray-500'>Find below Interview Question with correct answer, Your answer and feedback for improvement</h2>

      {feedbackList&&feedbackList.map((item,index)=> (
        <Collapsible key={index} className="mt-7">
        <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
          {item.question}
          <ChevronsUpDown className='h-5 w-5' />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className='flex flex-col gap-2'>
            <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating : </strong>{item.rating}</h2>
            <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer : </strong>{item.userAns}</h2>
            <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer : </strong>{item.correctAns}</h2>
            <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback : </strong>{item.feedback}</h2>
          </div>
        </CollapsibleContent>
        </Collapsible>
      ))}
      </>}
      <button onClick={()=>router.replace('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
          Go Home
        </button>
    </div>
  )
}

export default Feedback