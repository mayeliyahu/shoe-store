const adminAuth = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};


//router.get('/admin/users', adminAuth, (req, res) => {
    // דף ניהול משתמשים
//});
