import {clerkClient} from "@clerk/express"
import Course from "../models/Course.js"
import {v2 as cloudinary} from "cloudinary" 
import Purchase from "../models/Purchase.js"


// update role to educator
export const updateRoleToEducator = async (req, res) => {

    try {
        
        const userId = await req.auth().userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata : {
                role : "educator"
            }
        })

        res.json({success: true, message : "You can publish a course now"})

    } catch (error) {
        res.json({success : false, message: error.message})
    }

}


export const addCourse = async (req, res) => {

    try {
        const {courseData} = req.body

        const imageFile = req.file
        const educatorId =  await req.auth().userId

        if(!imageFile){

            return res.json({success : false, message : "Thumbnail is not attached"})
        }
       
        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
         
        const newCourse = await Course.create(parsedCourseData)
        const imageUrl = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUrl.secure_url

        await newCourse.save()

        res.status(201).json({success: true, message : "Course Added"})

    } catch (error) {
        res.status(501).json({success: false, message : error.message})
    }

}


export const getEducatorCourses = async (req, res) => {

    try {
        const educator = await req.auth().userId

        const courses = await Course.find({educator})

        res.status(200).json({success:true, courses})
    } catch (error) {
        res.status(500).json({success: false, message : error.message})
    }

}


export const getEducatorDashboardData = async (req, res) => {

    try {
         const educator = await req.auth().userId

        const courses = await Course.find({educator})
        const totalCourses = courses.length

        const courseIds = courses.map(course => course._id)

        // calculate total earnings from purchases

        const purchases = await Purchase.find({
            courseId : {$in : courseIds},
            status : "Completed"
        })

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

        // collect unique enrolled student ids with their course titles

        const enrolledStudentsData = []

        for(const course of courses){
            const students =  await User.find({
                _id : {$in : course.enrolledStudents}
            }, "name, imageUrl")

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle : course.courseTitle,
                    student
                })
            })
        }

        res.status(200).json({success: true, dashboardData : {
            totalEarnings, totalCourses, enrolledStudentsData
        }})
    } catch (error) {
         res.status(500).json({success: false, message : error.message})

    }

}
// get enrolled students with purchase data
export const getEnrolledStudentsData = async (req, res) => {

    try {
         const educator = await req.auth().userId

        const courses = await Course.find({educator})

        const courseIds = courses.map(course => course._id)

         const purchases = await Purchase.find({
            courseId : {$in : courseIds},
            status : "Completed"
        }).populate("userId", "name, imageUrl").populate("courseId", "courseTitle")

        const enrolledStudents = purchases.map(purchase => ({
            student : purchase.userId,
            courseTitle :  purchase.courseId.courseTitle,
            purchase : purchase.createdAt
        }))

        res.status(200).json({success: true, enrolledStudents})
    } catch (error) {
        res.status(500).json({success: false, message : error.message})

    }

}