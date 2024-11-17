import { Request,Response,NextFunction } from "express"
import * as systemConfig from '../../config/system'
import Account from "../../models/account.model"
import Role from "../../models/role.model"

export const requireAuth=async(req:Request, res:Response,next:NextFunction)=>{
    if(!req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    }
    else{
        const user=await Account.findOne({
            token: req.cookies.token,
            deleted:false
        })
        if(!user){
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        }
        else{
            const role=await Role.findOne({
                _id:user.role_id
            }).select('title permissions')
            res.locals.user=user
            res.locals.role=role
            next()
        }
    }
}