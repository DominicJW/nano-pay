const mongoose = require('mongoose');
const partnerDB = mongoose.createConnection('mongodb://localhost/NanoPartner',{useNewUrlParser: true, useUnifiedTopology : true});
const PartnerSchema  = new mongoose.Schema({
    name :{
        type  : String
    },
    email :{
        type  : String
    },
    password :{
        type  : String
    },
    date :{
        type : Date,
        default : Date.now()
    },
    credit : {
        type : Number,
        required : true,
        default: 1000
    }
});
const Partner= partnerDB.model('Partner',PartnerSchema);

module.exports = {Partner,PartnerSchema};