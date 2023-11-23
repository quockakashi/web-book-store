const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
    try {
        const user = await userModel.findOne({email: username}).exec();
        if(!user) {
            return done(null, false, 'Invalid credentials');
        }
        await bcrypt.compare(password, user.password) ? done(user) : done(null, false, 'Invalid credentials');
    } catch(err) {
        done(err);
    } 
}));

module.exports = passport;