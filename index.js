if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const ejsMate = require('ejs-mate')
const axios = require('axios')

const mongoose = require('mongoose')
const Crypto = require('./model/model')


const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/crypto'
mongoose.connect(dbURL)
.then(console.log('Connected to the database'))
.catch(err=>console.log('Error'))

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({extended:true}))
app.get('/', async(req, res)=>{
    const {data} = await axios.get('https://api.wazirx.com/api/v2/tickers')
await Crypto.deleteMany()
    let c =0
    for(let key in data)
    {
        if (data.hasOwnProperty(key))
        {
            const value = data[key]
            const db = new Crypto(value)
            await db.save()
            c=c+1
        }
        if(c==10)
        {
            break
        }
    }
    try {
        const values = await Crypto.find()
        res.render('hodlinfo/home', {values})
    } catch (error) {
        console.log(error)   
    }
    
    
})

app.listen(3000, ()=>{
    console.log(`Listening to port 3000`)
})