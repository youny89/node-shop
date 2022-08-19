const bcrypt = require('bcrypt')
const User = require('../models/user');
const asyncHandler = require('../middlewares/asyncHandler')


/**
 * GET users/me
 * render my page
 */

module.exports.me = asyncHandler(async (req,res) => {
    console.log('My Page user: ' , req.user);

    res.render('users/me',{
        path:"/users/me",
        pageTitle:"My Page",
        user:req.user
    })
})

module.exports.postUpdateProfile = asyncHandler(async (req,res) => {
    const {name} = req.body;
    const updatedUser = await User.findByIdAndUpdate({_id:req.user.id},{name},{new:true});
    console.log(updatedUser);
    res.render('users/me',{
        path:"/users/me",
        pageTitle:"My Page",
        user:updatedUser
    })
})

module.exports.postUpdatePassword = asyncHandler(async (req,res) => {
    const {current_password,new_password,confirm_new_password} = req.body;
    if(!current_password && !new_password && !confirm_new_password ) return res.redirect('/users/me')
    if(new_password !== confirm_new_password) return res.redirect('/users/me')

    const user = await User.findById(req.user.id).select('password');
    const isMatched = await bcrypt.compare(current_password,user.password);
    if(!isMatched) return res.redirect('/users/me');

    user.password = new_password;
    await user.save()

    res.render('users/me',{
        path:"/users/me",
        pageTitle:"My Page",
        user:req.user
    })
})
module.exports.postUpdateProfile = asyncHandler(async (req,res) => {
    const {name} = req.body;
    const updatedUser = await User.findByIdAndUpdate({_id:req.user.id},{name},{new:true});
    console.log(updatedUser);
    res.render('users/me',{
        path:"/users/me",
        pageTitle:"My Page",
        user:updatedUser
    })
})

module.exports.postUpdateAddress = asyncHandler(async (req,res) => {
    const {address,address_detail,address_name} = req.body;
    const addressData = {
        address,
        name:address_name,
        detail:address_detail,
        isSelected:true
    }   
    req.user.address.push(addressData);
    await req.user.save();

    res.redirect('/users/me')

})