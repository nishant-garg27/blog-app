
const { validateToken } = require("../Services/authentication")

function checkCookieAuthentication(cookieName) {
    return (req,res,next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
            return next();
        }
        try{
            const userpayload = validateToken(tokenCookieValue);
            req.user = userpayload;
        }catch(error) {}
        return next();
    }
}

module.exports = {
    checkCookieAuthentication,
}