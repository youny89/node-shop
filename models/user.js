const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:[true,'이메일을 입력해주세요.'],
        unique:true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
          ]
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    password:{
        type: String,
        required: [true, '비밀번호를 입력해주세요'],
        minlength: 6,
        select: false,
    },
    address:[
        {
            name:String,
            isSelected:Boolean,
            address:{
                type:String,
                required:true
            },
            detail:{
                type:String,
                required:true
            }
        }
    ],
    cart:{
        items:[
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                qty:{
                    type:Number,required:true
                }
            }
        ]
    },
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }],
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    onOrderId:String,
    
    resetPasswordToken:String,
    resetPasswordExpires:Date,
},{
    timestamps:true
});


// 비멀번호 암호
userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.removeItemFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(p=>p.productId.toString() !==productId.toString() );
    this.cart.items = updatedCartItems;

    return this.save();
}

userSchema.methods.addToCart = function (product,productQty=1) {
    const productIndex = this.cart.items.findIndex(cartProduct=>cartProduct.productId.toString() === product._id.toString())

    const updatedItems = [...this.cart.items];
    if(productIndex >= 0 ){
        updatedItems[productIndex].qty = productQty + updatedItems[productIndex].qty
    } else {
        updatedItems.push({
            productId:product._id,
            qty:productQty
        })
    }

    const updatedCart = {
        items:updatedItems
    };

    this.cart = updatedCart;
    return this.save();

}
userSchema.methods.clearCart = async function(inputPassword){
    this.cart={itemns:[]};
    return this.save();
}

userSchema.methods.matchPassword = async function(inputPassword){
    return await bcrypt.compare(inputPassword,this.password);
}

module.exports = mongoose.model('User',userSchema);
