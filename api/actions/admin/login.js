import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');
import jwt from 'jsonwebtoken';
import config from '../../config';

export default function login(req) {

    return new Promise((resolve, reject) => {

        const { name, password } = req.body;
        Admin
            .findOne({ name })
            .populate('avatar')
            .exec((error, doc) => {
                if (error) {
                    reject({ msg: '登陆失败!', error });
                } else {
                    if (doc) {
                        if (doc.validPassword(password)) {

                            const user = {
                                _id: doc._id,
                                password: doc.password,
                                name: doc.name,
                                groups: doc.groups,
                                friends: doc.friends,
                                role: doc.role,
                                create_time: doc.create_time
                            };

                            const token = jwt.sign(
                                user,
                                config.tokenSecret,
                                { expiresIn: config.tokenMaxAge }
                            );

                            resolve({ user, token });

                        } else {
                            reject({ msg: '密码错误' });
                        }
                    } else {
                        reject({ msg: '用户不存在' });
                    }
                }
            });
    });

}
