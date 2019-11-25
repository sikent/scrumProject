const express = require('express');
const router = express.Router();


const redirection = (req, res, next) =>{
    if(req.session.auth){
        next()
    }else{
        res.redirect('/login')
    }
}

router.get('/', redirection, (req, res) =>{
    const User = {
        username: req.session.username,
        uuid: req.session.uuid
    }
    
    res.render('dashboard', {username: User.username})
    
})
module.exports = router;
