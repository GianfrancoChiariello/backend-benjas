const express = require('express')
const productsSchema = require('../models/productos')



const router = express.Router()

//Crear un producto
router.post('/newProduct', (req,res) => {
    const producto = productsSchema(req?.body)
    
    producto.save()
    .then((data) => {
        res.json({message: "Producto creado con éxito"})
    })
    .catch((error) => res.json({"Error": error.message}))
})

//Update product 
router.put('/updateProduct/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    const update = {};

    for (let field in updatedProduct) {
        update[`producto.${field}`] = updatedProduct[field];
    }

    productsSchema.updateOne({_id: productId}, {$set: update})
        .then(() => {
            res.json({ message: `Product updated for product ${productId}` });
        })
        .catch((error) => {
            res.json({message: error});
        });
});

//Get all products
router.get('/getProducts', (req,res) => {
    
    const query = {}

    if (req.query.marca) {
        query.marca = req.query.marca
    } 

    if (req.query.animal) {
        query.animal = req.query.animal
    }
    
    if (req.query.etapa) {
        query.etapa = req.query.etapa
    }
        
    if (req.query.empaque) {
        query.empaque = req.query.empaque
    }
            
    if (req.query.peso) {
        query.peso = req.query.peso
    }

    productsSchema.find(query).then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})

//Get product for id
router.get('/getProduct/:id', (req,res) => {
    const { id } = req.params
    

    productsSchema.findById(id).then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})

//Get low stock
router.get('/getLowStock', (req,res) => {
    
    const query = {}

    if (req.query.marca) {
        query.marca = req.query.marca
    } 

    if (req.query.animal) {
        query.animal = req.query.animal
    }
    
    if (req.query.etapa) {
        query.etapa = req.query.etapa
    }
        
    if (req.query.empaque) {
        query.empaque = req.query.empaque
    }
            
    if (req.query.peso) {
        query.peso = req.query.peso
    }

    query[`producto.cantidad`] = { $lt: 5 }


    productsSchema.find(query).then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})






module.exports = router