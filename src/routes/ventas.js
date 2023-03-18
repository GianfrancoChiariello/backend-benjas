const express = require('express')
const ventasSchema = require('../models/ventas')
const productsSchema = require('../models/productos')


const router = express.Router()

//Nueva venta
router.post('/newVenta', (req,res) => {

    const productos = ventasSchema(req.body)

    let cantidad = 0
    let subtotal = 0


    productos?.productos.forEach(element => {

        console.log(element)

/*         if ( element.empaque !== "Bolsa" || element.total_unitaria > 0 ) {

            cantidad += element.total_unitaria
            subtotal += element.subtotal

            //Si hay stock
            productsSchema.findById(element._id).then((data) => {
                if (data.producto.cantidad >= element.total_unitaria) {
                    
                // Descuenta la cantidad 
                productsSchema.findByIdAndUpdate(element._id, { $inc: { 'producto.cantidad' : -element.total_unitaria }})
                .then(() => console.log("Cantidad actualizada para el producto con ID " + element._id))
                .catch((error) => console.log(error))
                }
            })

        } else  {

                cantidad += element.total_kgs
                subtotal += element.subtotal

                //Verifica si hay stock
                productsSchema.findById(element._id).then((data) => {
                    if (data.producto.total_kgs >= element.total_kgs) {
                        
                    // Descuenta la cantidad 
                    productsSchema.findByIdAndUpdate(element._id, { $inc: { 'producto.total_kgs' : -element.total_kgs }})
                    .then(() => console.log("Cantidad actualizada para el producto con ID " + element._id))
                    .catch((error) => console.log(error))
                    
                    }
                })
        } */
    });

    
   
   
   
   
   
   
    const newed = {    
        nombre : req.body.nombre,
        metodo : req.body.metodo,   
        productos : req.body.productos,
        total : subtotal * cantidad,
        fecha: new Date()
    }

    const venta = ventasSchema(newed)
    venta.save()
    .then((data) => {
        res.json({message: "Venta registrada"})
    })
    .catch((error) => res.json({message: error}))
})



module.exports = router