const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    sub_category:[String]
},{
    timestamps:true
});

module.exports = mongoose.model('Category',categorySchema);
