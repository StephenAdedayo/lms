import mongoose from "mongoose"


const connectDB = async () => {

    mongoose.connection.on("connected", () => {console.log("Mongodb connected successfully");
    console.log("Connected DB name:", mongoose.connection.name);
console.log("Connected host:", mongoose.connection.host);
    }
    )


    await mongoose.connect(`${process.env.MONGODB_URI}`)
}

export default connectDB