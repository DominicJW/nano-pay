const {User} = require('../models/user');
const {Partner} = require("../models/partner");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport){




    //bug not here
    passport.use("partner-local", new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
        Partner.findOne({email:email})
        .then((user)=>{
            if(!user){
                return done(null,false,{message:'email not registered'});
            }
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                } 
                else{
                    return done(null,false,{message: 'password incorrect'});
                }
            })
        })
        .catch((err)=>{console.log(err)})
    })
    )

    passport.use("user-local", new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
        User.findOne({email:email})
        .then((user)=>{
            if(!user){
                return done(null,false,{message:'email not registered'});
            }
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message: 'password incorrect'});
                    }
            })
        })
        .catch((err)=>{console.log(err)})
    })
    )

    passport.serializeUser(function(user,done) {
        done(null,user.id);
    })



    //here
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err1,user){
            if (user)
                done(err1,user);
            else{
                Partner.findById(id,function(err2,partner){
                    done(err2,partner);
                })
            }
        })
    })
}