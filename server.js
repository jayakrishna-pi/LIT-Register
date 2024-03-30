const express= require('express')
const mongoose = require('mongoose')
const Subscriber = require('./schema')
const cors = require('cors')
const Rigesterd = require('./schema')
const jwt = require('jsonwebtoken')


const app = express()
app.use(express.json())
app.use(cors())

const connectDB = async() => {
    try {
        const url = 'mongodb+srv://jayap:jayap123@subscribers-cluster.xgczewr.mongodb.net/subsribers-database?retryWrites=true&w=majority&appName=subscribers-cluster'
        await mongoose.connect(url)
        console.log('database connected')  
    } catch (error) {
        console.log('error in connecting DB', error)
    }
}

app.post('/subscribe', async(req, res) => {
    console.log(req.body)
    const {email} = req.body
    console.log({email})
    try {
        const existedSubscriber = await Subscriber.findOne({email})
        if (existedSubscriber){
            res.status(400).send("You're already subscribed")
        }else {
            await Subscriber.create({
                email
            })
            res.status(200).send("You're Subscribed")
        }
    } catch (error) {
        console.log('internal server error', error)
        res.status(500).send('Internal server error')
    }
})
// signup
    app.post ('/signup', async(req, res) =>{
        const  {userName,email,password}=req.body
        console.log(req.body)
       try{
        const  existedRigestred=await Rigesterd .findOne({email})
        if (existedRigestred){

            res.status(400).send("your already rigesterd")
        }
        else{
            await Rigesterd.create({
                email,userName,password
            })
            res.status(200).send ("your registered sucessfully")  
        }
       }
       catch (error){
       console.log('internal server error', error)
        res.status(500).send('Internal server error')

       }


    })

    app.post('/login', async(req,res)=>{
        const{email,password}=req.body
        console.log({password})
        try {
            const existedUser = await Rigesterd.findOne({email})
            console.log({existedUser})

           if (existedUser === null){
            res.send('Invalid user')
           }else {
                if (password === existedUser.password ){
                    const payload = {
                        "email": email,
                    }

                    const token = jwt.sign(payload, 'sec-key')
                    res.send({token})
                }else {
                    res.send('Invalid Password')
                    console.log("email")
                }
           }
            
        } catch (error) {
            console.log('err at login', error)
            res.send("Internal server error")
        }

    })
    //auth
        const authenticate =(req, res, next) =>{
        const headerToken = req.headers.authorization
        let token
        if (headerToken) {
            token = headerToken.split(' ')[1]
        } else {
            res.send('missing headers/token not found')
        }
        if (token === undefined) {
            res.send('token not found')
        } else {
            jwt.verify(token, 'sec-key', (error, payload) => {
                if (error) {
                    res.send('invalid token')
                    console.log('error', error)
                }
                else {
                    req.email = payload.email
                    next()
                }
            })
        }
}


    //dashboard
    app.get('/dashboard',authenticate,async(req,res)=>{
        const {email}=req
        res.send({
            userEmail:email,
            msg:'Token verified,Move to dashbord'
        })
    })

connectDB()
app.listen(2000, () => {
    console.log('server is runninsg')
})


