//partner is unneeded part of ticket, as partner is stored in service

const mongoose = require('mongoose');
const {User,UserSchema}= require("./user");
//Next : Make  have attribute of finished state


const {PartnerSchema} = require("./partner");
const {ServiceSchema} = require("./service");
const ticketDB = mongoose.createConnection('mongodb://localhost/NanoTicket',{useNewUrlParser: true, useUnifiedTopology : true});//{ticketstate:{consentd,paid,claimed}
const TicketSchema  = new mongoose.Schema({
    user : {
        type: String //need to do this as crud doesnt work wit embedded docs
    },//wont allow the model as type. //sql would have been better perhaps
    service :{ 
        type  : ServiceSchema
    },
    //keep everything in this orger
    initiated :{
        type : Number,
        default : Date.now()
    }, 
    consented :{
        type : Number,
        default : null
    },
    paid :{
        type : Number,
        default : null
    },
    claimed : {
        type : Number,
        default : null
    },
    origin : {type : String},
    state : {type : String},
    start :{type:Number}
    //claimedapikey :{}
    //initiated apikey: {}(incase origin unneeded) 
    // origin will always be a needed parameter
});


const Ticket = ticketDB.model('Ticket',TicketSchema);
module.exports = {Ticket,TicketSchema};

//log the origins I want to facilitate cross site usage so a service can be called from multiple origins
//only save tickets longterm which have been involved in credit transaction.