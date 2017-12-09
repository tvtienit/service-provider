require('dotenv').config();

exports.cfg = {
    // Application Configuration
    ApiKey: process.env.API_KEY,
    Environment: process.env.NODE_ENV || 'development',
    AppHost: process.env.APP_HOST,
    AppPort: process.env.APP_PORT,
    WSPort: process.env.WS_PORT,

    // Database Configuration
    DBName: process.env.DB_NAME,
    DBHost: process.env.DB_HOST,
    DBPort: process.env.DB_PORT,
    DBUser: process.env.DB_USER,
    DBPwd: process.env.DB_PASSWORD,

    // JWT Configuration
    JwtSecret: process.env.JWT_SECRET,
    JwtExpired: process.env.JWT_EXPIRED || '1h',

    // CORs Configuration
    CORsWhiteList: process.env.CORs_WHITE || ''
};