import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from './models/user.model';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, cb) => {
    if(profile?.id){
        const email=profile.emails[0]?.value
        const existUser=await User.findOne({
            _id:profile.id,
        })
        if(!existUser){
            const user=new User({
                _id:profile.id,
                email:email,
                fullName:profile.displayName,
                typeLogin:profile.provider,
                avatar:profile.photos[0].value,
            })
            await user.save()
        }
        else{
            //cập nhật token nếu tạo 1 router login-success
        }
    }
  return cb(null, profile);
}));


