function authMiddleware(req, res, next) {
    console.log("sesion actual:", req.session.usuario);
    if (!req.session.usuario) {
        return res.status(401).json({
            ok: false,
            message: "No autorizado"
        });
    }
    next();
}

export default authMiddleware;