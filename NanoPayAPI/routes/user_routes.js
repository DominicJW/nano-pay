const express = require('express');
const router  = express.Router();
const {ensureAuthenticated,ensureUserAuthenticated} = require('../config/auth') 
const {User} = require("../models/user");
const {Ticket} = require("../models/ticket");
const {Partner} = require("../models/partner");
const {Service} = require("../models/service");
const bcrypt = require('bcrypt');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const cors = require('cors');



var sys   = require('sys'),
    spawn = require('child_process').spawn,
    dummy  = spawn('python', ['test.py']);



router.get('/user', async(req,res)=>{
    return res.render('user_views/welcome');
})

router.get('/user/dashboard',ensureUserAuthenticated,async(req,res)=>{
    myuser = req.user;
    return res.render('user_views/dashboard',{
        user: myuser
    });
})

router.get('/user/login',async(req,res)=>{
    return res.render('user_views/login');
})
router.get('/user/register',async (req,res)=>{
    return res.render('user_views/register')
})


// "/absolutepath" "relativepath"
router.post('/user/login',async (req,res,next)=>{
    passport.authenticate('user-local',{successRedirect : '/user/dashboard',failureRedirect: '/user/login',failureFlash : true})(req,res,next)
//  module.method       //gets the userlocalstrategy //other params         //returns a function                               //which is then called with these parameters
                                                                                                                        //req is where the usrname and password comefrom
})

router.post('/user/register',async (req,res)=>{
    const {name,email, password, password2} = req.body;
    let errors = [];
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }
    if(errors.length > 0 ) {
    return res.render('user_views/register', {
        errors : errors,
        name : name,
        email : email,
        password : password,
        password2 : password2})
    } 
    else {
       User.findOne({email : email}).exec((err,user)=>{
        if(user) {
            errors.push({msg: 'email already registered'});
            return res.render('user_views/register',{errors,name,email,password,password2})  
           } else {
            const newUser = new User({
                name : name,
                email : email,
                password : password,
                credit : 1000
            });
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newUser.save()
                    .then((value)=>{
                        req.flash('success_msg','You have now registered!');
                        res.redirect('/user/login');
                    })
                    .catch(value=>
                     console.log(value)
                        );
                }));
             }
       })
    }
})


//should try to keep it restful api as possible, so crud and ui are seperate
//and can be worked on independantly
router.get("/user/active_tickets",ensureUserAuthenticated, async(req,res)=>{
    tickets = await Ticket.find({
        user:req.user._id,
        consented:null,
        $where : `this.service.time_valid + this.claimed > ${Date.now()} || !this.claimed`

    })

    res.render("user_views/active_tickets",{
        tickets: JSON.stringify(tickets),
        user : JSON.stringify(req.user)
    });
});

router.get('/user/logout',async (req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/user/login'); 
})



router.get("/testing",async(req,res) =>{
dummy  = spawn('python', ['test.py']);

dummy.stdout.on('data', function(data) {
    sys.print(data.toString());
});
res.send("Hello");

}
module.exports = router; 