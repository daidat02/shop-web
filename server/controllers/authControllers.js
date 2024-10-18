import { createRandomID, STATUS } from '../configs/Constants.js'; 
import DB_Connection from '../model/DBConnection.js'; 
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import transporter from '../configs/OTP_Config.js';

const ObjectId = mongoose.Types.ObjectId;

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
        const emailExist = await DB_Connection.Account.findOne({email:email});
        if(emailExist){
            return res.status(STATUS.NOT_FOUND).json({message:'Email đã được đăng ký trong hệ thống trong hệ thống!!!'})
        }
        const mailOptions = {
            from: "daidat1202@gmail.com",
            to: email,
            subject: 'Mã xác thực OTP',
            text: `Mã OTP của bạn là: ${otp}`,
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
    const id= createRandomID();
    try {
       

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password,salt)
        const newUser = new DB_Connection.User({
            user_name,
            role,
            id:id,
            phonenumber,
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

const generateRefressToken =  async (user)=>{
    return jwt.sign({
     id: user._id,
     role:user.role
    },
    process.env.JWT_REFRESS_KEY,
    {expiresIn: "1h"})
}

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
            const accessToken= await generateAccessToken(account.user);

            const {password,...orther}= account._doc;
            const user = account.user._doc;
            res.status(STATUS.OK).json({...orther,user,accessToken});      
            console.log(user)      
        }
    } catch (error) {
        res.status(STATUS.SERVER_ERROR).json({message: error.message});

    }
}

// Xuất hàm registerAccount
export { registerAccount , generateAccessToken , generateRefressToken, loginUser ,sendOTP , checkOTP};
