import { Request,Response } from "express"
import Topic from "../../models/topic.model"
export const topics= async (req: Request, res: Response)=>{
    const topics= await Topic.find({
        status:'active',
        deleted:false,
    })
    res.render('client/pages/topics/index',
        {
            title:"Chủ đề bài hát",
            topics:topics
        }
    )
}