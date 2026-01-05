import { createContext, useContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"



const AppContext = createContext()



export const AppContextProvider = ({children}) => {


    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])

    const fetchCourses = async () => {
        setAllCourses(dummyCourses)
    }

    // function to calculate average rating for course

    //  takes in the course in the course detail page
    // then checks for each of the rating by user in the courseRating array add the rating to totalRating
    const calculateRating = (course) => {
           if(course.courseRatings.length === 0){
            return 0;
           }

           let totalRating = 0;

           course.courseRatings.forEach(rating => {
            totalRating += rating.rating
           })

           return totalRating / course.courseRatings.length

    }

//   pass in chapter of a particular course
// map chapter.chapterContent for all the chapter in the courseContent
     const calculateChapterTime = (chapter) => {
        let time = 0

        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)

        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }

    // calculate the duration of all course chapters lecture duration
    const calculateCourseDuration = (course) => {
     
        let time = 0

        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration ))
    
    return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})


    }


    // calculate all the lectures by checking for each of the chapters in the courseContent,
    // check if all chapters chapterContent is an array
    // return chapterContent.length
    const calculateNoOfLectures = (course) => {

        let totalLectures = 0

      course.courseContent.forEach((chapter) => {
        if(Array.isArray(chapter.chapterContent)){
            totalLectures += chapter.chapterContent.length
        }
      })

      return totalLectures

    }


    // fetch user enrolled courses

    const fetchUserEnrolledCourses = async () => {
        setEnrolledCourses(dummyCourses)
    }

    const value = {
         currency,
         allCourses,
         navigate,
         calculateRating,
         isEducator,
         setIsEducator,
         calculateChapterTime,
         calculateCourseDuration,
         calculateNoOfLectures,
         enrolledCourses,
         fetchUserEnrolledCourses
    }

    useEffect(() => {
      fetchCourses()
      fetchUserEnrolledCourses()
    }, [])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}


export const useAppContext = () => useContext(AppContext)