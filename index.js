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

const port = process.env.PORT || 3000

const session = require('express-session')

const MongoDBStore = require("connect-mongo");

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/crypto'
mongoose.connect(dbURL)
.then(console.log('Connected to the database'))
.catch(err=>console.log('Error'))

const store = new MongoDBStore({
    mongoUrl: dbURL,
    secret: 'secretCode',
    collectionName:'session',
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionDetail = {
    store,
    secret: 'secretCode',
    saveUninitialized: true,
    resave:false,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionDetail))

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

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})