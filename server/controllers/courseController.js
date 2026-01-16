import Course from "../models/Course.js";



export const getAllCourses = async (req, res) => {

    try {
        const courses = await Course.find({}).select(["-courseContent", "-enrolledStudents"]).populate({path : "educator"})
        
        res.status(200).json({success: true, courses})
        
    } catch (error) {
        res.status(500).json({success : false, message : error.message})
    }

}


export const getCourseById = async (req, res) => {

    try {
        const {id} = req.params

        const courseData = await Course.findById(id).populate({path : "educator"})
        
        //remove lecture url if isPreveiw is free 
        courseData.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = ""
                }
            })
        })

        res.status(200).json({success:true, courseData})
    } catch (error) {
        res.status(500).json({success : false, message : error.message})

    }

}

