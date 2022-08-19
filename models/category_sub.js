const mongoose = require('mongoose')

const SubCategorySchema = new mongoose.Schema({
    name:String,
    parent_category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    }
},{
    timestamps:true
});

module.exports = mongoose.model('SubCategory',SubCategorySchema);
