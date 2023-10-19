const http = require("http");
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const axios = require('axios');
cors = require('cors');
//app.use(cookieParser());
app.use(bodyParser.json());

//could use a live view of database where credit is stored, and on update...not practical
app.options('/chatsite/auth',cors({origin: "http://localhost:5050",credentials:true}));
app.post('/chatsite/auth',cors({origin: "http://localhost:5050",credentials:true}),(req1,res1) => {
    //should pick up auth error here
    ticket = req1.body;
    console.log(ticket);
    axios.post('http://127.0.0.1:3000/CLAIMTICKET?key=key3',ticket)
    .then(res2 => {
      //or here
        res1.send(`${res2.data} $ticket`);
    })
    .catch(error => {
        console.error(error);
        res1.send(error);
    });
});

app.get('/', function(req,res){
  res.sendFile(__dirname+"/public/chat.html");
})

app.get('/chat.js', (req,res) => {
  res.sendFile(__dirname+"/public/chat.js");
});

const PORT = 5050;
app.listen(5050,() => {
  console.log("express server on 5050");
});