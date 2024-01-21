const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/routes')
const mongoose = require('mongoose')
require('dotenv/config')
const config = require('config');

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// const corsOptions = {
//     origin:'*',
//     credential:true,
//     optionSuccessStatus:200 
// }

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// app.use(cors({
//     origin:["http://localhost:3000"],//a different origin?
//     methods: ["GET","POST","PUT","DELETE"],
//     credentials: true,
//   }));

// app.use(cors(corsOptions))
app.use('/', router)

if (!config.get('name')){
    console.log('no private key')
    process.exit(1);
}

mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(() => console.log('DB connected'))
.catch(err => console.log(err))

const port = process.env.PORT
const server = app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})

console.log(process.env.MSG);
// console.log(config.get('name'))