import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from "react-youtube"

const CourseDetails = () => {

  const {allCourses, calculateRating, calculateChapterTime, calculateCourseDuration,calculateNoOfLectures, currency} = useAppContext()


  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  const {id} = useParams()


  const fetchCourseData = async () => {

    const course = allCourses.find(course => course._id === id)
    setCourseData(course)

  }


  const toggleSections = (index) => {

    setOpenSections(prev => ({...prev, [index] : !prev[index]}))

  }

  useEffect(() => {
     fetchCourseData()
  }, [allCourses])

  return courseData ? (
    <div className='flex md:flex-row  flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
        

        <div className='absolute top-0 left-0 w-full h-[500px] -z-1 bg-linear-to-b from-cyan-100/70'>
        </div>

       {/* left column */}
       <div className='max-w-xl z-10 text-gray-500'>
        <p className='md:text-2xl text-xl font-semibold text-gray-800'>{courseData.courseTitle}</p>
        <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{__html: courseData.courseDescription.slice(0,200)}}></p>

        {/* review and ratings */}
         <div className='flex items-center space-x-2 pt-3 pb-3 text-sm'>
                   <p>{calculateRating(courseData)}</p>
                   <div className='flex'>
                     {[...Array(5)].map((_, index) => (
                       <img key={index} src={index < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt="star" className='w-3.5 h-3.5'/>
                     ))}
                   </div>
                   <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? "Ratings" : "Rating"})</p>
                   <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? "Students" : "Student"}</p>
                 </div>

                 <p className='text-sm'>Course by <span className='text-blue-600 underline'>Stephen</span></p>

                 <div className='pt-8 text-gray-800'>
                       <p className='text-xl font-semibold'>Course Structure</p>


                       <div className='pt-5'>
                             {courseData.courseContent.map((chapter, index) => (
                              <div key={index} className='border border-gray-300 bg-white mb-2 rounded '>
                               <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSections(index)}>
                                <div className='flex items-center gap-2'>
                                  <img className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`} src={assets.down_arrow_icon} alt="arrow-icon" />
                                  <p className='text-sm md:text-base font-medium'>{chapter.chapterTitle}</p>
                                </div>
                                <p className='text-sm md:text-default'>{chapter.chapterContent.length} Lectures - {calculateChapterTime(chapter)}</p>
                               </div>

                               <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"} `}>
                                <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>{chapter.chapterContent.map((lecture, index) => (
                                  <li key={index} className='flex items-start gap-2 py-1 '>
                                    <img src={assets.play_icon} alt="play-icon" className='size-4 mt-1'/>
                                    <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                                      <p>{lecture.lectureTitle}</p>
                                      <div className='flex gap-2'>
                                        {/* the videoId here has already been added to an object videoId: */}
                                        {lecture.isPreviewFree && <p 
                                        onClick={() => setPlayerData({
                                          videoId: lecture.lectureUrl.split("/").pop()
                                        })}
                                         className='text-blue-500 cursor-pointer'>Preview</p>}
                                        <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units:["h", "m"]})}</p>
                                      </div>
                                    </div>
                                  </li>
                                ))}</ul>
                               </div>

                              </div>
                             ) )}
                       </div>
                 </div>

                 <div className='py-20 sm:text-default text-sm'>
                  <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
                <p className='pt-3 rich-text' dangerouslySetInnerHTML={{__html: courseData.courseDescription}}></p>
                 </div>
       </div>

    {/* right column */}
    <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
      {/* the videoId= is just called as it's been set to playerData already */}
       {playerData ? <YouTube videoId={playerData.videoId} opts={{playerVars: {autoplay : 1}}} iframeClassName='w-full aspect-video'/> : <img src={courseData.courseThumbnail} alt="" />}
     <div className='p-5'>
      <div className='flex items-center gap-2'>
        <img className='w-3.5' src={assets.time_left_clock_icon} alt="time-left-clock-icon" />

        <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price</p>
      </div>

      <div className='flex items-center gap-3 pt-2'>
      <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice /100).toFixed(2)}</p>
      <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
      <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
      </div>

      <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
          <div className='flex items-center gap-1'>
            <img src={assets.star} alt="star-icon" />
            <p>{calculateRating(courseData)}</p>
          </div>

       <div className='h-4 w-px bg-gray-500/40 '></div>

         <div className='flex items-center gap-1 '>
          <img src={assets.time_clock_icon} alt="time-clock-icon" />
          <p>{calculateCourseDuration(courseData)}</p>
         </div>


         <div className='h-4 w-px bg-gray-500/40 '></div>

         <div className='flex items-center gap-1 '>
          <img src={assets.lesson_icon} alt="time-clock-icon" />
          <p>{calculateNoOfLectures(courseData)} lessons</p>
         </div>

      </div>

      <button className='md:mt-6 mt-4 w-full active:scale-90 transition py-3 bg-blue-600 rounded text-white font-medium'>{isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}</button>

      <div className='pt-6'>
        <p className='md:text-xl text-lg font-medium text-gray-800'>What's in this course</p>
        <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-800'>
          <li>Lifetime access with free updates.</li>
          <li>Step-by-step, hands-on project guidance.</li>
          <li>Downloadable resources and source code.</li>
          <li>Quizzes to test your knowledge.</li>
          <li>Certificate of completion.</li>
          <li>Quizzes to test your knowledge.</li>
        </ul>
      </div>

     </div>
    </div>

    </div>
  ) : (<Loading />)
}

export default CourseDetails
