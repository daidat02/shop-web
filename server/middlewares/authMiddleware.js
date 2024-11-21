import jwt from 'jsonwebtoken';

const vertifyToken = async(req, res, next)=>{
    const token = req.headers.token

    if(token){
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY,(err, user)=>{
            if(err){
                return res.status(403).json('token is not valid');
            }
            req.user=user;
            next();
        })
    }
    else{
        return res.status(401).json('You are not authentication');
    }
}


export { vertifyToken}