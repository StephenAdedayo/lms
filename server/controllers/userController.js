import Stripe from "stripe";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import CourseProgress from "../models/CourseProgress.js";

export const getUserData = async (req, res) => {

    try {
        const userId = await req.auth().userId

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({success : false, message : "User not found"})
        }

        res.status(200).json({success : true, user })
    } catch (error) {
        res.status(500).json({success : false, message : error.message})
    }

}

// user enrolled courses with lecture links

export const getUserEnrolledCourses = async (req, res) => {

    try {
        const userId = await req.auth().userId

        const userData = await User.findById(userId).populate("enrolledCourses")
          

        res.status(200).json({success : true, enrolledCourses: userData.enrolledCourses})


    } catch (error) {
        res.status(500).json({success : false, message : error.message})

    }


    
}




export const purchaseCourse = async (req, res) => {

    try {
        const {courseId} = req.body
        const {origin} = req.headers
        const userId = await req.auth().userId
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData || !courseData){
            res.status(400).json({success : false, message : "Data not found" })
        }

        const purchaseData = {
            courseId : courseData._id,
            userId,
            amount : (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }

        const newPurchase = await Purchase.create(purchaseData)

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase()

        // creating line items for stripe
        const line_items = [{
            price_data : {
                currency,
                product_data : {
                    name : courseData.courseTitle
                },
                unit_amount : Math.floor(newPurchase.amount) * 100
            },
            quantity : 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/loading/my-enrollments`,
            cancel_url : `${origin}/`,
            line_items : line_items,
            mode : "payment",
            metadata : {
                purchaseId : newPurchase._id.toString()
            }
        })

        res.status(201).json({success : true, session_url : session.url})

    } catch (error) {
        res.status(500).json({success : false, message: error.message})
    }

}


export const updateUserCourseProgress = async (req, res) => {

    try {
        const userId = await req.auth().userId

        const {courseId, lectureId} = req.body

        const progressData = await CourseProgress.findOne({userId, courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.status(200).json({success: true, message : "Lecture already completed"})
            }

             progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted : [lectureId]
            })        
        }

        res.status(200).json({success : true, message : "Porgress updated"})
    } catch (error) {
        res.status(500).json({success : false, message : error.message})
    }

}


export const getUserProgressData = async (req, res) => {

    try {
         const userId = await req.auth().userId

        const {courseId} = req.body

        const progressData = await CourseProgress.findOne({userId, courseId})
        res.status(200).json({success : true, progressData})

    } catch (error) {
        res.status(500).json({success : false, message : error.message})
    }

}

// add user ratings

export const addUserRating = async(req, res) => {

    const userId = await req.auth().userId
    const {courseId, rating} = req.body


    if(!courseId || !userId ||  !rating || rating < 1 || rating > 5 ){
        return res.status(404).json({success : false, message :"Invalid details"})
    }


    try {
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({success : false, message : "course not found"})
        }

        const user = await User.findById(userId)
        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.status(400).json({success : false, message : "user has not purchased this course"})
        }

       const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)

       if(existingRatingIndex){
        course.courseRatings[existingRatingIndex].rating = rating

       }else{
        course.courseRatings.push({userId, rating})
       }

       await course.save()

       return res.status(200).json({success : true, message : "Rating added"})
     } catch (error) {
        res.status(500).json({success : false, message : error.message})
    }
}