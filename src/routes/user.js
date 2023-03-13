const express = require('express')
const userSchema = require('../models/user')
//Config del swagger
require('../../config.yaml');

const router = express.Router()




/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         age:
 *           type: integer
 *           format: int32
 *           description: The age of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *       example:
 *         name: John Doe
 *         age: 25
 *         email: johndoe@example.com
*/ 


/**
 * @swagger
 * /api/createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [Users info]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
*/



router.post('/createUser', (req,res) => {
    const user = userSchema(req?.body)
    
    user.save()
    .then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})


// Get all users
/**
 * @swagger
 * /api/getAllUsers:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users info]
 *     responses:
 *       200:
 *         description: The list of the users   
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */


//Get all users
router.get('/getAllUsers', (req,res) => {
    
    userSchema    
    .find()
    .then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})

//Get a user
/**
 * @swagger
 * /api/getUser/{id}:
 *  get:
 *      summary: Get the user by id
 *      tags: [Users info]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              required: true
 *              description: The user id
 *      responses:
 *          200:
 *              description: The user description by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              description: The user was not found
 *          500:
 *              description: Some server error
 */




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
/**
 * @swagger 
 * /api/updateUser/{id}:
 *  put:
 *      summary: Update the user by id
 *      tags: [Change]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              required: true
 *              description: The user id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: User updated by id
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              description: The user was not found
 *          500:
 *              description: Some server error
*/




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

/**
 * @swagger
 * /api/deleteUser/{id}:
 *  delete:
 *      summary: Delete user by id
 *      tags: [Change]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              required: true
 *              description: The user id
 *      responses:
 *          200:
 *              description: User deleted sucessfuly
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              description: The user was not found
 *          500:
 *              description: Some server error
 */



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