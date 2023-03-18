const mongoose = require('mongoose')

const productos = mongoose.Schema({

    _id: { type: String, required: true},
    
    producto: {

        nombre: {
            type: String,
            required: true,
        },

        empaque: {
            type: String,
            required: true,
            enum: ['Bolsa','Sobre','Lata']
        },


        precio_unitario: { 
            type: Number, 
            required: function() {
                return this.empaque !== "Bolsa"
            }
        },

        total_unitario: {
            type: Number,
            required: function() {
                return this.empaque !== "Bolsa"
            }
        },
        
        precio_kg: { 
            type: Number, 
            required: function() {
                return this.empaque === "Bolsa"
            }
        },
        total_kg: {
            type: Number,
            required: function() {
                return this.empaque === "Bolsa"
            }
        },

        _id: { type: String, required: true},
    },

    marca: {
        type: String,
        required: true,
    },

    animal: {
        type: String,
        required: true,
        enum: ['Perros','Gatos']
    },

    etapa: {
        type: String,
        required: true,
        enum: ['Cachorros','Adultos']
    },

    empaque: {
        type: String,
        required: true,
        enum: ['Bolsa','Sobre','Lata']
    },

    peso: {
        type: Number,
        required: true,
    },

    unidad : {
        type: String,
        required: true,
        enum: ['Kg','Gr']
    },

    subtotal: { type: Number, required: true},
})

const ventaSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        metodo: {
            type: String,
            required: true,
            enum: ['Efectivo', 'Tarjeta', 'Mercado Pago', 'Transferencia'],
        },
        productos : [
            {
            type: productos,
            required: true,
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        fecha: {
            type: Date,
            required: true,
        }
    }
)

module.exports = mongoose.model('Ventas', ventaSchema)