const express = require('express');
const router  = express.Router();
const {ensureAuthenticated,ensureUserAuthenticated,ensurePartnerAuthenticated,ensureUserAuthenticatedAPI} = require('../config/auth') 
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

router.use(bodyParser.json());

router.options('/AUTHUSER',cors({origin: "http://localhost:5050",credentials:true}));
router.post('/AUTHUSER',cors({origin: "http://localhost:5050",credentials:true}),ensureUserAuthenticatedAPI, async (req,res) => {
    host = req.headers.host;//host is this (NANOPAY) site for some reason
    origin = req.headers.origin;//and origin is the partner site
    user = req.user;
    try {
        service = await Service.findById(req.body["service"]).exec();
    }
    catch(err){
        /*
        switch (err){
            case ServiceDoesNotExist:{}
            case ServiceBanned:{}
            case UserBannedError:{}
            //should have functionality for server to bann users// server sends ticket token of user to ban
            case UserBannedFromServer:{} 
            case UserDoesNotExist:{}//should never occur
            case PartnerBannedError:{}
            case PartnerDoesNotExist:{}
        }
        */
        console.log(err);
        res.statusCode = 501
        return res.send(err);
    }
    if( !(service.origins.length == 0) && !service.origins.includes(origin) ){
        return res.send("Website Not Authenticated");
    }
    exist = await Ticket.findOne({
        user:user._id,
        service:service,
        $where : `this.service.time_valid + this.claimed >${Date.now()} || !this.claimed`,
        origin : origin // is this needed? Yes if origin is going to be saved// Can't overwrite that 

    });
    if (exist){

        return res.send(exist._id);//not returning any existing ticket_ids
    }
    //should trade cpu time for storage think consented unpaid and unclaimed
    const newTicket = new Ticket({
        user:user._id,
        service : service,
        origin : origin
    });
    newTicket.save();
    return res.send(newTicket._id);
});

async function NanoBillUser(ticket){
    user = await User.findById(ticket.user).exec();
    if (ticket.service.cost_to_user < user.credit){
        user.credit = user.credit - ticket.service.cost_to_user;
        await user.save();
        ticket.paid = Date.now();
        await ticket.save();
        return true;
    }
    console.log("incremaentBill failed");
    return false;
  }

async function NanoPayPartner(ticket){
    partner = await Partner.findById(ticket.service.partner);
    partner.credit = partner.credit + ticket.service.price_to_partner;
    partner.save();
    return true;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


router.post("/CLAIMTICKET",async (req,res)=>{
    //should check that serviceID is valid
    _id = req.body._id;
    ticket = await Ticket.findById(_id).exec();
    if (ticket.service._id != req.body.service){
        return res.send("TicketNotForThisService");//can easily be implemented on partnerside but 
    }
    ticket.start = Date.now();
    await ticket.save();
    if (!responses[_id]) {
        console.log("f0");
        responses[_id] = [res];
    }
    else{
        console.log("f1");
        responses[_id].push(res);
    }
    return;
})





responses = {};
async function g(){
    console.log("init");
    while (true){
        a: for(var _id in responses){
            ticket = await Ticket.findById(_id).exec();
            if (!ticket){
                while (responses.length>0){
                    responses[_id][0].send("NoTicket")
                    responses[_id].splice(0,1);
                    continue a;
                }
            }
            if (Date.now() - ticket.start > ticket.service.time_to_consent){
                while (responses[_id].length>0){
                    responses[_id][0].send("ConsentTimeOut");
                    responses[_id].splice(0,1);
                }
                    continue a;
            }

            else if (ticket.claimed && Date.now() - ticket.claimed > ticket.service.time_valid){
                while (responses[_id].length>0){
                    responses[_id][0].send("TicketExpired")
                    responses[_id].splice(0,1);
                }
                    continue a;
            }

            else if (ticket.claimed && Date.now() - ticket.claimed < ticket.service.time_valid){
                while (responses[_id].length>0){
                    responses[_id][0].send("TicketValid")
                    responses[_id].splice(0,1);
                }
                    continue a;
            }

            else if (ticket.consented){
                if (! await NanoBillUser(ticket)){
                    while (responses[_id].length>0){
                        responses[_id][0].send("UserFundsError")
                        responses[_id].splice(0,1);
                    }
                    continue a;
                }
                if (! await NanoPayPartner(ticket)){
                    RefundUser(ticket);
                    while (responses[_id].length>0){
                        responses[_id][0].send("PartnerPayFailed")
                        responses[_id].splice(0,1);
                    }
                    continue a;
                }
                ticket.claimed = Date.now();
                ticket.save();
                responses[_id][0].send("NewTicket");
                responses[_id].splice(0,1);
                while (responses[_id].length>0){
                    responses[_id][0].send("TicketValid")
                    responses[_id].splice(0,1);
                }
            }
        }

        await sleep(100);
    }
}

async function RefundUser(ticket){
    user =await User.findById(ticket.user).exec();
    if (!user){
        throw "NoUser";
    }
    user.credit = user.credit+ticket.service.cost_to_user;
    User.save();//should catch
} 


router.post('/GIVE_CONSENT',async (req,res) => {
    ticket = await Ticket.findById(req.body["id"]);
    if (!ticket)
        return res.send("TicketNotExist");
    if (ticket.user != req.user._id)
        return res.send("NotYourTicket");
    if (ticket.refused)
        return res.send("ConsentAlreadyRefused");
    if (ticket.service.timeout +ticket.claimed > Date.now())
        return res.send("ConsentTimeOut");
    ticket.consented = Date.now();
    await ticket.save();
    res.send("Success");
});



//
router.post('/REFUSE_CONSENT',async (req,res) => {
    ticket = await Ticket.findById(req.body._id);
    if (!ticket)
        return res.send("TicketNotExist");
    if (ticket.user != req.user._id){
        return res.send("NotYourTicket");
    }
    if (ticket.consented)
        res.send("CannotRevokeConsent");
    ticket.refused = Date.now();
    res.send("Success");
});

g();
module.exports = router;