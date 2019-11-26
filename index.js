const express = require('express'); // requiring express server framework
const app = express(); // making an intance of express
const PORT = process.env.PORT || 3000; // What port the server should start on
const flash = require('express-flash'); // express-flash to send messages
const session = require('express-session') // express-session to start sessions and set cookies for auth
const keys = require('./config/keys') // have some configs keys 
const morgan = require('morgan')// to see who has connected to server 
const cookieTime= 1000*60*60*2 // when the cookie expires

app.use(morgan('dev')); // morgan as in dev view 
app.use(flash()) // flash middleware to use flash
app.set('view engine', 'ejs') // setup the view engine to ejs
app.use(express.static('static')) // setup the static for images and css files
app.use(express.urlencoded()); // to parse incoming form data
app.use(session({ // session config
    secret: keys.secret,
    resave: false,
    saveUninitialized: false,
    name: keys.sessionName,
    cookie:{
        maxAge: cookieTime,
        sameSite: true,
        secure: false,

    }
    
}))

app.use('/login', require('./routes/login')) // when /login is hit it redirects to /routes/login.js file
app.use('/register', require('./routes/register')) // when /register is hit it redirects to /routes/register.js file 
app.use('/dashboard', require('./routes/dashboard')) // after the user has been auth in the login route it redirects to /dashboard to show the dashboard 
app.get('/', (req, res)=>{ // basic route which asks to login or register
    res.render('index')
})

app.get('/logout', (req, res)=>{ // route to end session 
    req.session.destroy((err)=>{
        if(err) res.redirect('/dashboard')
    })
    res.clearCookie("sid")
    res.redirect('/login')
})


app.listen(PORT, ()=>{
    console.log(`Server started on PORT: ${PORT}`)
})