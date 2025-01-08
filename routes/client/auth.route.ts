import { Router, Request, Response, NextFunction } from "express";
const router:Router=Router()
import passport from "passport"
import User from "../../models/user.model";
router.get('/google',passport.authenticate('google', { scope: ['profile','email'],session:false }));
router.get('/google/callback', (req: Request, res: Response, next: NextFunction) =>{
        // Successful authentication, redirect home.
    passport.authenticate('google',(err: any, profile: any)=>{
        req['user']=profile
        next()
    })(req, res, next);
},async (req, res)=>{
    if(!req['user']){
        res.redirect('/user/login')
        return 
    }
    const user=await User.findOne({
        _id:req['user'].id
    })
    res.cookie("tokenUser",user.tokenUser)
    res.redirect('/')
});
export const authRouter:Router = router