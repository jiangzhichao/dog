/**
 * Created by isaac on 15/10/28.
 */
import path from 'path';

const uploadFolder = path.join(__dirname, '../uploads');
module.exports = {
    db: 'mongodb://localhost/jzc',
    sessionDb: 'mongodb://localhost/jzc',
    sessionDbConf: {
        secret: 'jzc rule!!!!',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    },
    uploadFolder,
    tokenSecret: 'only-you-s-b',
    tokenMaxAge: 60 * 60 * 24,
    tokenHeader: 'x-access-token'
};
