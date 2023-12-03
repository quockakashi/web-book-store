const isAdmin = (req, res, next) => {
    const user = req.user; // after user had been authenticated, passport assign user field in request
    console.log('isAdmin(): ', user);
    if(user && user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'No allowed',
            error: 'For bidden',
        })
    }
}

module.exports = {
    isAdmin,
}