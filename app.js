require('dotenv').config()
const express= require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const compression = require('compression')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');

const app = express();
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const categoryRouter = require('./routes/category');
const apiRouter = require('./routes/api');
const usersRouter = require('./routes/users');

app.set('view engine','ejs')
app.set('views','views');

app.use(morgan('dev'));
app.use(compression());
app.use(express.static('public'))
app.use('/images',express.static('images'))
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(session({
    secret:process.env.SESSION_SCRET,
    resave:false,
    saveUninitialized:false,
    store:new MongoDBStore({
        uri:process.env.MONGOOSE_URL,
        collection:'sessions'
    })
}))
app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn || false;
    res.locals.isAdmin = req.session.isAdmin || false;
    res.locals.getDateFormat = function (input) {
        const date = new Date(input);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    console.log(res.locals)
    next();
})
app.use(async (req,res,next) => {
    if(!req.session.user) {
        return next();
    }
    try {
        const user = await User.findById(req.session.user.id)
        if(!user) return next();
        req.user = user;
        next();
    } catch (error) {   
        next(new Error(error))
    }
})
app.use(authRouter)
app.use(shopRouter)
app.use('/admin',adminRouter)
app.use('/users',usersRouter)
app.use('/category',categoryRouter)
app.use('/api',apiRouter)

app.use((req,res)=>{
    res.render('404',{
        pageTitle:"404",
        path:'/404'
    })
})
app.use((error,req,res,next) => {
    const err = process.env.NODE_ENV==='development' ? error:new Error('서버 에러');
    console.log(error)
    res.render('error',{
        pageTitle:"Error",
        path:"/error",
        error:err.message
    })
})

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT,async () => {
    await mongoose.connect(process.env.MONGOOSE_URL);
    console.log(`server is running on port ${PORT}`)
});
