import express, {Express,Request,Response} from "express"
import dotenv from 'dotenv'
import clientRoutes from "./routes/client/index.route"
import * as databse from './config/database'
import bodyParser = require("body-parser")
dotenv.config()
const app:Express= express()
import session from 'express-session';
import flash from 'express-flash';
app.set('view engine', 'pug')
app.set('views',`${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))
databse.connect()
app.use(bodyParser.urlencoded({ extended: false }))

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


clientRoutes(app)



const port:string|number=process.env.PORT||3000

app.listen(port,()=>{
    console.log(`http://localhost:${port}/ `+port)
})