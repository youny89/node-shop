const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    review:{
        type:String,
        required:true,
        trim:true
    },
    score:{
        type:Number,
        max:5,
        required:true,
        default:5
    },
    extra_info:{
        height:String,
        weight:String
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
},{
    timestamps:true
});

module.exports = mongoose.model('Review',reviewSchema);
