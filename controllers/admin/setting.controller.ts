import {Request,Response} from 'express';
import Song from '../../models/song.model';
import * as systemConfig from '../../config/system'
import SettingGeneral from '../../models/settings-general.model';
export const general=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("settings_view")){
        return;
    }
    try {
        const settingGeneral=await SettingGeneral.findOne({})
        res.render('admin/pages/settings/general',{
            title:"Cài đặt chung",
            settingGeneral:settingGeneral
        })
    } catch (error) {
        
    }
    
}
export const generalPatch=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("settings_edit")){
        return;
    }
    const settingGeneral=await SettingGeneral.findOne({});
    if(settingGeneral){
        await SettingGeneral.updateOne({
            _id:settingGeneral.id
        },req.body)
    }
    else{
        const settingGeneral=new SettingGeneral(req.body);
        await settingGeneral.save()
    }
    res.redirect('back')
}