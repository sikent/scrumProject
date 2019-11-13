const express = require('express');
const router = express.Router();
// const passport = require('passport')
// const initializePassport = require('../config/passport');





router.get('/', (req, res)=>{
    // initializePassport(passport)
    res.render('login');
    
})
router.post('/userLogin', (req, res)=>{
    // find the user through a email address and store it into a user object
    
    initializePassport(passport)
})

module.exports = router;
