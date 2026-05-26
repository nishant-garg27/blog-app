const express = require("express")
const path = require('path')
const userRoute = require('./routes/user')

const blogRoute = require('./routes/blog')
const Blog = require('./models/blog')

const mongoose = require('mongoose')
const app = express();
const PORT = 8000
const cookieParser = require('cookie-parser')
const { checkCookieAuthentication } = require('./middleware/authentication')
mongoose.connect('mongodb://localhost:27017/blogify').then((e) => {
    console.log('mongoDB connected');
})

app.use(express.static(path.resolve('./Public')));


app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())
app.use(checkCookieAuthentication('token'))
app.get('/', async (req,res) => {
    const allBlogs = await Blog.find({})
    return res.render("home", {
        user: req.user,
        blogs: allBlogs
    });
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`)) 