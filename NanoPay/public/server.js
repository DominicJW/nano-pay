const http = require("http");
const path = require("path");
const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var count = "a";
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const axios = require('axios');

app.use(cookieParser());
app.use(bodyParser.json());


app.use((req,res,next) =>{
  res.header("Access-Control-Allow-Origin", "http://localhost:5050");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})



app.post('/chatsite/auth',(req1,res1) => {
  ticket = req1.body;
axios
  .post('http://127.0.0.1/CLAIMTICKET', {"token":ticket["token"]})
  .then(res2 => {
    console.log(`statusCode: ${res2.status}`);
    doSomething(res1);
  }).catch(error => {
    console.error(error);
    res1.end();
  });
});



function doSomething(argument) {
  console.log("Something Done");
  argument.send("Ticket Claimd Successfully");
  }



app.get('/', function(req,res){
  console.log("chat.html");
  res.sendFile(__dirname+"/public/chat.html");
})





app.get('/chat.js', (req,res) => {
  console.log("chat.js");
  res.sendFile(__dirname+"/public/chat.js");
});


const PORT = 5050;
app.listen(5050,() => {
  console.log("express server on 5050");

});