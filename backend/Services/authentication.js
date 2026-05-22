const jwt = require('jsonwebtoken')
const secret = '1irst_pro'
 
function createToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role
    };
    
    const token = jwt.sign(payload,secret);
    return token
}

function validateToken(token) {
    const payload = jwt.verify(token,secret);
    return payload;
}

module.exports = {
    createToken,
    validateToken,
}