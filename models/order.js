const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products:[
        {
            product:{type:Object, required:true},
            qty:{
                type:Number,
                default:1
            }
        }
    ],
    user:{
        email:{
            type:String,
            required:true
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    address:{
        type:String,
        required:true
    },
    method:{
        type:String,
        enum:['single','multiple']
    },
    extra_info:Object,
    tid:String
},{
    timestamps:true
});

  

module.exports = mongoose.model('Order',orderSchema);
