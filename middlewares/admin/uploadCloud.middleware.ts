import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import dotenv from 'dotenv'
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});
const streamUpload = (buffer: any) => {
    return new Promise((resolve, reject) => {
        //hàm này là cloudinary tự định nghĩa ra 
        let stream = cloudinary.uploader.upload_stream(
            // resource_type: "auto" là cách để Cloudinary tự động nhận diện loại tài nguyên mà bạn đang tải lên, ví dụ: ảnh, video, âm thanh, hoặc các loại tệp khác.
            { resource_type: "auto" },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}

const uploadToCloudinary = async (buffer: any) => {
    let result = await streamUpload(buffer);
    return result["url"];
}
export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await uploadToCloudinary(req["file"].buffer)
        req.body[req["file"].fieldname] = result
    } catch (error) {
        console.log(error)
    }
    next()
}

export const uploadFields = async (req: Request, res: Response, next: NextFunction) => {
    // upload nhiều file thì trả ta 1 mảng chứa các file
    for (const key in req["files"]) {
        req.body[key] = []
        const array = req["files"][key]//lưu dưới 1 mảng vì avart hoặc audio có thể có nhiều ảnh 
        for (const item of array) {
            try {
                const result = await uploadToCloudinary(item.buffer)
                req.body[key].push(result)
                // req.body[key]=result // lưu này cũng đúng tuy nhiên nếu upload nhiều image thì dùng thằng trên để lưu vào 1 mảng
            } catch (error) {
                console.log(error)
            }
        }

    }

    next()
}