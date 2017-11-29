const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const { cfg } = require('../config/app');

exports.getTokenFromRequest = req => (
    req.headers.authorization
);

exports.createToken = payload => (
    jwt.sign(payload, cfg.JwtSecret, {
        expiresIn: cfg.JwtExpired
    })
);

exports.verifyToken = (token) => (
    jwt.verify(token, cfg.JwtSecret)
);

exports.encryptPassword = (password, callback) => {
    // Generate a salt then run callback
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return callback(err); }

        // Hash (encrypt) our password using the salt
        return bcrypt.hash(password, salt, null, (err2, hash) => {
            if (err2) { return callback(err2); }
            return callback(null, hash);
        });
    });
};

exports.comparePassword = (currentPassword, candidatePassword, callback) => (
    bcrypt.compare(candidatePassword, currentPassword, (err, isMatch) => {
        if (err) { return callback(err); }
        return callback(null, isMatch);
    })
);