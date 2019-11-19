const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb');
const session = require('express-session');



router.get('/', (req, res)=>{
    res.render('login');
    
})
router.post('/userLogin', (req, res)=>{
   const User = {
       username : req.body.username,
       password : req.body.password
   }
   req.session.name = "Om";
   console.log(req.session)
})

router.get('/logout', (req, res)=>{
    //end user session 
    res.redirect('/login');
})
module.exports = router;
