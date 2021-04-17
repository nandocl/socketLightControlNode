/*Guard*/

const jwt = require('jwt-simple')

const sql = require('./maria')
const env = require('./env')

async function auth(req, res, next){
    try{
        const token = req.headers.authorization.split(' ')[1]
        jwt.decode(token, env.secret)
        next()
    }
    catch(err){
        return res.status(202).send("Sin acceso")
    }
}

module.exports = auth