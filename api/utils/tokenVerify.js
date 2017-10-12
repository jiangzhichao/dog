/**
 * Created by jiang on 2017/10/11.
 */
import jwt from 'jsonwebtoken';
import dbConfig from '../config';

const noVerify = ['/admin/login', '/admin/logout'];

export default (req, res, next) => {
    if (noVerify.indexOf(req.path) > -1) {
        next();
    } else {
        const token = req.body.token || req.query.token || req.headers[dbConfig.tokenHeader] || req.cookies.token;
        if (token) {
            jwt.verify(token, dbConfig.tokenSecret, (err, decoded) => {
                if (err) {
                    if (req.path === '/admin/loadAuth') {
                        next();
                    } else {
                        res.status(500).json({ msg: '登录过期，请退出重新登录' });
                    }
                } else {
                    req.token = decoded;
                    next();
                }
            });
        } else {
            if (req.path === '/admin/loadAuth') {
                next();
            } else {
                res.status(500).json({ msg: '无权限或未登录' });
            }
        }
    }
};
