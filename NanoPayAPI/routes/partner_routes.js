const express = require('express');
const router  = express.Router();
const {ensureAuthenticated,ensurePartnerAuthenticated} = require('../config/auth') 
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


router.get('/partner', async(req,res)=>{
    return res.render('partner_views/welcome');
})

router.get('/partner/dashboard',ensurePartnerAuthenticated,async(req,res)=>{
    myuser = req.user;
    return res.render('partner_views/dashboard',{
        user: myuser
    });
})

router.get('/partner/login',async(req,res)=>{
    return res.render('partner_views/login');
})
router.get('/partner/register',async (req,res)=>{
    return res.render('partner_views/register')
    })


router.post('/partner/login',async (req,res,next)=>{
    passport.authenticate('partner-local',{
        successRedirect : '/partner/dashboard',
        failureRedirect: '/partner/login',
        failureFlash : true
    })(req,res,next)
})

router.post('/partner/register',async (req,res)=>{
    const {name,email, password, password2} = req.body;
    let errors = [];
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }
    if(errors.length > 0 ) {
    return res.render('partner_views/register', {
        errors : errors,
        name : name,
        email : email,
        password : password,
        password2 : password2})
    } 
    else {
       Partner.findOne({email : email}).exec((err,user)=>{
        if(user) {
            errors.push({msg: 'email already registered'});
            return res.render('partner_views/register',{errors,name,email,password,password2})  
           } else {
            const newPartner = new Partner({
                name : name,
                email : email,
                password : password,
                credit : 1000
            });
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newPartner.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newPartner.password = hash;
                    //save user
                    newPartner.save()
                    .then((value)=>{
                        req.flash('success_msg','You have now registered!');
                        res.redirect('/partner/login');
                    })
                    .catch(value=>
                     console.log(value)
                        );
                }));
             }
       })
    }
})

//create
router.post('/partner/register_service',ensurePartnerAuthenticated,async (req,res)=>{
    const {name,cost_to_user,price_to_partner,time_to_consent,time_valid,keys} = req.body;//is this in json?
    let errors = [];
    if(!name || !cost_to_user || !price_to_partner || !time_to_consent || !time_valid|| !keys) {
        errors.push({msg : "Please fill in all fields"})
    }
    if(errors.length > 0 ) {
    return res.render('partner_views/register_service', {
        errors : errors})
    } 
    else {
       Service.findOne({name : name}).exec((err,service)=>{
        if(service) {
            errors.push({msg: 'service with that name already registered'});
            return res.render('partner_views/register_service',{errors,name,cost_to_user,price_to_partner})  
           } else {
            const newService = new Service({
                name : name,
                cost_to_user : cost_to_user,
                price_to_partner : price_to_partner,
                time_to_consent: time_to_consent,
                time_valid:time_valid,
                keys:[keys],
                partner : req.user._id
            });
                    newService.save()
                    .then((value)=>{
                        req.flash('success_msg','You have now registered a new service!');
                        res.redirect('/partner/dashboard');
                    })
                    .catch(value=>
                     console.log(value)
                    );
             }
       })
    }
})
//read

//update

//delete


router.get('/partner/logout',async (req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/partner/login'); 
})

router.get('/partner/register_service',async (req,res)=>{
    return res.render('partner_views/register_service')
    })




module.exports = router; 