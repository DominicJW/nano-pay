const mongoose = require('mongoose');
const userDB = mongoose.createConnection('mongodb://localhost/NanoUser',{useNewUrlParser: true, useUnifiedTopology : true});//_id, billinginfo,balance


//could set budget for each site /service and have auto consents and auto refusing
const UserSchema  = new mongoose.Schema({
    name :{
        type  : String
    },
    email :{
        type  : String
    } ,
    password :{
        type  : String
    },
    credit: {
        type: Number
    }
});
const User= userDB.model('User',UserSchema);
//const User= userDB.model('User',UserSchema);
module.exports = {User,UserSchema};