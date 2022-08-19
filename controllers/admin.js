const Product = require('../models/product')
const Category = require('../models/category')
const CategorySub = require('../models/category_sub')
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * GET admin/index
 * 관리자 메인 페이지
 */
exports.getIndex = asyncHandler(async(req,res,next) => {
    res.render('admin/index',{
        pageTitle:"Node-Shop|관리자",
        path:'admin/index'
    })
});


/**
 * GET admin/index
 * 관리자 상품 메인페이지
 */
exports.getProductIndex = asyncHandler(async(req,res,next) => {
    const products = await Product.find()
    res.render('admin/product',{
        pageTitle:"Node-Shop|관리자",
        path:'admin/product',
        products
    })
});


/**
 * GET admin/index
 * 관리자 상품 등록 페이지
 */
exports.getAddProduct = asyncHandler(async(req,res,next) => {
    const categories = await Category.find().select('-products')
    console.log('Category : ',categories)
    res.render('admin/product/add-product',{
        pageTitle:"Node-Shop|관리자",
        path:'admin/product/add',
        categories
    })
});


/**
 * GET admin/index
 * 관리자 카테고리 등록 페이지
 */
exports.getAddCategory = asyncHandler(async(req,res,next) => {
    const categories = await Category.find().select('-products')
    console.log('categories : ',categories)
    res.render('admin/product/add-category',{
        pageTitle:"Node-Shop|관리자",
        path:'admin/product/add-category',
        categories
    })
});

/**
 * GET admin/index
 * 관리자 카테고리 등록 프로세스
 */
exports.postAddCategory = asyncHandler(async(req,res,next) => {
    const {name} = req.body;
    if(!name) return res.redirect('/admin/add-category');
    await Category.create({name});
    res.redirect('/admin/add-category')
});

/**
 * GET admin/index
 * 관리자 하위 카테고리 등록 프로세스
 */
exports.postAddSubCategory = asyncHandler(async(req,res,next) => {
    const {categoryId,subName} = req.body;

    const subCategory = await CategorySub.create({
        name:subName,
        parent_category:categoryId
    });

    const category = await Category.findById(categoryId);
    if(category && !category.sub_category) category.sub_category=[];
    category.sub_category.push(subCategory.name)

    await category.save();

    res.redirect('/admin/add-category')
});


/**
 * POST admin/index
 * 관리자 상품 등록 프로세스
 */
exports.postAddProduct = asyncHandler(async(req,res,next) => {
    const {
        title,
        price,
        description,
        imageId,
        categoryId,
        sub_category,
        numberInStock
    } = req.body;
    // const {path:imageUrl} = req.file;

    if(!title || !price || !description || !imageId) return res.status(422).render('admin/product/add',{
        pageTitle:"관리자|상품등록",
        path:"/admin/add-product"
    });
    const category = await Category.findById(categoryId);
    if(!category) return res.status(422).render('admin/product/add',{
        pageTitle:"관리자|상품등록",
        path:"/admin/add-product"
    });
    const product = new Product({
        title, 
        price,
        description,
        imageUrl:`https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_HASH_ID}/${imageId}`,
        category: {
            categoryId,
            name:category.name
        },
        subCategory:sub_category,
        numberInStock,
        numberOfStock:numberInStock
    });
    const result = await product.save();
    if(!category.products) category.products = [];
    category.products.push(product._id)
    await category.save();

   res.redirect('/admin/products/')
});

