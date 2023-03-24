const express = require('express')
const ventasSchema = require('../models/ventas')
const productsSchema = require('../models/productos')
const dayjs = require('dayjs');
const router = express.Router()
const {middlewareVerify} = require('../functions/verifyToken')



//Nueva venta
router.post('/newVenta',middlewareVerify, (req,res) => {

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
        fecha: new Date(),
        idUser: res.locals.id
    }

    const venta = ventasSchema(newed)
    venta.save()
    .then((data) => {
        res.json({message: "Venta registrada"})
    })
    .catch((error) => res.json({message: error}))
})

//Get ventas
router.get('/getVentas', middlewareVerify, async (req,res) => {

    
    let query = {}

    if (res.locals.id) {
      query.idUser = res.locals.id
    }

    //Para saber cuantas ventas hay por metodo de pago
    if ( req.query.metodo ) {
        query.metodo = req.query.metodo
    }
  
      //Para saber cuantas ventas hay de perros o gatos
    if ( req.query.animal ) {
        query[`productos.animal`] = req.query.animal
    }
      
    ventasSchema.find(query)
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}))
})

//Get venta by ID
router.get('/getVenta/:id',middlewareVerify, (req,res) => {
    ventasSchema.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}))
})

//Get ventas by today, week, month, year
router.get('/getVentasByDate',middlewareVerify, (req, res) => {
    let query = {};
        
    if (res.locals.id) {
      query.idUser = res.locals.id
    }
  
    if (req.query.fecha) {
      let fechaInicio, fechaFin;
      const hoy = dayjs();
  
      if (req.query.fecha === 'dia') {
        fechaInicio = hoy.startOf('day');
        fechaFin = hoy.endOf('day');
      } else if (req.query.fecha === 'semana') {
        fechaInicio = hoy.startOf('week');
        fechaFin = hoy.endOf('week');
      } else if (req.query.fecha === 'mes') {
        fechaInicio = hoy.startOf('month');
        fechaFin = hoy.endOf('month');
      } else if (req.query.fecha === 'año') {
        fechaInicio = hoy.startOf('year');
        fechaFin = hoy.endOf('year');
      }
  
      query.fecha = {
        $gte: fechaInicio.toDate(),
        $lte: fechaFin.toDate()
      };
    } else {
        return res.status(400).json({ message: 'Debe proporcionar el parámetro "fecha".' });
    }
  
    ventasSchema
      .find(query)
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json({ message: error }));
});

// Get top 5 productos mas vendidos
router.get('/getTop5',middlewareVerify, async (req, res) => {
  
  try {
    const result = await ventasSchema.aggregate([
      {
        $unwind: "$productos"
      },
      {
        $match: {idUser: res.locals.id}
      },
      {
        $group: {
          _id: "$productos.producto.nombre",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]).exec();
    res.json(result);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get top 5 metodos mas usados
router.get('/getTop5Payments',middlewareVerify, async (req,res) => {

  try {
    const result = await ventasSchema.aggregate([
      {
        $unwind: "$productos"
      },
      {
        $match: {idUser: res.locals.id}  
      },
      {
        $group: {
          _id: "$metodo",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]).exec();
    res.json(result);
  } catch (err) {
    res.json({ message: err });
  }
})

//Delete venta 
router.get('/deleteVenta/:id',middlewareVerify, async (req,res) => {
  
    const id = req.params.id

    
    ventasSchema.findById(id)
    .then((data) => {

      data.productos.forEach((data) => {
        
        if ( data.empaque != "Bolsa") {
          // Sumo la cantidad 
            productsSchema.findByIdAndUpdate(data._id, { $inc: { 'producto.total_unitario' : +data.producto.total_unitario }})
            .then(() => res.json("Cantidad actualizada para el producto con ID " + data._id))
        } else {
            // Sumo la cantidad 
            productsSchema.findByIdAndUpdate(data._id, { $inc: { 'producto.total_kg' : +data.producto.total_kg }})
            .then(() => res.json("Cantidad actualizada para el producto con ID " + data._id))
        }

      })


    })

    ventasSchema.findByIdAndDelete(id)
    .then(() => {
      res.json({message: "Venta eliminada correctamente"})
    })
    .catch((e) => {
      res.status(400).json({message: e})
    })


})


module.exports = router