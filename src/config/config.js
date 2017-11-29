module.exports = {
    server: {
        host: 'localhost',
        port: 4000
    },
    client: {
        host: 'localhost',
        port: 4000
    },
    database: {
        host: 'localhost',
        port: 27017,
        name: 'service-provider'
    },
    auth: {
        secret: 'TvTienIT@Service-Provider', // JWT Secret
        expiresIn: 86400 // expires in 24 hours
    },
    admin: {
        username: 'admin'
    }
};