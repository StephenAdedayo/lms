import multer from "multer"

const storage = multer.diskStorage({})

const upload = multer({storage, limits : {fileSize : 1024 * 1024 * 50}})

export default upload