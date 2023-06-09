const express = require('express')
const productsSchema = require('../models/productos')
const {middlewareVerify,verifyToken} = require('../functions/verifyToken')

const router = express.Router()

//Crear un producto
router.post('/newProduct',middlewareVerify, async (req,res) => {

    const producto = productsSchema(req?.body)
    producto.idUser = res.locals.id

    
    producto.save()
    .then((data) => {
        res.json({message: "Producto creado con éxito"})
    })
    .catch((error) => res.json({"Error": error.message}))
})

//Update product 
router.put('/updateProduct/:id',middlewareVerify, (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    //TODO Pensar Mejor
/*     const update = {};

    for (let field in updatedProduct) {
        update[`producto.${field}`] = updatedProduct[field];
    } */

    productsSchema.updateOne({_id: productId}, {$set: updatedProduct})
        .then(() => {
            res.json({ message: `Product updated for product ${productId}` });
        })
        .catch((error) => {
            res.json({message: error});
        });
});

//Get all products
router.get('/getProducts',middlewareVerify, async (req, res) => {
            
    const query = {};
  
    if (res.locals.id) {
        query.idUser = res.locals.id
      }
    

    if (req.query.marca) {
      query.marca = req.query.marca;
    }
  
    if (req.query.animal) {
      query.animal = req.query.animal;
    }
  
    if (req.query.etapa) {
      query.etapa = req.query.etapa;
    }
  
    if (req.query.empaque) {
      query.empaque = req.query.empaque;
    }
  
    if (req.query.peso) {
      query.peso = req.query.peso;
    }

    const hasFilters = Object.keys(query).length > 0;
  
    productsSchema
      .find(hasFilters ? query : {})
      .then((data) => {
        res.json(data);
      })
      .catch((error) => res.json({ message: error }));
});

  
// Endpoint para obtener todos los tipos únicos de los productos
router.get('/getAllTypes',middlewareVerify, async (req, res) => {


    try {
      const productos = await productsSchema.find({idUser: res.locals.id});
  
      const marcas = [...new Set(productos.map((producto) => producto.marca))];
      const animales = [...new Set(productos.map((producto) => producto.animal))];
      const empaques = [...new Set(productos.map((producto) => producto.empaque))];
      const pesos = [...new Set(productos.map((producto) => producto.peso))];
      const unidades = [...new Set(productos.map((producto) => producto.unidad))];
  
      res.json({
        marcas,
        animales,
        empaques,
        pesos,
        unidades,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los tipos de productos' });
    }
});


//Get product for id
router.get('/getProduct/:id',middlewareVerify, (req,res) => {
    const { id } = req.params
    

    productsSchema.findById(id).then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})

//Get low stock
router.get('/getLowStock',middlewareVerify, async (req,res) => {
    
    const query = {}

    res.locals.id ? query.idUser = res.locals.id : query.idUser = "undefined"

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

    if ( req.query.empaque === "Bolsa" ) {
        query[`producto.total_kg`] = { $lt: 30 }
    } else if ( req.query.empaque === "Sobre" || req.query.empaque === "Lata" ) {
        query[`producto.total_unitario`] = { $lt: 25 }
    }

    productsSchema.find(query).then((data) => {
        res.json(data)
    })
    .catch((error) => res.json({message: error}))
})

//Delete product
router.delete('/deleteProduct/:id',middlewareVerify, (req,res) => {
    const {id} = req.params

    productsSchema.findByIdAndDelete(id)
    .then(() => res.json({message : `Se elimino el producto correctamente`}))
    .catch((error) => res.json({message: error}))
})


module.exports = router