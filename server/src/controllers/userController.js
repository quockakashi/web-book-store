const userModel = require('../models/userModel');

/**
 * desc Remove a user by admin
 */
const removeUser = async (req, res, next) => {
    console.log(req.user);
    try {
        const { _id } = await req.body
        const user = await userModel.findById(_id);
        if ( user ) {
            await user.deleteOne()
                return res.status(200).json({
                message: 'User deleted',
                data: {
                    _id,
                }
            });
        } else {
            return res.status(404).json({
                        message: `${_id} not found!`,
                    })
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
};

module.exports = {
    removeUser,
}