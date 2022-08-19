const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'상품명을 입력해주세요.'],
        trim:true,
        maxlength:50
    },
    price:{
        type:Number,
        required:[true,'상품 가격을 입력주세요.']
    },
    description:{
        type:String,
        required:[true,'상품 설명란을 입력해주세요.'],
        maxlength:200
    },
    imageUrl:{
        type:String,
        required:[true,'상품 사진을 업로드해주세요']
    },
    category:{
        name:String,
        categoryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true
        }
    },
    subCategory:{
        type:String
    },
    numberInStock:{ // 남은재고량
        type:Number,
        default:0
    },
    numberOfStock:{ // 입고 재고량
        type:Number,
        default:0
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
},{
    timestamps:true
});


productSchema.statics.updateStock = function updateStock (productId, qty) {
    return this.findByIdAndUpdate(productId,{
        $inc: {numberInStock : -qty}
    });
}
  

module.exports = mongoose.model('Product',productSchema);
