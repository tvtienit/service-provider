require('dotenv').config();

exports.cfg = {
    // Application Configuration
    ApiKey: process.env.API_KEY,
    Environment: process.env.NODE_ENV || 'development',
    AppHost: process.env.APP_HOST,
    AppPort: process.env.APP_PORT,
    WSPort: process.env.WS_PORT,

    // Database Configuration
    DBSync: process.env.DB_SYNC || 0,
    DBName: process.env.DB_NAME,
    DBHost: process.env.DB_HOST || 'localhost',
    DBPort: process.env.DB_PORT || '27017',
    DBUser: process.env.DB_USER,
    DBPwd: process.env.DB_PASSWORD,

    // JWT Configuration
    JwtSecret: process.env.JWT_SECRET,
    JwtExpired: process.env.JWT_EXPIRED || '1h',

    // CORs Configuration
    CORsWhiteList: process.env.CORs_WHITE || ''
};