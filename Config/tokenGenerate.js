
const result = require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');

if(result.error){
    throw result.error
}


function  generateToken(params = {}){
    return jsonwebtoken.sign(params,process.env.SECRET,{expiresIn:300 })
}

module.exports = generateToken;