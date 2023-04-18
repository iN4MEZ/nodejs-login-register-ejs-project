const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
require('dotenv').config();

const PORT = process.env.PORT || 5000

//Connection to database

mongoose.connect(process.env.DB, {
    useNewUrlParser: true
},console.log("Database Connected!"));

global.loggedIn = null;


// Controllers
const indexControllers = require('./controllers/indexControllers');
const loginControllers = require('./controllers/loginControllers');
const registerControllers = require('./controllers/registerControllers');
const storeUserControllers = require('./controllers/storeUserControllers');
const loginUserControllers = require('./controllers/loginUserControllers')
const logoutControllers = require('./controllers/logoutControllers');
const homeControllers = require('./controllers/homeControllers');
const accountEditorControllers = require('./controllers/accountEditorControllers');
const storeUserAccountsControllers = require('./controllers/storeUserAccountControllers');

// Middleware
const redirectIfAuth = require('./middleware/redirectIfAuth');
const redirectIfNotAuth = require('./middleware/redirectIfNotAuth');
const logger = require('./middleware/logger');
app.use(logger);


// USE
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(flash());
app.use(methodOverride('_method'));
app.use(expressSession({
    secret: process.env.SECRET
}));
app.use("*",(req,res,next) => {
    loggedIn = req.session.userId;
    next();
});
app.set('view engine','ejs');

// Routes
app.get('/',indexControllers);
app.get('/login',redirectIfAuth,loginControllers);
app.get('/register',redirectIfAuth,registerControllers);
app.get('/logout',logoutControllers)
app.get('/home',redirectIfNotAuth,homeControllers)
app.get('/accounts',redirectIfNotAuth,accountEditorControllers)

app.post('/user/register',redirectIfAuth,storeUserControllers);
app.post('/user/login',redirectIfAuth,loginUserControllers)
app.put('/accounts/edit',storeUserAccountsControllers);


app.listen(PORT,() => {
    console.log("Server Listen port " + PORT);
})



