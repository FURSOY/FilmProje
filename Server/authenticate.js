const jwt = require('jsonwebtoken');
const User = require('./Models/userModel');

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token'ı alın

    if (!token) {
        return res.status(401).json({ message: 'Yetkisiz erişim' });
    }

    try {
        const decoded = jwt.verify(token, "secretkey123"); // JWT'yi doğrulayın
        req.user = await User.findById(decoded._id); // Kullanıcıyı bulun

        if (!req.user) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Geçersiz token' });
    }
};

module.exports = authenticate;
