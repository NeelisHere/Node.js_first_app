const express = require('express');
const mongoose = require('mongoose');
const cp = require('cookie-parser');
const cors = require('cors');
const generateUser = require('./generateUser');
const jwt = require('jsonwebtoken');

const port = 5001
const host = 'localhost'
const dburi = 'mongodb://127.0.0.1:27017/backend'
const dboptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const secret_jwt_key = 'secret_key'

const app = express();

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cp())
app.use(cors())

mongoose
    .connect(dburi,dboptions)
    .then(()=>{
        console.log('Connected to MongoDB...')
    })

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const UserCollection = mongoose.model('User', schema)

const isAuthenticated = async(req, res, next) => {
    console.log(req.cookies)
    const { token } = req.cookies
    if(token){  
        console.log('->', token)
        const decoded = jwt.verify(token, secret_jwt_key)
        console.log(decoded);
        req.user = await UserCollection.findById(decoded._id)
        next()
    }else{
        res.redirect('/login');
    }
}

app.get('/', isAuthenticated, (req, res) => {
    res.render('home')
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', async(req,res)=>{
    const user = generateUser()
    await UserCollection.create(user)
    res.send('user registered successfully');
})

app.post('/login', async(req, res)=>{
    const user = await UserCollection.findOne(req.body)
    
    if(!user){
        res.redirect('/register')
    }else{
        const token = jwt.sign({ _id:user._id }, secret_jwt_key)
        res.cookie('token', token, {
            expires: new Date(Date.now() + 1000 * 60 * 60),
            httpOnly: true
        })
        res.redirect('/')
    }
    
})

app.get('/logout', (req, res)=>{
    res.clearCookie('token')
    res.redirect('/login')
})


app.get('/all', async(req,res)=>{
    const allusers = await UserCollection.find()
    res.json(allusers)
})

app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
});