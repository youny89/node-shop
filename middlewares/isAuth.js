module.exports.onlyPublic = (req,res,next) => {
    if(req.session.isLoggedIn) return res.redirect('/');
    next();
}
module.exports.onlyPrivate = (req,res,next) => {
    if(!req.session.isLoggedIn) return res.redirect('/login');
    next();
}