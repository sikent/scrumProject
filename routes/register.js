const express = require('express');
const router  = express.Router();
const keys = require('../config/keys');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');


router.get('/', (req, res) =>{
    res.render('register', {err: "None"});

})
router.post('/', async(req, res)=>{
    let hashedPassword 
     const User ={   
        email: req.body.email,
        username : req.body.username,
        password1 : req.body.password,
        password2 : req.body.password2,
    }
     

    if(User.password1 != User.password2){
        res.render('register', {err : "Passwords don't match"})
    }else{
       try {
         hashedPassword = await bcrypt.hash(User.password2, keys.SaltRounds);
       } catch (error) {
           console.log(error);
       }

    }
    MongoClient.connect(keys.URI, (err, client)=>{
        if(err) throw err;
        const db = client.db(keys.userDB);

        const insertDocuments = function(db, callback) {
            // Get the documents collection
            const collection = db.collection(User.username);
            // Insert some document
            collection.insertOne(
              {username : User.username, email: User.email, password: hashedPassword, SignUpDate: Date(), uuid: uuidv4() }
            , function(err, result) {
              callback(result);
            });
          }
          insertDocuments(db, ()=>{
              client.close();

          })

          res.redirect('/login')
    })
})


module.exports = router;
