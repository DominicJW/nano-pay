const mongoose = require('mongoose');
const newExpDB = mongoose.createConnection('mongodb://localhost/newExp',{useNewUrlParser: true, useUnifiedTopology : true});

const TestSchema  = new mongoose.Schema({
	a:{type : Number},
	b:{type : Number},
	c:{type : Number},
	d:{type : Number}
})


const Test = newExpDB.model('Test',TestSchema);
module.exports = {Test,TestSchema};