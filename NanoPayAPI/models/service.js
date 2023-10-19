const mongoose = require('mongoose');
//hmmm does this mean the same service can cost different amounts?
const serviceDB = mongoose.createConnection('mongodb://localhost/NanoService',{useNewUrlParser: true, useUnifiedTopology : true});

//Ticket.findOne({user:user,valid_until:{<now}, service:service})//pretty essential
const ServiceSchema  = new mongoose.Schema({
    name:{type: String},
    cost_to_user: {type : Number},
    price_to_partner : {type: Number},
    partner : {type : String},//or ObjectId
    date_registered : {type : Number,default : Date.now()},
    time_to_consent : {type : Number},//amount
    origins : {type : [String],default: null},
    time_valid : {type : Number},//amount of time//if null its single use
    keys : {type : [String]}
})
//
const Service= serviceDB.model('Service',ServiceSchema);


module.exports = {Service,ServiceSchema};