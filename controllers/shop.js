const asyncHandler = require('../middlewares/asyncHandler')
const Product= require('../models/product')
const Order= require('../models/order')
const Review = require('../models/review');
const request = require('superagent');

exports.getIndex = asyncHandler (async (req,res,next) => {
    const products = await Product.find()
    res.render('shop/index',{
        pageTitle:"Node-Shop",
        path:'/',
        products
    })
})

exports.getSearch = asyncHandler (async (req,res,next) => {
    const {q} = req.query;
    const products = await Product.find({
        title: {$regex:q, $options:'i'}
    });
    res.render('shop/search',{
        pageTitle:"Node-Shop",
        path:'/',
        products
    })
})


exports.getProducts = (req,res,next) => {
    res.render('shop/product-list',{
        pageTitle:"Node-Shop|상품 리스트"
    })
}


exports.getProduct =asyncHandler(async (req,res,next) => {
    const {productId} = req.params;
    const product = await Product.findById(productId)
    const reviews = await Review.find({
        productId:productId
    }).populate('userId','email')
    res.render('shop/product-detail',{
        pageTitle:"Node-Shop|상세 페이지",
        path:"/",
        product,
        reviews,
        order_address:req.user && req.user.address || ''
    })
})


exports.getCart =asyncHandler(async (req,res,next) => {
    const cart = await req.user.cart.populate('items.productId');
    let totalPrice=0;
    cart.items.forEach(product=>{
        totalPrice += product.productId.price * product.qty;
    })
    res.render('shop/cart',{
        pageTitle:"Node-Shop|카트",
        path:"/cart",
        product:cart.items,
        totalPrice,
        order_address:req.user.address
    })
})


/**
 * POST /clear-cart
 * 카트 비우기
 */
exports.postClearCart =asyncHandler(async (req,res,next) => {
    await req.user.clearCart();
    res.render('shop/cart',{
        pageTitle:"Node-Shop|카트",
        path:"/cart",
        product:[],
        totalPrice:0
    })
})


/**
 * POST /order
 * 카카오페이 결제준비
 * 
 */

exports.postSingleProductOrder =asyncHandler(async (req,res,next) => {
    const {productId,qty,address,address_detail} = req.body;
    const product = await Product.findById(productId);
    const order = new Order({
        products:[{
            product,
            qty:qty | 1
        }],
        user:{
            email:req.user.email,
            user:req.user._id
        },
        address:address+" "+address_detail,
        method:"single"
    })

    const queryData = {
        "cid":"TC0ONETIME", 
        "partner_order_id":order._id.toString(),
        "partner_user_id":"partner_user_id",
        "item_name":product.title,
        "quantity":qty | 1,
        "total_amount":product.price,
        "vat_amount":"200",
        "tax_free_amount":"0",
        "approval_url":"https://node-myshop.herokuapp.com/success",
        "fail_url":"https://node-myshop.herokuapp.com/fail",
        "cancel_url":"https://node-myshop.herokuapp.com/cancel"
    }

    const resonse = await request
        .post('https://kapi.kakao.com/v1/payment/ready')
        .query(queryData)
        .set('Content-Type','application/x-www-form-urlencoded;charset=utf-8')
        .set('Authorization',`KakaoAK ${process.env.KAKAO_ADMIN_KEY}`)

    const {next_redirect_pc_url, tid} = resonse.body;
    order.tid = tid;
    req.user.onOrderId = order._id;
    await order.save();
    await req.user.save();
    res.redirect(next_redirect_pc_url);
})



exports.postOrders =asyncHandler(async (req,res,next) => {
    const {order_address,order_address_detail} = req.body;
    const userWithProducts = await req.user.populate('cart.items.productId')
    const products = userWithProducts.cart.items.map(product=>{
        return {
            qty:product.qty,
            product:{...product.productId._doc}
        }
    });
    const totalPrice = products.reduce((acc,cur,i)=> acc + (cur.qty * cur.product.price),0)

    let orderName='';
    for(let i=0; i < products.length; i ++) {
        if(i >= 1) break;
        orderName += products[i].product.title + ' 외 ('+(products.length - 1) +')개';
    }
    const order = new Order({
        user:{
            email:userWithProducts.email,
            user:userWithProducts._id
        },
        products,
        address:order_address +" "+order_address_detail,
        method:"multiple"
    })

    const queryData = {
        "cid":"TC0ONETIME", 
        "partner_order_id":order._id.toString(),
        "partner_user_id":"partner_user_id",
        "item_name":orderName,
        "quantity":"1",
        "total_amount":totalPrice,
        "vat_amount":"200",
        "tax_free_amount":"0",
        "approval_url":"https://node-myshop.herokuapp.com/success",
        "fail_url":"https://node-myshop.herokuapp.com/fail",
        "cancel_url":"https://node-myshop.herokuapp.com/cancel",
    }

    const resonse = await request
        .post('https://kapi.kakao.com/v1/payment/ready')
        .query(queryData)
        .set('Content-Type','application/x-www-form-urlencoded;charset=utf-8')
        .set('Authorization',`KakaoAK ${process.env.KAKAO_ADMIN_KEY}`)

    const {next_redirect_pc_url, tid} = resonse.body;
    order.tid = tid;
    req.user.onOrderId = order._id;
    await order.save();
    await req.user.save();
    res.redirect(next_redirect_pc_url);
})

exports.getSuccess =asyncHandler(async (req,res,next) => {
    const {onOrderId} = req.user;
    const {pg_token} = req.query;
    const order = await Order.findById(onOrderId);
    const queryData = {
        cid:"TC0ONETIME",
        tid:order.tid, 
        partner_order_id:onOrderId,
        partner_user_id:"partner_user_id",
        pg_token
    }
    const resonse = await request
        .post('https://kapi.kakao.com/v1/payment/approve')
        .query(queryData)
        .set('Content-Type','application/x-www-form-urlencoded;charset=utf-8')
        .set('Authorization',`KakaoAK ${process.env.KAKAO_ADMIN_KEY}`)

    const data = resonse.body;
    order.extra_info = {
        ...data
    }
    req.user.onOrderId=undefined;
    if(order.method === 'multiple'){
        req.user.cart={items:[]}
    }

    req.user.orders.push(order._id)
    const {products} = order
    products.forEach(async p=> {
        await Product.updateStock(p.product._id,p.qty)
    });
    await order.save();
    await req.user.save();
    res.redirect('/orders')
});


exports.getOrders =asyncHandler(async (req,res,next) => {
    const orders = await Order
        .find({"user.user":req.user.id.toString()});
    res.render('shop/orders',{
        pageTitle:"order",
        path:"/orders",
        orders
    })
});


exports.getOrderDetail =asyncHandler(async (req,res,next) => {
    const {orderId} = req.params
    const order = await Order.findById(orderId)
    res.render('shop/order-detail',{
        pageTitle:"order",
        path:"/order-detail",
        order
    })
});


exports.getAddReview =asyncHandler(async (req,res,next) => {
    const {productId} = req.params;
    const {orderId} = req.query;

    if(!productId) return res.redirect('/orders')
    const product = await Product.findById(productId);
    const alreadReview = await Review.find({userId:req.user._id,productId:product._id});
    if(alreadReview && alreadReview.length >= 1){
        console.log('이미 해당 상품에 리뷰를 작성했습니다.')
        return res.redirect(`/orders/${orderId}`);
    }
    res.render('shop/add-reivew',{
        pageTitle:"add review",
        path:"/add-review",
        product
    })
});
exports.postAddReview =asyncHandler(async (req,res,next) => {
    const {
        title,
        review,
        score,
        height,
        weight,
        productId
    } = req.body;


    const product = await Product.findById(productId);
    if(!product) return res.status(404).redirect('/reviews')

    const alreadReview = await Review.find({userId:req.user._id,productId:product._id});
    if(alreadReview && alreadReview.length >= 1){
        console.log('이미 해당 상품에 리뷰를 작성했습니다.')
        return res.redirect('/reviews');
    }



    const newReview = new Review({
        title,
        review,
        score:parseInt(score),
        extra_info:{
            height,
            weight
        },
        productId,
        userId:req.user._id
    });

    await newReview.save();
    product.reviews.push(newReview._id);
    req.user.reviews.push(newReview._id);
    await product.save();
    await req.user.save();
    res.redirect('/reviews');
});


