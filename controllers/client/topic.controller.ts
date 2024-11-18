import { Request,Response } from "express"
import Topic from "../../models/topic.model"
import pagination from '../../helpers/paginationHelper';
export const topics= async (req: Request, res: Response)=>{
    //pagination
    const countTopics=await Topic.countDocuments({})
    const objectPagination=pagination(req.query,countTopics,{
        currentPage:1,
        limitItems:14
    })
    //pagination
    const topics= await Topic.find({
        status:'active',
        deleted:false,
    })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    res.render('client/pages/topics/index',
        {
            title:"Chủ đề bài hát",
            topics:topics,
            pagination:objectPagination
        }
    )
}