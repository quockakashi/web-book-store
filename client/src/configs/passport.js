const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

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

passport.use (
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/google/callback',
        passReqToCallback: true,
    }, 
    async function (req, accessToken, refreshToken, profile, done) {
        let createdUser = await userModel.findOne({email: profile.email});
        if(!createdUser) {
            // if not have an user with this email, create this user;
            const password = await bcrypt.hash(uuid.v4(), 10);
            const user = {
                fullName: profile.displayName,
                username: profile.email.split('@')[0],
                email: profile.email,
                image: {
                    url: profile.picture,
                },
                confirmed: true,
                provider: 'google',
                password,
            }

            createdUser = await userModel.create(user);
        } else if(!createdUser.confirmed) {
            createdUser.confirmed = true;
            await createdUser.save();
        }
        done(null, createdUser);
    })
);


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
    try {
        console.log('id', _id);
        const user = await userModel.findById(_id).exec();
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