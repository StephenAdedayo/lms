import mongoose from "mongoose";



const purchaseSchema = new mongoose.Schema({

    courseId : {
        type :  mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Course"
    },

    userId : {
        type : String,
        required : true,
        ref : "User"
    },
    amount : {
        type : Number,
        required : true
    },

    status : {
        type : String,
        enum : ["Pending", "Completed", "Failed"],
        default  :"Pending"
    },
 



}, {timestamps : true})


const Purchase = mongoose.model("Purchase", purchaseSchema)

export default Purchase