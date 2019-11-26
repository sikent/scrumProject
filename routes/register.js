const express = require('express');// requiring express server framework
const router  = express.Router(); // router to use the routing funtionality
const keys = require('../config/keys'); // config keys for MongoDB
const MongoClient = require('mongodb').MongoClient; // MongoClient to connect to connect 
const bcrypt = require('bcrypt'); // libary to hash passwords
const uuidv4 = require('uuid/v4'); // genarate id's 


router.get('/', (req, res) =>{
    res.render('register', {err: "None"}); //// requiring express server framework route to 

})
router.post('/', async(req, res)=>{ // post for after the form has been submitted 
    let hashedPassword // varible to keep the hash password 
     const User ={   // make a user object to extract information from 
        email: req.body.email,
        username : req.body.username,
        password1 : req.body.password,
        password2 : req.body.password2,
    }
     

    if(User.password1 != User.password2){ // check if the both the passwords match 
        return res.render('register', {err : "Passwords don't match"})
    }else{
       try {
         hashedPassword = await bcrypt.hash(User.password2, keys.SaltRounds); // hash the password 
       } catch (error) {
           console.log(error);
       }

    }
    MongoClient.connect(keys.URI, (err, client)=>{ // connect to MongoDB
        if(err) throw err;
        const db = client.db(keys.userDB); // What DB to connect to 

        const insertDocuments = function(db, callback) { // funtion to insert the document 
            // Get the documents collection
            const collection = db.collection(User.username); // collection name
            // Insert some document
            collection.insertOne(
              {username : User.username, email: User.email, password: hashedPassword, SignUpDate: Date(), uuid: uuidv4() }
            , function(err, result) {
              callback(result);
            });
          }
          insertDocuments(db, ()=>{ // invoke the function 
              client.close();

          })

          res.redirect('/login')
    })
})


module.exports = router;
