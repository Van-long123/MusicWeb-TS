import { Request,Response,NextFunction } from "express"
import * as systemConfig from '../../config/system'
import User from "../../models/user.model"

export const requireAuth=async(req:Request, res:Response,next:NextFunction)=>{
    if(req.cookies.tokenUser){
        const user=await User.findOne({
            tokenUser: req.cookies.tokenUser
        })
        res.locals.user = user
    }
    next()
}