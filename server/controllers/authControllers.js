import { createRandomID, generateID, STATUS } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import transporter from '../configs/OTP_Config.js';

const ObjectId = mongoose.Types.ObjectId;
let refreshTokens = [];

function generateOTP(length = 6) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}


const sendOTP = async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    
    try {
        // const emailExist = await DB_Connection.Account.findOne({email:email});
        // if(emailExist){
        //     return res.status(STATUS.NOT_FOUND).json({
        //         success:false,
        //         message:'Email đã được đăng ký trong hệ thống trong hệ thống!!!'
        //     })
        // }
        const mailOptions = {
            from: "daidat1202@gmail.com",
            to: email,
            subject: 'Mã xác thực OTP',
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                                color: #333;
                            }
                            .email-container {
                                max-width: 600px;
                                margin: 20px auto;
                                background-color: #ffffff;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                padding: 20px;
                            }
                            .email-header {
                                text-align: center;
                                padding: 10px 0;
                                border-bottom: 1px solid #ddd;
                            }
                            .email-header h2 {
                                color: #000;
                                margin: 0;
                            }
                            .email-body {
                                padding: 20px 0;
                                text-align: center;
                            }
                            .otp-code {
                                font-size: 24px;
                                font-weight: bold;
                                color: #000;
                                margin: 20px 0;
                                padding: 10px;
                                border-radius: 5px;
                                background-color: #f4f9f4;
                                display: inline-block;
                            }
                            .email-footer {
                                text-align: center;
                                font-size: 12px;
                                color: #777;
                                margin-top: 30px;
                                padding-top: 10px;
                                border-top: 1px solid #ddd;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="email-header">
                                <h2>Mã xác thực OTP của bạn</h2>
                            </div>
                            <div class="email-body">
                                <p>Chào bạn,</p>
                                <p>Đây là mã OTP để xác thực email của bạn:</p>
                                <div class="otp-code">${otp}</div>
                                <p>Mã OTP này có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                            </div>
                            <div class="email-footer">
                                <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        const newOTP = new DB_Connection.OTP({
            email,
            otp
        })
        await newOTP.save();
        await transporter.sendMail(mailOptions);

        return res.status(STATUS.OK).send('Đã gửi OTP');
        
    } catch (error) {
        // Xử lý lỗi và trả về phản hồi
        return res.status(STATUS.SERVER_ERROR).json({ error: error.message });
    }
};

const checkOTP = async(req,res,next)=>{
    const{email,otp} = req.body
    try {
        const OTP = await DB_Connection.OTP.findOne({email:email,otp:otp});
        if(!OTP){
            return res.status(STATUS.BAD_REQUEST).json({message:'Mã xác nhận không hợp lệ!!!!'});
        }
        const currentTime = Date.now();
        if (currentTime > OTP.expiryTime) {
            return res.status(STATUS.BAD_REQUEST).json({ message: 'OTP đã hết hạn!!!!' });
        }
        next();
    } catch (error) {
        return res.status(STATUS.SERVER_ERROR).json({ error: error.message });
    }
}

const registerAccount = async (req, res) => {
    const{user_name, role, phonenumber, email,password} = req.body
    const id= generateID(8);
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password,salt)
        const newUser = new DB_Connection.User({
            user_name,
            role,
            id:id,
            phonenumber,
            email:email
        });
        await newUser.save();
        const newAccount = new DB_Connection.Account({
            user: new ObjectId(newUser._id),
            email,
            password:hashed
        });
        await newAccount.save();

        res.status(STATUS.CREATED).json({message: 'Tạo tài khoản thành công', newAccount});
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json(error);
    }
};

// create token
const generateAccessToken =  async (user)=>{
   return jwt.sign({
    id: user._id,
    role:user.role
   },
   process.env.JWT_ACCESS_KEY,
   {expiresIn: "1h"})
}
const generateNewAccessToken =  async (user)=>{
    return jwt.sign({
     id: user.id,
     role:user.role
    },
    process.env.JWT_ACCESS_KEY,
    {expiresIn: "1h"})
 }
 

const generateRefreshToken =  async (user)=>{
    return jwt.sign({
     id: user._id,
     role:user.role
    },
    process.env.JWT_REFRESS_KEY,
    {expiresIn: "365d"})
}

const generateNewRefreshToken =  async (user)=>{
    return jwt.sign({
     id: user.id,
     role:user.role
    },
    process.env.JWT_REFRESS_KEY,
    {expiresIn: "365d"})
}

const createTokens = async (user) => {
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    return { accessToken, refreshToken };
};

const loginUser = async (req,res)=>{
    const {email, password} = req.body
    try {
        const account = await DB_Connection.Account.findOne({email:email}).populate('user');
        if(!account){
            return res.status(STATUS.NOT_FOUND).json({message: 'email không tồn tại!!'});
        }
        const validPassword = await bcrypt.compare(
            password,
            account.password
        )
        if(!validPassword){
            return res.status(STATUS.NOT_FOUND).json({message: 'Mật khẩu không đúng'});
        }
        if(account && validPassword){
                const { accessToken, refreshToken } = await createTokens(account.user);
                // refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken,{
                    httpOnly: true,
                    secure: false,
                    path:'/',
                    sameSite:'strict',
                })
            // const {password,...orther}= account._doc;
            // const user = account.user._doc;
            return res.status(STATUS.OK).json({
                success:true,
                user:account.user,accessToken
            });      
        }
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({message: error.message});
    }
}

const refressToken = async (req,res)=>{
    const refreshToken = req.cookies.refreshToken; // Refresh Token từ cookie
    if (!refreshToken) return res.status(401).send('No refresh token provided');
    // if (!refreshTokens.includes(refreshToken)) {
    //     return res.status(403).json({
    //         message:"Refresh token is not valid " ,
    //         data:refreshToken
    //     });
    // }
    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESS_KEY, async (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json({
                    message:"Refresh token is not valid " ,
                });
            }
            
            // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            try {
                const newAccessToken = await generateNewAccessToken(user);
                const newRefreshToken = await generateNewRefreshToken(user);
                
                // refreshTokens.push(newRefreshToken);

                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: "strict",
                });
                
                console.log('New Access Token:', newRefreshToken);
                res.status(200).json({
                    accessToken: newAccessToken  
                });
            } catch (error) {
                console.log(error);
                res.status(500).json("Lỗi trong quá trình tạo Access Token");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(401 ).json("Refresh token không hợp lệ");
    }
}

const logoutUser = async(req,res)=>{
    res.clearCookie('refreshToken');
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
    res.status(STATUS.OK).json({
        success:true,
        message:'Đăng xuát thành công'
    });
}



export { registerAccount , loginUser ,sendOTP , checkOTP ,refressToken,logoutUser};
