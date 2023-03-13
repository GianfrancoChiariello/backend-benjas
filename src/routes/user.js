const express = require('express')
const userSchema = require('../models/user')

const router = express.Router()




//Create users
router.post('/createUser', (req,res) => {
    
    const user = userSchema(req?.body)
    
    user.save()
    .then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})


//Get all users
router.get('/getAllUsers', (req,res) => {
    
    userSchema    
    .find()
    .then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})


//Get a user id
router.get('/getUser/:id', (req,res) => {
    const { id } = req.params;
    userSchema    
    .findById(id)
    .then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})

//Update a user
router.put('/updateUser/:id', (req,res) => {
    const { id } = req.params;
    const { name, age, email } = req.body

    userSchema    
    .updateOne({_id: id}, { $set: {name,age,email} } )
    .then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})


//Delete user 
router.delete('/deleteUser/:id', (req,res) => {
    const { id } = req.params;

    userSchema    
    .deleteOne({_id : id})
    .then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})




module.exports = router