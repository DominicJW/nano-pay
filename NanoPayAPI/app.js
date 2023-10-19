const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');//session is a function() which returns a function in form (req,res,next) =>{}
const passport = require("passport");
const cors = require("cors");


require('./config/passport')(passport)
//just executes the function stored at /config/passport 
//passing the variable passport as a parameter 




//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));//needed maybe for session
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());//?
app.use(flash());//?
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })




// app.use('/user',require("./routes/user_routes"));
// app.use('/partner',require("./routes/partner_routes"));

app.use('/',require('./routes/index'));
app.use('/',require("./routes/user_routes"));
app.use('/',require("./routes/partner_routes"));
//this is better than above as the passport path args do not automatically start with /user /partner
//better to use absolute paths throughout

router.get("/testpython",async(req,res)=>{
    console.log("Hello");
    res.send("Hello");
}
);


app.listen(3000); 
