const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateJWT = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: '24h' })
}

const checkJWT = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (err) {
        return false;
    }
};

const generateAccessToken = (userId, res) => {
    const token = jwt.sign(
        { userId },
        JWT_SECRET_KEY,
        { expiresIn: '24h' }
    );
    res.cookie(
        'AccessToken', 
        token, 
        { 
            httpOnly: true, 
            sameSite: 'strict', 
            maxAge: 24 * 60 * 60 * 1000 
        }
    );
}

const generateRefreshToken = (userId, res) => {
    const token = jwt.sign(
        { userId },
        JWT_SECRET_KEY,
        { expiresIn: '30d' },
    );
    res.cookie(
        'RefreshToken',
        token,
        {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        }
    );
}

module.exports = {
    generateJWT,
    checkJWT,
    generateAccessToken,
    generateRefreshToken,
}