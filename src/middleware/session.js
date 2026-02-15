function authMiddleware(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({
            ok: false
        });
    }
    next();
}

export default authMiddleware;