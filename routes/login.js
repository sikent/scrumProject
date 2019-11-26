const express = require('express');// requiring express server framework
const router = express.Router();// router to use the routing funtionality
const MongoClient = require('mongodb');// MongoClient to connect to connect 
const keys = require('../config/keys')// config keys for MongoDB and session 
const bcrypt = require('bcrypt')// libary to hash passwords and check password 


router.get('/', (req, res)=>{ // route to get the login page 
    res.render('login', {err: "None"}); // return the login page 
})
router.post('/userLogin', async (request, response)=>{ // after the form has been submitted 
    const EnteredPassword = request.body.password; // varible to hold the password
    const errors = []; // push errors 

    const UserDocs= []; // Array for the fetched users 

   try {
   await MongoClient.connect(keys.URI, (err, client)=>{ // connect to MongoDB  
        if(err) throw err // catch errors 
        const db = client.db(keys.userDB); // connect user DB
    
        const findUser = (db , callback)=>{ // find user funtion 
            const collection = db.collection(request.body.username) // find a specfic 
             collection.find({}).toArray(function(err, docs) { // get the user and store it into an array
        
        console.log("Found the following records");
        //console.log(docs)
        // User.push(docs)
        callback(docs); // callback to return the documents
            });
        }
        findUser(db, (docs)=>{ 
            UserDocs.push(docs) // push the document to docs
            client.close(); // close connection 
            let User = { // make a User object
                uuid: UserDocs[0][0].uuid,
                username: UserDocs[0][0].username,
                password: UserDocs[0][0].password
            }
          
            bcrypt.compare(EnteredPassword, User.password, function(err, res) { // checked the hashed passwords 
                if(res) { // if the res is true then start the session 
                console.log('Passwords Match')
                request.session.userID = User.uuid; // session id is the user uuid 
                request.session.username = User.username; // add the username to the session
                request.session.auth = true // auth to true 
                return response.redirect('/dashboard') // redirect to dashboard 

                } else {
                 errors.push(`username or passwords don't match`)  // error  
                 response.render('login', {err: errors}) // re render the login page
                } 
              });
               
    })
    
       })
   } catch (error) {
       console.log(error)
   }

})

module.exports = router;
