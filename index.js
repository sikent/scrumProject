const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const flash = require('express-flash');
const session = require('express-session')
const keys = require('./config/keys')
const morgan = require('morgan')
const cookieTime= 1000*60*60*2

app.use(morgan('combined'));
app.use(flash())
app.set('view engine', 'ejs')
app.use(express.static('static'))
app.use(express.urlencoded());
app.use(flash());
app.use(session({
    secret: keys.secret,
    resave: false,
    saveUninitialized: false,
    name: "sid",
    cookie:{
        maxAge: cookieTime,
        sameSite: true,
        secure: false,

    }
    
}))

app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))
app.use('/dashboard', require('./routes/dashboard'))
app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        if(err) res.redirect('/dashboard')
    })
    res.clearCookie("sid")
    res.redirect('/login')
})


app.listen(PORT, ()=>{
    console.log(`Server started on PORT: ${PORT}`)
})