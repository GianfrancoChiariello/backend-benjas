const express = require('express')
const ventasSchema = require('../models/ventas')
const productsSchema = require('../models/productos')


const router = express.Router()

//Nueva venta
router.post('/newVenta', (req,res) => {

    const productos = ventasSchema(req.body)

    let subtotal = 0


    productos?.productos.forEach(element => {


        if ( element.empaque !== "Bolsa" || element.producto.total_unitario > 0 ) {

            subtotal += element.subtotal

            //Si hay stock
            productsSchema.findById(element._id).then((data) => {
                if (data.producto.total_unitario >= element.producto.total_unitario) {
                    
                // Descuenta la cantidad 
                productsSchema.findByIdAndUpdate(element._id, { $inc: { 'producto.total_unitario' : -element.producto.total_unitario }})
                .then(() => console.log("Cantidad actualizada para el producto con ID " + element._id))
                .catch((error) => console.log(error))
                }
            })

        } else  {

                subtotal += element.subtotal

                //Verifica si hay stock
                productsSchema.findById(element._id).then((data) => {
                    if (data.producto.total_kg >= element.producto.total_kg) {
                        
                    // Descuenta la cantidad 
                    productsSchema.findByIdAndUpdate(element._id, { $inc: { 'producto.total_kg' : -element.producto.total_kg }})
                    .then(() => console.log("Cantidad actualizada para el producto con ID " + element._id))
                    .catch((error) => console.log(error))
                    
                    }
                })
        }
    });

   
    const newed = {    
        nombre : req.body.nombre,
        email : req.body.email,
        metodo : req.body.metodo,   
        productos : req.body.productos,
        total : subtotal,
        fecha: new Date()
    }

    const venta = ventasSchema(newed)
    venta.save()
    .then((data) => {
        res.json({message: "Venta registrada"})
    })
    .catch((error) => res.json({message: error}))
})

//Get ventas
router.get('/getVentas', (req,res) => {
    
    let query = {}

    if ( req.query.metodo ) {
        query.metodo = req.query.metodo
    }

    if ( req.query.animal ) {
        query[`productos.animal`] = req.query.animal
    }
    
    ventasSchema.find(query)
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}))
})

//Get venta by ID
router.get('/getVenta/:id', (req,res) => {
    ventasSchema.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}))
})




module.exports = router