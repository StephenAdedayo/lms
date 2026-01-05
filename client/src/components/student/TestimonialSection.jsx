import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialSection = () => {
  return (
    <div className='pb-14  px-8 md:px-0 '>
      <h2 className='font-medium text-gray-800 text-3xl'>Testimonials</h2>
      <p className='text-gray-500 mt-3 md:text-base'>Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-14 '>
        {dummyTestimonial.map((testimonial, index) => (
          <div key={index} className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] overflow-hidden shadow-black/5'>
                <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                  <img className='rounded-full h-12 w-12' src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h1 className='text-lg text-gray-800 font-medium'>{testimonial.name}</h1>
                    <p className='text-gray-800/80'>{testimonial.role}</p>
                  </div>
                  
                </div>
                <div className='p-5 pb-7'>
                    <div className='flex gap-0.5'>{Array(5).fill("").map((_, index) => (
                      <img className='h-5' key={index} src={index < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt="" />
                    ))}</div>
                    <p className='text-gray-500 mt-5'>{testimonial.feedback}</p>
                  </div>

                  <a href="#" className='underline px-5 text-blue-500'>Read More</a>
          </div>
        ))}
      </div>
      </div>
  )
}

export default TestimonialSection
