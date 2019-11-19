const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const flash = require('express-flash');
const session = require('express-session')
const keys = require('./config/keys')



app.set('view engine', 'ejs')
app.use(express.static('static'))
app.use(express.urlencoded());
app.use(flash());
app.use(session({
    secret: keys.secret,
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: true

    }
}))

app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))

app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/session', (req,res)=>{
    console.log(req.session);
})

app.listen(PORT, ()=>{
    console.log(`Server started on PORT: ${PORT}`)
})