
//should only allow ticket to be claimed by smae site???
//need to have website creds and user creds, for tracking purposes 
// i want third party refers to work. //supported through nano or at least easy for other sites to implement.
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// const { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;


const client = new MongoClient('mongodb://localhost:27017');
client.connect();
console.log('Connected successfully to server');
// const ticketDB = client.db("NanoTicket");//{ticketstate:{consentd,paid,claimed}
// const userDB = client.db("NanoUser");_id, billinginfo,balance
//const partnerDB = client.db("NanoPartner");
//const recieptDB = client.db("NanoReciept");// old tickets {Dates:{init,cons,claim,paid},Serv,units,org,prov,usr}                                                                   //could store as offsets from initiate











app.use(cookieParser());
app.use(bodyParser.json());

app.get('/chat.js', (req,res) => {
  console.log("chat.js");
  res.sendFile(__dirname+"/public/chat.js");
});

//app.use(cors());
app.use((req,res,next) =>{
  res.header("Access-Control-Allow-Origin", "http://localhost:5050");//should be dynamically alocated (getorigin, check against db of aproved origins?)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

const ticketDB = client.db("MyFirstDB");
app.post('/AUTHUSER',(req,res) => {
  collection = ticketDB.collection('SecondCollection');
  ticket = req.body;
  ticket["UserConsent"] = false;
  collection.insertOne(ticket,(err,result)=>{
    if (err){
      console.log(err);
      return res.send("Failed");
    }
    //should consent be awaited here? $$$
    requestUserConsent(result.insetedId);
    res.send(JSON.stringify({"token":result.insertedId}));
  });
});


//should this be async?
function NanoBillUser(token){
  //return await consent
  // user consent should occur here 
  //but the two ops are different.
    return true;
  }


async function requestUserConsent(arg){
  //send notification then
  //wait for ticket["UserConsent"] to be true
  //could use polling with a max timeout
  return true;
}

function awaitUserConsent(arg){
  //send notification then
  //wait for ticket["UserConsent"] to be true
  //could use polling with a max timeout
  return true;
}

function checkIfTokenValid(obj){
//{UserName , HostName , TokenName, Token}
  return true;
}//checks that all values are as expected


//consent must be ok before response sent. all async prog can be done on client(partner) side.
app.post('/CLAIMTICKET',(req,res) => {
  console.log("Claimgin ticket");
  collection = ticketDB.collection('SecondCollection');
  ticket = req.body;
  if ((awaitUserConsent(req)) & (NanoBillUser(ticket))){
    console.log("SUCCESFUL ticket CLAIM");
    collection.updateOne({"_id":new ObjectId(ticket["token"])},{$set :{"Claimed":true,"Date":"now"}},{upsert : false},(err,result) => {
      res.send("Success");}
      );
  }
  else {
    console.log("incremaentBill failed");
    collection.updateOne({  "_id" : new ObjectId(ticket["token"])  },{$set: {"Failed":true,"Date":"now"}} ,{upsert : false} ,(err,result) =>{
    res.send("Failure");
    });
  // or here $$$ problem is that here it uses the webservers time and resource.
}
})


const PORT = 8080;
app.listen(8080,() => {
  console.log("express server on 8080");
});