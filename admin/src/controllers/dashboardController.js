const renderDashboardPage = async (req, res) => {
    res.render('dashboard/index', {layout: 'layouts/index', title: 'Home - HCMUS Book Store System', component: {name: 'Dashboard', subtitle: `Welcome ${req.user?.fullName}!`, url: '/home'}, user: req.user});
};

module.exports = {
    renderDashboardPage,
}