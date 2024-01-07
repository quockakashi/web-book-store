const redirectConfirmPage = (req, res, next) => {
    if(req.user && !req.user.confirmed) {
        return res.redirect(`/confirm-email?id=${req.user._id}`);
    }
    next();
};


const requireLogin = (req, res, next) => {
    if(!req.user) {
        return res.redirect('/login');
    }
    next();
};

module.exports = {
    redirectConfirmPage,
    requireLogin,
}