const router = require('express').Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const cloudinary = require('../configs/cloudinary');

// crate new user
router.post('/user', async (req, res, next) => {
    try {
        const { fullName, email, phoneNumber, avatar, username, password } = req.body;

        let uploadedAvatar = null;

        if(avatar.trim()) {
            const result = await cloudinary.uploader.upload(avatar, {
            folder: 'book-store-system/avatars',
            })
            uploadedAvatar = {public_id: result.public_id, url: result.secure_url}
        }

        const encodedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({ fullName, email, phoneNumber, username, password: encodedPassword, avatar: uploadedAvatar});

        res.status(201).json({
            message: 'User created',
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
        next(err);
    }
})

module.exports = router;