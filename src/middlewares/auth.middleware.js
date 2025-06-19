const JwtService = require('../modules/auth/auth.jwt.service');
const UnauthorizedError = require('../errors/UnauthorizedError');

function authJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedError("Token Tidak Ditemukan!"));
    }
    // 0 [1]
    // Bearer {token}

    const token = authHeader.split(' ')[1]

    // {token}

    try {
        const decoded = JwtService.verify(token);
        if (!decoded || !decoded.id) {
            throw new UnauthorizedError("Token ini sudah tidak valid atau kadaluarsa");
        }
        console.log("Decoded JWT:", decoded);
        req.user = decoded;
        req.userId = decoded.id;
        next();
    } catch (error) {
        throw new UnauthorizedError("Token ini sudah tidak valid atau kadaluarsa");
    }
}

module.exports = authJWT;