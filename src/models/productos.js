const mongoose = require('mongoose')


const productSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
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
    empaque: {
        type: String,
        required: true,
        enum: ['Bolsa','Sobre','Lata']
    },
})


const productsSchema = mongoose.Schema(
    {
        producto : {
            type: productSchema,
            required: true,
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
            enum: ['Cachorros','Adultos','Mixed']
        },
        empaque: {
            type: String,
            required: true,
            enum: ['Bolsa','Sobre','Lata']
        },
        peso: {
            type: Number,
            required: true
        },
        unidad: {
            type: String,
            required: true,
            enum: ['Kg','Gr']
        },
        idUser: {
            type: String,
            required: true
        }
    }

)

module.exports = mongoose.model('Productos', productsSchema)