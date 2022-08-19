const asyncHandler = require("../middlewares/asyncHandler");
const Category = require('../models/category')
const Product = require('../models/product')

module.exports.getProductByCategorys = asyncHandler(async(req,res,next) => {
    const {name} = req.params;
    const results = await Category.find({name:name.toUpperCase()}).populate('products');
    let data;
    results.forEach(d=>{
        data= {
            ...d._doc
        }
    });
    res.render('category/index',{
        pageTitle:'Node-Shop|top',
        path:`/category/${name}`,
        data
    })
});

module.exports.getProductBySubCategoryId = asyncHandler(async(req,res,next) => {
    const {name, sub_name} = req.params
    const category = await Category.findOne({name}).select('name sub_category')
    const products =  await Product.find({
        'category.name':name,
        'subCategory':sub_name
    }); 
    // console.log(products);
    console.log(category)
    res.render('category/sub-category',{
        products,
        category,
        pageTitle:"NodeShop",
        path:""
    })

});