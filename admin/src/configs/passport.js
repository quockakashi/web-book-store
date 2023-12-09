const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

passport.use(new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
    try {
        const user = await userModel.findOne({email: username}).exec();
        if(!user) {
            return done(null, false, 'Invalid credentials');
        }
        return (await bcrypt.compare(password, user.password)) ? done(null, user) : done(null, false, 'Invalid credentials');
    } catch(err) {
        done(err);
    } 
}));


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
    try {
        console.log('id', _id);
        const user = await userModel.findById(_id || '6561438820ac22b4e4045397').exec();
        if(!user) {
            done(null, false);
        } else {
            done(null, user);
        }
    } catch(err) {
        done(err);
    }
});
module.exports = passport;