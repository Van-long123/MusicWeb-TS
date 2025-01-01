import {Request,Response} from 'express';
import Topic from '../../models/topic.model';
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';
import Account from '../../models/account.model';
import User from '../../models/user.model';
export const index=async  (req:Request, res:Response) => {

    const statistic = {
        topic: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        song: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        singer: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };

    statistic.topic.total=await Topic.countDocuments({deleted:false})
    statistic.topic.active=await Topic.countDocuments({deleted:false,status:'active'})
    statistic.topic.inactive=await Topic.countDocuments({deleted:false,status:'inactive'})

    statistic.song.total=await Song.countDocuments({deleted:false})
    statistic.song.active=await Song.countDocuments({deleted:false,status:'active'})
    statistic.song.inactive=await Song.countDocuments({deleted:false,status:'inactive'})

    statistic.singer.total=await Singer.countDocuments({deleted:false})
    statistic.singer.active=await Singer.countDocuments({deleted:false,status:'active'})
    statistic.singer.inactive=await Singer.countDocuments({deleted:false,status:'inactive'})

    statistic.account.total=await Account.countDocuments({deleted:false})
    statistic.account.active=await Account.countDocuments({deleted:false,status:'active'})
    statistic.account.inactive=await Account.countDocuments({deleted:false,status:'inactive'})

    statistic.user.total=await User.countDocuments({deleted:false})
    statistic.user.active=await User.countDocuments({deleted:false,status:'active'})
    statistic.user.inactive=await User.countDocuments({deleted:false,status:'inactive'})
    res.render('admin/pages/dashboard/index',{
        title:"Trang tổng quan",
        statistic:statistic
    })
}