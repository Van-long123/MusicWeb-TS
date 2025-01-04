import { Router } from "express";
import multer from 'multer';
const upload=multer()
import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';
import * as controller from '../../controllers/client/song.controller';
import { createPost } from "../../validates/upload.validate";
const router:Router=Router();

// nếu để 2 path này lên đầu thì khi có route là /like /listen thì nó sẽ vào 
// còn /:slug thì sẽ là còn lại ví dụ là /like thì nó đi vào tìm route từ trên xuống thấy lấy /like 
// /listen thì nó tìm trên xuống /like ko phải vào /listen chọn 
// tiếp /nhac-tre thì nó vào 2 route đầu ko phải thì nó sẽ là thằng :slug
// router.get('/like',controller.like)
// router.get('/listen',controller.listen)
router.get('/random',controller.random)
router.get('/download',controller.download)
router.get('/upload',controller.upload)
router.post('/create', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),createPost,
    uploadCloud.uploadFields,controller.createPost)

router.get('/:slug',controller.index)
router.get('/detail/:slugSong',controller.detail)




router.patch('/listen/:idSong',controller.listen)
router.patch('/like/:typeLike/:idSong',controller.like)
router.patch('/fovarite/:typeFavorite/:idSong',controller.favorite)



export const songRouter:Router=router;
