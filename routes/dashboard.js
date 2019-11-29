const express = require('express'); // requiring express server framework
const router = express.Router(); // router to use the routing funtionality


const redirection = (req, res, next) =>{ // check if the session id is set
    if(req.session.auth){ // if session.auth is true 
        next() // next to load up the dash board
    }else{
        res.redirect('/login') // re render the login page 
    }
}

router.get('/', (req, res) =>{
    // const User = { // make instance of the user 
    //     username: req.session.username, //username 
    //     uuid: req.session.uuid // id of the session 
    // }
    const User = {
        username: "admin",
        uuid: "312dwdw"
    }
    
    res.render('dashboard', {username: User.username}) // render the dashboard
    
})
module.exports = router;
