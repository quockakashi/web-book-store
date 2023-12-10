const userModel = require('../models/userModel');
const cloudinary = require('../configs/cloudinary');
const bcrypt = require('bcrypt');
const DatauriParser = require('datauri/parser');
const path = require('path');
const toDataUri = require('../utils/dataUri');
const mongoose = require('mongoose');

const NUMBER_USER_PER_PAGE =  5;

// render index page
const renderIndexPage = async(req, res, next) => {
    try {

        let { page, sortBy, sortDir, search } = req.query;
        page = parseInt(page) || 1;
        sortBy = sortBy || "email";
        sortDir = sortDir || "asc";

        let matchedUsers = [];
        if (search) {
            if(mongoose.Types.ObjectId.isValid(search)) {
                const user = await userModel.findById(search).lean();
                 if(user) {
                    matchedUsers.push(user);
                }
            } else {
                matchedUsers = await userModel.find({
                    $or: [
                        { fullName: new RegExp(`.*${search.toLowerCase()}.*`, 'i')},
                        { email: new RegExp(`.*${search.toLowerCase()}.*`, 'i')}
                    ]
                }).lean();
            }
        }
        else {
            matchedUsers = await userModel
            .find()
            .sort([[sortBy, sortDir == 'asc' ? 1 : -1]])
            .lean();
        }
        
        const users = matchedUsers.slice((page - 1) * NUMBER_USER_PER_PAGE, (page - 1)* NUMBER_USER_PER_PAGE + NUMBER_USER_PER_PAGE);

        const totalPage = Math.ceil(matchedUsers.length / NUMBER_USER_PER_PAGE);

        const prevPage = page === 1 ? null : page - 1;
        const nextPage = page === totalPage ? null : page + 1;

        res.render('users/index', {layout: 'layouts/index', title: 'Users - HCMUS Book Store System', component: {name: 'Users', subtitle: 'User Management',}, users, meta: {
            showPagination: totalPage > 1,
            page,
            totalPage,
            prevPage,
            nextPage,
            isEmpty: true,
            sortBy,
            sortDir,
            noPrev: !prevPage,
            noNext: !nextPage,
            search,
            hasSearch: !!search,
        }});
    } catch(err) {
        console.error(err);
        next(err);
    };
};

/**render edit user page */
const renderEditPage = async(req, res, next) => {
    try {
        const { id } = req.params;
        if(id) {
            const user = await userModel.findOne({_id: id}).exec();
            if(user) {
                return res.render('users/edit-user', {layout: 'layouts/index', title: 'Edit User - HCMUS Book Store', component: {name: 'Users', subtitle: `Edit user #${id}`}, user})
            }
        }
        res.render('error/404'); 
    } catch(err) {
        next(err);
    }
}

/**
 * desc Remove a user by admin
 */
const removeUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if(user) {
            return res.status(200).json({
                message: `User ${user.fullName} has been deleted`,
            })
        } else {
            return res.status(404).json({
                message: `User ${id} not found!`,
            })
        };
    } catch(err) {
        console.error(err);
        next(err);
    }
};

const editUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        let {
            fullName,
            email,
            password,
            role,
        } = req.body;

        let avatar = req.files?.avatar;

        // check stored user
        let user = await userModel.findById(id);
        if(!user) {
            return res.status(404).json({
                message: `User ${id} not found`,
            })
        };

        // check email
        if(email != user.email) {
            const user = await userModel.findOne({email});
            if(user) {
                return res.status(400).json({
                    message: 'This email was used by another',
                })
            }
        }

        const editInfo = {
            fullName,
            email,
            role,
        };

        // handle if editing includes password
        if(password) {
            password = await bcrypt.hash(password, 10);
            editInfo.password = password;
        };

        // handle if editing includes avatar
        if(avatar) {
            // covert data from binary file to data URI
            avatar = toDataUri(avatar);
            if(user.avatar?.public_id) {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }

            const result = await cloudinary.uploader.upload(avatar, {
                folder: 'book-store-system/avatars',
            });

            avatar = {public_id: result.public_id, url: result.secure_url};
            editInfo.avatar = avatar;
        };

        console.log('User info: ', editInfo);

        user = await userModel.findOneAndUpdate({_id: id}, editInfo);
        return res.status(200).json({
            message: 'User updated',
            data: {
                _id: user._id,
                fullName: user.fullName,
                role: user.role,
            }
        })
    } catch(err) {
        console.error(err);
        next(err);
    }
}

module.exports = {
    renderIndexPage,
    renderEditPage,
    removeUser,
    editUser,
}