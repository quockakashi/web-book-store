const userModel = require('../models/userModel');
const cloudinary = require('../configs/cloudinary');
const bcrypt = require('bcrypt');
const { sendConfirmAccountMail } = require('../utils/sendMailUtils');
const { generateJWT, checkJWT, generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');


/**Register an account  */
const registerAccount = async (req, res, next) => {
    let imageUrl;
    try {
        const { fullName, email, phoneNumber, avatar, username, password } = req.body;

        let uploadedAvatar = null;

        if(avatar.trim()) {
            const result = await cloudinary.uploader.upload(avatar, {
            folder: 'book-store-system/avatars',
            })
            uploadedAvatar = {public_id: result.public_id, url: result.secure_url}
            imageUrl = result.public_id;
        }

        const encodedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({ fullName, email, phoneNumber, username, password: encodedPassword, avatar: uploadedAvatar});

        const confirmToken = generateJWT(user._id);
        sendConfirmAccountMail('quocng777@gmail.com', `http://localhost:3000/api/auth/confirm-token/${confirmToken}`);

        res.status(201).json({
            message: 'User created, mail sent',
            data: {
                _id: user._id,
                fullName: fullName,
                email: email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                avatar: user.avatar?.url || 'https://res.cloudinary.com/dsv2f6qxf/image/upload/v1700707010/book-store-system/avatars/default-avatar.png',
            }
        })
    } catch(err) {
        if(imageUrl) {
            await cloudinary.uploader.destroy(imageUrl);
        }
        console.error(err);
        next(err);
    }
};

const confirmAccountByMail = async(req, res, next) => {
    try {
        const { token } = req.params;
    if(token) {
        const payload = checkJWT(token);
        if(payload) {
            const user = await userModel.findById(payload.userId).exec();
            if(user) {
                user.confirmed = true;
                await user.save();
                return res.redirect('http://localhost:3000/login');
            }
        }
    }
    res.status(400).json({
        message: 'Confirm failed',
        meta: {
            reconfirm: `http://localhost:3000/api/user/reconfirm`,
        }
    })
} catch(err) {
    console.error(err);
    next(err);
}
};

// login user
const loginUser = async (req, res, next) => {
    console.log('hello')
    try {
        if(req.user) {
            const {_id, fullName, email, createdAt, updatedAt, avatar} = req.user;
            generateAccessToken(_id, res);
            generateRefreshToken(_id, res);
            return res.status(200).json({
            message: 'Login successfully',
            data: {
                _id,
                fullName,
                email,
                createdAt, 
                updatedAt,
                avatar: avatar.url,
            }
        })
        } else {
            throw new Error('Invalid credential');
        }
    } catch(err) {
        console.error(err);
        return res.status(401).json({
            message: 'Auth failed!',
        })
    }
}


module.exports = {
    registerAccount,
    confirmAccountByMail,
    loginUser,
}