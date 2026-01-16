import { createContext, useContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"
import {useUser, useAuth} from "@clerk/clerk-react"
import axios from "axios"
import toast from "react-hot-toast";



const AppContext = createContext()



export const AppContextProvider = ({children}) => {


    const currency = import.meta.env.VITE_CURRENCY
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()

    const {user} = useUser()
    const {getToken} = useAuth()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    const fetchUserData = async () => {

        if(user?.publicMetadata?.role === "educator"){
            setIsEducator(true)
        }

       try {
        const token = await getToken() 
        if(!token){
            return
        }
        const {data} = await axios.get("/api/user/data", {headers : {Authorization : `Bearer ${token}`}})

        if(data.success){
            setUserData(data.user)
            console.log(data.user);
            
        }else{
            toast.error(data.message)
        }
       } catch (error) {
        toast.error(error.message)
       }

    }

    const fetchCourses = async () => {
        try {
            const {data} = await axios.get("/api/course/all")

            if(data.success){
                setAllCourses(data.courses)
                console.log(data.courses);
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message)
            
        }
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

           return Math.floor(totalRating / course.courseRatings.length)

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

        try {
            const {data} = await axios.get("/api/user/enrolled-courses", {headers : {Authorization : `Bearer ${await getToken()}`}})

            if(data.success){
                setEnrolledCourses(data.enrolledCourses.reverse())
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
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
         fetchUserEnrolledCourses,
         axios,
         userData,
         setUserData,
         fetchCourses,
         getToken
    }

    

    useEffect(  () => {
         if(user){
            fetchUserData()
            fetchUserEnrolledCourses()
      }
    }, [user])

    useEffect(() => {
      fetchCourses()
    }, [])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}


export const useAppContext = () => useContext(AppContext)