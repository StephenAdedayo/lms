import React from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CourseSection = () => {

  const {allCourses} =  useAppContext()

  return (
    <div className='py-16 md:px-40 px-8'>
      <h1 className='text-3xl font-medium text-gray-800'>Learn from the best</h1>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our top-rated courses across various categories. From coding and design to <br /> business and wellness, our courses are crafted to deliver results.</p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4'>
        {allCourses.slice(0,4).map((course, index) => (
          <CourseCard key={index} course={course}/>
        ))}
      </div>

      <Link className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded' to={"/course-list"} onClick={() => scrollTo(0,0)}>Show all courses</Link>


    </div>
  )
}

export default CourseSection
