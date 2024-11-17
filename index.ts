import express, {Express,Request,Response} from "express"
import dotenv from 'dotenv'
import * as systemConfig from './config/system'
import clientRoutes from "./routes/client/index.route"
import adminRoutes from './routes/admin/index.route'
import * as databse from './config/database'
import bodyParser = require("body-parser")
import moment from 'moment'
dotenv.config()
const app:Express= express()
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';
import path from 'path'
import methodOverride from 'method-override'
app.set('view engine', 'pug')
app.set('views',`${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))
databse.connect()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce'))); 
//flash
// Cấu hình express-session
app.use(
    session({
      secret: 'your_secret_key', // Thay thế bằng khóa bí mật của bạn
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 } // Cookie tồn tại trong 1 phút
    })
  );
app.use(flash());
//flash
app.use(methodOverride('_method'))

app.locals.moment=moment
app.locals.prefixAdmin=systemConfig.prefixAdmin;
clientRoutes(app)
adminRoutes(app)


const port:string|number=process.env.PORT||3000

app.listen(port,()=>{
    console.log(`http://localhost:${port}/ `+port)
})