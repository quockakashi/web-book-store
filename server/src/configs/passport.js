const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
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


const options = {
    jwtFromRequest: req => {
        if (req && req.cookies) {
            token = req.cookies['AccessToken'];
        }
        // console.log('Token: ', token);
        return token;
    },
    secretOrKey: process.env.JWT_SECRET_KEY,
}


passport.use(new JwtStrategy(options, async (payload, done) => {
    try {
        console.log('Jwt Passport: ', payload);
        const { userId } = payload;
        if(!userId) {
            return done(null, false, 'Invalid token');
        }
        const user = await userModel.findById(userId).exec();
        if( !user ) {
            return done(null, false, 'Invalid user id');
        }
        return done(null, user);
    } catch(err) {
        done(err);
    }
}));

module.exports = passport;