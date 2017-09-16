/**
 * Created by isaac on 2/21/16.
 */
import mongoose from 'mongoose';
const Admin = mongoose.model('Admin');

export default function register(req) {

  return new Promise((resolve, reject) => {

    const { name, password } = req.body;
    if (name && password) {

      Admin.findOne({ name }, (err, doc) => {
        if (doc) {
          reject({
            msg: '此昵称已经被占用了!'
          });
        } else {
          const user = new Admin({ name });
          user.password = user.generateHash(password);

          user.save(err => {
            if (err) reject({ msg: '用户注册失败!', err });

            user.password = null;
            req.session.user = user;
            resolve({ user });
          });
        }
      });
    } else {
      reject({ msg: '缺少用户名或密码!' });
    }
  });
}
