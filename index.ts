import express, {Express,Request,Response} from "express"
import dotenv from 'dotenv'
import clientRoutes from "./routes/client/index.route"
import * as databse from './config/database'

dotenv.config()
const app:Express= express()
app.set('view engine', 'pug')
app.set('views',`${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))
clientRoutes(app)
databse.connect()
const port:string|number=process.env.PORT||3000

app.listen(port,()=>{
    console.log(`http://localhost:${port}/ `+port)
})