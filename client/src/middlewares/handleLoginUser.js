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

const requireAdmin = (req, res, next) => {
    if(req.user.role !== 'admin' ) {
        return res.redirect('/403');
    }
    next();
}

module.exports = {
    redirectConfirmPage,
    requireLogin,
    requireAdmin,
}