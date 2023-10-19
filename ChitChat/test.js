const express = require('express');
const app = express();
cors = require('cors');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



app.options('/',cors({origin: ["http://localhost:5050","http://192.168.1.185"]}));
app.post('/',cors({origin: ["http://localhost:5050","http://192.168.1.185"]}),async(req,res) => {
  console.log(Date.now());
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log("----complete----")
  res.send("Success");
})





app.get('/', async function(req,res){
  console.log(req);
  res.sendFile(__dirname+"/public/test.html");
});

app.get('/chat.js', (req,res) => {
  res.sendFile(__dirname+"/public/test.js");
});


const PORT = 80;
app.listen(PORT,() => {
  console.log("express server on "+PORT);
});