const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb');
const keys = require('../config/keys')
const bcrypt = require('bcrypt')


router.get('/', (req, res)=>{
    res.render('login', {err: "None"});
})
router.post('/userLogin', async (request, response)=>{
    const EnteredPassword = request.body.password;
    const errors = [];

    const UserDocs= [];

   try {
   await MongoClient.connect(keys.URI, (err, client)=>{
        if(err) throw err
        const db = client.db(keys.userDB);
    
        const findUser = (db , callback)=>{
            const collection = db.collection(request.body.username)
             collection.find({}).toArray(function(err, docs) {
        
        console.log("Found the following records");
        //console.log(docs)
        // User.push(docs)
        callback(docs);
            });
        }
        findUser(db, (docs)=>{
            UserDocs.push(docs)
            client.close();
            let User = {
                uuid: UserDocs[0][0].uuid,
                username: UserDocs[0][0].username,
                password: UserDocs[0][0].password
            }
          
            bcrypt.compare(EnteredPassword, User.password, function(err, res) {
                if(res) {
                console.log('Passwords Match')
                request.session.userID = User.uuid;
                request.session.username = User.username;
                request.session.auth = true
                return response.redirect('/dashboard')

                } else {
                 errors.push(`username or passwords don't match`)   
                 response.render('login', {err: errors})
                } 
              });
               
    })
    
       })
   } catch (error) {
       console.log(error)
   }

})

module.exports = router;
