const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const {sendConfirmAccountMail} = require('../utils/sendMailUtils');
const jwt = require('jsonwebtoken');

const renderRegisterPage = (req, res, next) => {
    res.render('register', {layout: 'layouts/login'})
};

const renderConfirmEmailPage = async(req, res, next) => {
    const {id} = req.query;
    const user = await userModel.find({_id: id}, '_id fullName email confirmed'); 

    if(!user) {
        return res.redirect('/404');
    }

    if(user.confirmed) {
        return res.redirect('/homepage');
    }

    res.render('confirm-email', {layout: 'layouts/login', user})
}

const checkDuplicateInfo = async (req, res, next) => {
    const {username, email} = req.query;

    const duplicateUsername = await userModel.countDocuments({
        username: new RegExp(`.*${username.trim()}.*`, 'i')
    })


    if(duplicateUsername != 0) {
        return res.status(200).json({
            isDuplicated: true,
            message: 'This username was used',
        })
    }

    const duplicateEmail = await userModel.countDocuments({
        email: new RegExp(`.*${email.trim()}.*`, 'i')
    });

    if(duplicateEmail != 0) {
        return res.status(200).json({
            isDuplicated: true,
            message: 'This email was used',
        })
    } 

    res.status(200).json({
        isDuplicated: false,
    })
}

const register = async(req, res, next) => {
    let {fullName, username, email, phoneNumber, password} = req.body;
    console.log(fullName, username, password)
    password = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        fullName,
        username,
        email,
        phoneNumber,
        password,
        confirmed: false,
    });


    if(user) {
        const confirmToken = jwt.sign({
            purpose: 'confirm-email',
            id: user._id,
        }, process.env.SECRET_KEY, {expiresIn: 24 * 60 * 60 * 1000});
        sendConfirmAccountMail(user.email, `http://localhost:8080/confirm-token/${confirmToken}`);

        res.status(201).json({
            message: 'User created',
            data: {
                id: user._id,
                fullName: user.fullName,
            }
        })
    }
}

module.exports = {
    renderRegisterPage,
    renderConfirmEmailPage,
    checkDuplicateInfo,
    register,
}