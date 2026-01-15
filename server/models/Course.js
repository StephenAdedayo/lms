import mongoose from "mongoose";


const lectureSchema = new mongoose.Schema({

    lectureId : {
        type : String, required: true
    },

    lectureTitle : {
        type : String, required : true
    },

    lectureDuration : {
        type : Number, required : true
    },

    lectureUrl : {
        type : String, required: true
    },

    isPreviewFree : {
        type : Boolean, required : true
    },

    lectureOrder : {
        type : Number, required: true
    }

}, {_id : false})


const chapterSchema = new mongoose.Schema({

    chapterId : {
        type : String,
        required : true,

    },
    
    chapterOrder : {
        type : Number,
        required : true
    },

    chapterTitle : {
        type : String,
        required : true
    },

    chapterContent : [lectureSchema]

    // do not create id when creating the new chapter because it coming with a uniqid from frontend
}, {_id : false})

const courseSchema = new mongoose.Schema({

    courseTitle : {
        type : String, 
        required : true
    },

    courseDescription : {
        type : String,
        required : true
    },

    courseThumbnail : {
        type : String
    },

    coursePrice : {
        type : Number,
        required : true
    },

    discount : {
        type : Number,
        required : true,
        min : 1,
        max : 100
    },

    courseContent : [chapterSchema],
    courseRatings : [
        {
            userId : {
                type : String,
            },

            rating : {
                type : Number,
                min : 1,
                max : 5
            }
        
        }
    ],

    educator : {
        type : String,
        ref : "User",
        required : true
    },

    enrolledStudents : [
        {type : String, ref : "User"}
    ]

    // minimize false in case we dont create any of this data instance above it will be created automatically

}, {timestamps : true, minimize : false})


const Course = mongoose.model("Course", courseSchema)

export default Course