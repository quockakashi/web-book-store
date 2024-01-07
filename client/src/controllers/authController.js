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

    res.render('confirm-email', {layout: 'layouts/confirm', user})
}

const renderLoginPage = (req, res, next) => {
    if(req.user) {
        return res.redirect('/');
    } else {
        return res.render('login', {layout: 'layouts/login'});
    }
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

const confirmToken = async(req, res, next) => {
    const {token} = req.params;

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        if(payload.purpose != 'confirm-email') {
            throw new Error();
        }
        const id = payload.id;
        const user = await userModel.findById(id);
        user.confirmed = true;
        user.save();
        return res.redirect('/login');
    } catch(error) {
        return res.redirect('/404');
    }
}

module.exports = {
    renderRegisterPage,
    renderConfirmEmailPage,
    checkDuplicateInfo,
    register,
    confirmToken,
    renderLoginPage
}