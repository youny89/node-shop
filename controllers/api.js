const superagent = require('superagent');
const crypto = require('crypto');
const asyncHandler = require("../middlewares/asyncHandler");
const Product = require('../models/product')
const Category = require('../models/category')
const User = require('../models/user')
const {sendEamil} = require('../helper');

module.exports.getImageUploadUrl =  asyncHandler(async(req,res,next) => {
    const {_body:{result : {id, uploadURL}}} = await superagent
        .post(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`)
        .set('Content-Type','application/json')
        .set('Authorization',`Bearer ${process.env.CLOUDFLARE_IMAGES_TOKEN}`)
    
    return res.json({
        ok:true,
        id,
        uploadURL
    })
});

module.exports.postAddToCart = asyncHandler(async(req,res,next) => {
    const {id} = req.body;
    const product = await Product.findById(id);
    if(!product) res.status(404).json({ok:false})
    await req.user.addToCart(product);
    res.json({ok:true})
});

module.exports.postRemoveCartItem = asyncHandler(async(req,res,next) => {
    const {id} = req.body;
    await req.user.removeItemFromCart(id);
    res.json({ok:true})
});

module.exports.getProductByFiltername = asyncHandler(async(req,res,next)=>{
    console.log(req);
    const {category, filter} = req.params;
    const decodedCategory = decodeURIComponent(category);
    console.log('decodedCategory : ',decodedCategory)
    const {sub_name} = req.query;
    const decodedSubName = decodeURIComponent(sub_name)

    console.log(decodedCategory ,decodedSubName)

    const query = Product.find({'category.name':decodedCategory.toUpperCase()})
    if(sub_name) {
        query.where({subCategory:decodedSubName})
    } 

    if(filter==='new') query.sort({createdAt:-1})
    if(filter==='low')  query.sort({price:1})
    if(filter==='high')  query.sort({price:-1})
    if(filter==='review')  query.sort({review:-1});

    const products = await query;
    res.json({
        ok:true,
        products
    })
})

module.exports.getCategoryWithSubCategory = asyncHandler(async(req,res,next)=>{
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId).select('sub_category');
    res.json({
        ok:true,
        category
    })
});

module.exports.postForgot = asyncHandler(async(req,res,next)=>{
    const {email} = req.body;
    const user = await User.findOne({email})
    if(!user) return res.status(404).json({ok:false});
    
    crypto.randomBytes(32,async (err,buffer)=>{
        if(err) return res.status(500).json({ok:false})
        const token = buffer.toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires =Date.now() + 3600000;
        await user.save();
        await sendEamil({
            from:process.env.EMAIL_USER,
            to:email,
            subject:"[테스트] Node-Shop 비밀번호 재설정",
            text:`[테스트] Node-Shop 비밀번호 재설정 하기 위해서 다음의<a href="http://localhost:3000/reset/${token}">링크</a>를 클릭해주세요.`,
        });
        return res.json({ok:true});
    })

})