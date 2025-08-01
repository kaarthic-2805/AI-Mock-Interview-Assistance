import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {
  const router = useRouter();
  const onStart=()=>{
    router.push('/dashboard/interview/'+interview?.mockId)
  }

  const onFeedback=()=>{
    router.push('/dashboard/interview/'+interview?.mockId+"/feedback")
  }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Expierence</h2>
      <h2 className='text-xs text-gray-400'>Created At : {interview.createdAt}</h2>
      <div className='flex justify-between mt-2 gap-5'>
        <button
        onClick={onFeedback}
        size="sm"
        variant="outline"
        className="w-full bg-white-600 hover:bg-white-700 text-black font-medium py-2 px-4 rounded-lg 
                  transition duration-300 ease-in-out 
                  transform hover:scale-105 shadow-md hover:shadow-xl 
                  focus:outline-none focus:ring-2 focus:ring-white-400"
      >
        Feedback
      </button>
        

<button
onClick={onStart}
  size="sm"
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg 
             transition duration-300 ease-in-out 
             transform hover:scale-105 shadow-md hover:shadow-xl 
             focus:outline-none focus:ring-2 focus:ring-blue-400"
>
  Start
</button>

      </div>
    </div>
  )
}

export default InterviewItemCard